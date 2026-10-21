import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { DatabaseSync } from 'node:sqlite';
import {
    createCipheriv,
    createDecipheriv,
    createHash,
    createHmac,
    randomBytes,
    scrypt as scryptCallback,
    timingSafeEqual
} from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'node:url';
import { Contract, formatUnits, getAddress, Interface, isAddress, JsonRpcProvider } from 'ethers';

const scrypt = promisify(scryptCallback);
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const databasePath = path.resolve(root, process.env.DATABASE_PATH || './data/stakeai.sqlite');
const stakeaiTokenAddress = process.env.STAKEAI_TOKEN_ADDRESS?.trim() || '';
const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS?.trim() || '';
const stakingContractVersion = process.env.STAKING_CONTRACT_VERSION?.trim() || '1';
if (!['1', '2'].includes(stakingContractVersion)) {
    throw new Error('STAKING_CONTRACT_VERSION must be 1 or 2.');
}
if ((stakeaiTokenAddress && !isAddress(stakeaiTokenAddress))
    || (stakingContractAddress && !isAddress(stakingContractAddress))) {
    throw new Error('STAKEAI_TOKEN_ADDRESS and STAKING_CONTRACT_ADDRESS must be valid EVM addresses.');
}
const isProduction = process.env.NODE_ENV === 'production';
const marketDataBaseUrl = new URL(process.env.MARKET_DATA_BASE_URL || 'https://data-api.binance.vision');
const localMarketHost = ['localhost', '127.0.0.1', '[::1]'].includes(marketDataBaseUrl.hostname);
if ((marketDataBaseUrl.protocol !== 'https:' && !(localMarketHost && !isProduction && marketDataBaseUrl.protocol === 'http:'))
    || marketDataBaseUrl.username || marketDataBaseUrl.password
    || marketDataBaseUrl.pathname !== '/' || marketDataBaseUrl.search || marketDataBaseUrl.hash) {
    throw new Error('MARKET_DATA_BASE_URL must be a public HTTPS origin (or a local HTTP test origin).');
}
const openAiApiBaseUrl = new URL(process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1');
const localOpenAiHost = ['localhost', '127.0.0.1', '[::1]'].includes(openAiApiBaseUrl.hostname);
if ((openAiApiBaseUrl.protocol !== 'https:' && !(localOpenAiHost && !isProduction && openAiApiBaseUrl.protocol === 'http:'))
    || openAiApiBaseUrl.username || openAiApiBaseUrl.password
    || openAiApiBaseUrl.search || openAiApiBaseUrl.hash) {
    throw new Error('OPENAI_API_BASE_URL must use HTTPS (or a local HTTP test origin).');
}
const openAiApiKey = process.env.OPENAI_API_KEY?.trim() || '';
const openAiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const assistantTestMode = process.env.ASSISTANT_TEST_MODE === 'true';
const assistantProviderSetting = (process.env.ASSISTANT_PROVIDER || 'auto').trim().toLowerCase();
if (!['auto', 'library', 'openai', 'ollama'].includes(assistantProviderSetting)) {
    throw new Error('ASSISTANT_PROVIDER must be auto, library, openai, or ollama.');
}
const assistantProvider = assistantTestMode
    ? 'library'
    : assistantProviderSetting === 'auto'
        ? openAiApiKey ? 'openai' : 'library'
        : assistantProviderSetting;
const ollamaBaseUrl = new URL(process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434');
if (ollamaBaseUrl.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(ollamaBaseUrl.hostname)
    || ollamaBaseUrl.username || ollamaBaseUrl.password || ollamaBaseUrl.search || ollamaBaseUrl.hash) {
    throw new Error('OLLAMA_BASE_URL must be a local HTTP origin, such as http://127.0.0.1:11434.');
}
const ollamaModel = process.env.OLLAMA_MODEL || 'qwen3:1.7b';
const assistantRuntimeMode = assistantProvider === 'library'
    ? 'demo'
    : assistantProvider === 'openai' && !openAiApiKey
        ? 'unavailable'
        : assistantProvider;
const publicOriginUrl = new URL(process.env.PUBLIC_ORIGIN || `http://localhost:${port}`);
if (publicOriginUrl.username || publicOriginUrl.password || publicOriginUrl.pathname !== '/'
    || publicOriginUrl.search || publicOriginUrl.hash) {
    throw new Error('PUBLIC_ORIGIN must be an origin URL without credentials, path, query, or fragment.');
}
const publicOrigin = publicOriginUrl.origin;
const readTaskUrl = (key) => {
    const value = process.env[key]?.trim() || '';
    if (!value) return '';
    let url;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`${key} must be a valid HTTPS URL.`);
    }
    if (url.protocol !== 'https:' || url.username || url.password) {
        throw new Error(`${key} must be an HTTPS URL without credentials.`);
    }
    return url.toString();
};
const taskDefinitions = [
    { key: 'telegram', links: [readTaskUrl('TASK_TELEGRAM_URL')] },
    { key: 'x', links: [readTaskUrl('TASK_X_PROFILE_URL'), readTaskUrl('TASK_X_POST_URL')] },
    { key: 'facebook', links: [readTaskUrl('TASK_FACEBOOK_URL')] }
];
const sessionSecret = process.env.SESSION_SECRET || '';
const apiRateLimitPerMinute = Number(process.env.API_RATE_LIMIT_PER_MINUTE || 60);
const adminEmails = new Set(
    (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

if (sessionSecret.length < 32 || sessionSecret.startsWith('replace-with-')) {
    throw new Error('SESSION_SECRET must contain at least 32 characters. Set it in your local .env file.');
}
if (isProduction && publicOriginUrl.protocol !== 'https:') {
    throw new Error('PUBLIC_ORIGIN must use HTTPS in production.');
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
}
if (!Number.isInteger(apiRateLimitPerMinute) || apiRateLimitPerMinute < 1) {
    throw new Error('API_RATE_LIMIT_PER_MINUTE must be a positive integer.');
}

mkdirSync(path.dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        email_verified INTEGER NOT NULL DEFAULT 0,
        totp_secret TEXT,
        totp_pending_secret TEXT,
        totp_enabled INTEGER NOT NULL DEFAULT 0,
        totp_last_used_step INTEGER NOT NULL DEFAULT 0,
        first_name TEXT NOT NULL DEFAULT '',
        last_name TEXT NOT NULL DEFAULT '',
        trc20_address TEXT NOT NULL DEFAULT '',
        usdt_balance TEXT NOT NULL DEFAULT '0',
        stakeai_balance TEXT NOT NULL DEFAULT '0',
        referral_code TEXT NOT NULL UNIQUE,
        referred_by TEXT REFERENCES users(id),
        disabled_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS email_verifications (
        token_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS email_change_verifications (
        token_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        new_email TEXT NOT NULL,
        expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS totp_recovery_codes (
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        code_hash TEXT NOT NULL,
        PRIMARY KEY (user_id, code_hash)
    );
    CREATE TABLE IF NOT EXISTS totp_login_challenges (
        token_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS collected_service_fees (
        reference TEXT PRIMARY KEY,
        payer_user_id TEXT NOT NULL REFERENCES users(id),
        amount_base_units TEXT NOT NULL,
        asset TEXT NOT NULL,
        collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS referral_commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fee_reference TEXT NOT NULL REFERENCES collected_service_fees(reference),
        beneficiary_user_id TEXT NOT NULL REFERENCES users(id),
        level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
        amount_base_units TEXT NOT NULL,
        asset TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'void')),
        UNIQUE (fee_reference, level)
    );
    CREATE TABLE IF NOT EXISTS task_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        task_key TEXT NOT NULL CHECK (task_key IN ('telegram', 'x', 'facebook')),
        proof TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        reviewed_by TEXT REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TEXT,
        UNIQUE (user_id, task_key)
    );
    CREATE TABLE IF NOT EXISTS paper_portfolios (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        cash_balance_units TEXT NOT NULL DEFAULT '10000000000',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS paper_positions (
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        asset TEXT NOT NULL CHECK (asset IN ('BTC', 'ETH', 'BNB', 'STKAI')),
        quantity_base_units TEXT NOT NULL,
        average_price_base_units TEXT NOT NULL,
        PRIMARY KEY (user_id, asset)
    );
    CREATE TABLE IF NOT EXISTS paper_stakes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        asset TEXT NOT NULL CHECK (asset IN ('USDT', 'BTC', 'ETH', 'BNB', 'STKAI')),
        amount_base_units TEXT NOT NULL,
        reward_base_units TEXT NOT NULL,
        average_price_base_units TEXT NOT NULL,
        offer_id INTEGER NOT NULL CHECK (offer_id IN (0, 1, 2)),
        unlock_at INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'claimed')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        claimed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS paper_trades (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL CHECK (symbol IN ('BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'STKAIUSDT')),
        side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
        quantity_base_units TEXT NOT NULL,
        price_base_units TEXT NOT NULL,
        notional_base_units TEXT NOT NULL,
        fee_base_units TEXT NOT NULL,
        quote_asset TEXT NOT NULL DEFAULT 'USDT' CHECK (quote_asset IN ('USDT', 'BTC', 'ETH', 'BNB')),
        quote_amount_base_units TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS paper_stakes_user_unlock ON paper_stakes(user_id, unlock_at);
    CREATE TABLE IF NOT EXISTS admin_treasury_balances (
        asset TEXT PRIMARY KEY CHECK (asset IN ('USDT', 'BTC', 'ETH', 'BNB', 'STKAI')),
        balance_base_units TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_treasury_audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_user_id TEXT REFERENCES users(id),
        reference TEXT NOT NULL,
        asset TEXT NOT NULL CHECK (asset IN ('USDT', 'BTC', 'ETH', 'BNB', 'STKAI')),
        previous_balance TEXT NOT NULL,
        new_balance TEXT NOT NULL,
        reason TEXT NOT NULL CHECK (reason IN ('initial_inventory', 'admin_adjustment', 'simulated_trade')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS paper_gas_fee_balances (
        asset TEXT PRIMARY KEY CHECK (asset IN ('USDT', 'BTC', 'ETH', 'BNB')),
        balance_base_units TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS paper_gas_fee_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trade_id TEXT NOT NULL REFERENCES paper_trades(id),
        asset TEXT NOT NULL CHECK (asset IN ('USDT', 'BTC', 'ETH', 'BNB')),
        amount_base_units TEXT NOT NULL,
        side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_user_id TEXT NOT NULL REFERENCES users(id),
        target_user_id TEXT NOT NULL REFERENCES users(id),
        action TEXT NOT NULL CHECK (action IN ('user_disabled', 'user_enabled')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS balance_audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_user_id TEXT NOT NULL REFERENCES users(id),
        target_user_id TEXT NOT NULL REFERENCES users(id),
        asset TEXT NOT NULL CHECK (asset IN ('USDT', 'STAKEAI')),
        previous_balance TEXT NOT NULL,
        new_balance TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS user_transfers (
        id TEXT PRIMARY KEY,
        sender_user_id TEXT NOT NULL REFERENCES users(id),
        recipient_user_id TEXT NOT NULL REFERENCES users(id),
        asset TEXT NOT NULL CHECK (asset IN ('USDT', 'STAKEAI')),
        amount_base_units TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        reviewed_by TEXT REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS paper_asset_transfers (
        id TEXT PRIMARY KEY,
        sender_user_id TEXT NOT NULL REFERENCES users(id),
        recipient_user_id TEXT NOT NULL REFERENCES users(id),
        asset TEXT NOT NULL CHECK (asset IN ('BTC', 'ETH', 'BNB')),
        amount_base_units TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        reviewed_by TEXT REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS staking_reward_payouts (
        id TEXT PRIMARY KEY,
        admin_user_id TEXT NOT NULL REFERENCES users(id),
        admin_wallet TEXT NOT NULL,
        recipient_wallet TEXT NOT NULL,
        recipient_email TEXT NOT NULL DEFAULT '',
        position_id TEXT NOT NULL,
        amount_base_units TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'expired')),
        transaction_hash TEXT UNIQUE,
        expires_at INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        paid_at TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS staking_reward_position_once
        ON staking_reward_payouts(recipient_wallet, position_id)
        WHERE status IN ('pending', 'paid');
    CREATE INDEX IF NOT EXISTS user_transfers_status_created
        ON user_transfers(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS user_transfers_sender_created
        ON user_transfers(sender_user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS paper_asset_transfers_status_created
        ON paper_asset_transfers(status, created_at ASC);
    CREATE INDEX IF NOT EXISTS paper_asset_transfers_sender_created
        ON paper_asset_transfers(sender_user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS task_submissions_status_created
        ON task_submissions(status, created_at ASC);
    CREATE INDEX IF NOT EXISTS paper_trades_user_created
        ON paper_trades(user_id, created_at DESC);
`);
const migratePaperTradingCheck = (table, legacyDefinition, updatedDefinition) => {
    const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)?.sql || '';
    if (schema.includes(updatedDefinition)) return;
    if (!schema.includes(legacyDefinition)) {
        throw new Error(`Unexpected ${table} schema; refusing to migrate paper trading data.`);
    }
    db.exec('BEGIN IMMEDIATE');
    try {
        db.exec(schema.replace(`CREATE TABLE ${table}`, `CREATE TABLE ${table}_updated`).replace(legacyDefinition, updatedDefinition));
        db.exec(`INSERT INTO ${table}_updated SELECT * FROM ${table}`);
        db.exec(`DROP TABLE ${table}`);
        db.exec(`ALTER TABLE ${table}_updated RENAME TO ${table}`);
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
};
migratePaperTradingCheck('paper_positions', "('BTC', 'ETH', 'BNB')", "('BTC', 'ETH', 'BNB', 'STKAI')");
migratePaperTradingCheck('paper_trades', "('BTCUSDT', 'ETHUSDT', 'BNBUSDT')", "('BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'STKAIUSDT')");
db.exec('CREATE INDEX IF NOT EXISTS paper_trades_user_created ON paper_trades(user_id, created_at DESC)');
const paperTradeColumns = new Set(db.prepare('PRAGMA table_info(paper_trades)').all().map((column) => column.name));
if (!paperTradeColumns.has('quote_asset')) {
    db.exec("ALTER TABLE paper_trades ADD COLUMN quote_asset TEXT NOT NULL DEFAULT 'USDT' CHECK (quote_asset IN ('USDT', 'BTC', 'ETH', 'BNB'))");
}
if (!paperTradeColumns.has('quote_amount_base_units')) {
    db.exec('ALTER TABLE paper_trades ADD COLUMN quote_amount_base_units TEXT');
}
const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map((column) => column.name));
if (!userColumns.has('disabled_at')) db.exec('ALTER TABLE users ADD COLUMN disabled_at TEXT');
if (!userColumns.has('totp_secret')) db.exec('ALTER TABLE users ADD COLUMN totp_secret TEXT');
if (!userColumns.has('totp_pending_secret')) db.exec('ALTER TABLE users ADD COLUMN totp_pending_secret TEXT');
if (!userColumns.has('totp_enabled')) db.exec('ALTER TABLE users ADD COLUMN totp_enabled INTEGER NOT NULL DEFAULT 0');
if (!userColumns.has('totp_last_used_step')) db.exec('ALTER TABLE users ADD COLUMN totp_last_used_step INTEGER NOT NULL DEFAULT 0');
if (!userColumns.has('first_name')) db.exec("ALTER TABLE users ADD COLUMN first_name TEXT NOT NULL DEFAULT ''");
if (!userColumns.has('last_name')) db.exec("ALTER TABLE users ADD COLUMN last_name TEXT NOT NULL DEFAULT ''");
if (!userColumns.has('username')) db.exec("ALTER TABLE users ADD COLUMN username TEXT NOT NULL DEFAULT ''");
if (!userColumns.has('avatar')) db.exec("ALTER TABLE users ADD COLUMN avatar TEXT NOT NULL DEFAULT ''");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username COLLATE NOCASE) WHERE username <> ''");
if (!userColumns.has('trc20_address')) db.exec("ALTER TABLE users ADD COLUMN trc20_address TEXT NOT NULL DEFAULT ''");
if (!userColumns.has('usdt_balance')) db.exec("ALTER TABLE users ADD COLUMN usdt_balance TEXT NOT NULL DEFAULT '0'");
if (!userColumns.has('stakeai_balance')) db.exec("ALTER TABLE users ADD COLUMN stakeai_balance TEXT NOT NULL DEFAULT '0'");
const initialTreasuryBalances = {
    USDT: '0',
    BTC: '0',
    ETH: '0',
    BNB: '0',
    STKAI: '2100000000000000'
};
const initializeTreasuryBalance = db.prepare(`
    INSERT OR IGNORE INTO admin_treasury_balances (asset, balance_base_units)
    VALUES (?, ?)
`);
for (const [asset, balance] of Object.entries(initialTreasuryBalances)) {
    const initialized = initializeTreasuryBalance.run(asset, balance);
    if (initialized.changes) {
        db.prepare(`
            INSERT INTO admin_treasury_audit_log
                (admin_user_id, reference, asset, previous_balance, new_balance, reason)
            VALUES (NULL, ?, ?, '0', ?, 'initial_inventory')
        `).run(`initial:${asset}`, asset, balance);
    }
}
const initializePaperGasFeeBalance = db.prepare(`
    INSERT OR IGNORE INTO paper_gas_fee_balances (asset, balance_base_units)
    VALUES (?, '0')
`);
for (const asset of ['USDT', 'BTC', 'ETH', 'BNB']) {
    initializePaperGasFeeBalance.run(asset);
}

const app = express();
if (isProduction) app.set('trust proxy', 2);
app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdn.tailwindcss.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'data:'],
            connectSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"]
        }
    }
}));
app.use(express.json({ limit: '16kb', strict: true }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});
const assistantLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 12,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: apiRateLimitPerMinute,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});
app.use('/api', apiLimiter);

const getCookie = (request, name) => {
    const cookieHeader = request.headers.cookie || '';
    for (const part of cookieHeader.split(';')) {
        const separator = part.indexOf('=');
        if (separator < 0) continue;
        if (part.slice(0, separator).trim() === name) {
            return decodeURIComponent(part.slice(separator + 1).trim());
        }
    }
    return '';
};

const hashToken = (value) => createHmac('sha256', sessionSecret).update(value).digest('hex');
const totpEncryptionKey = createHmac('sha256', sessionSecret).update('stakeai-totp-encryption-v1').digest();
const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const encodeBase32 = (value) => {
    let bits = 0;
    let buffer = 0;
    let result = '';
    for (const byte of value) {
        buffer = (buffer << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            result += base32Alphabet[(buffer >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) result += base32Alphabet[(buffer << (5 - bits)) & 31];
    return result;
};
const decodeBase32 = (value) => {
    let bits = 0;
    let buffer = 0;
    const bytes = [];
    for (const character of value.replace(/=+$/, '').toUpperCase()) {
        const digit = base32Alphabet.indexOf(character);
        if (digit < 0) throw new Error('Invalid encrypted authenticator secret.');
        buffer = (buffer << 5) | digit;
        bits += 5;
        if (bits >= 8) {
            bytes.push((buffer >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(bytes);
};
const encryptTotpSecret = (secret) => {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', totpEncryptionKey, iv);
    const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}.${cipher.getAuthTag().toString('hex')}.${ciphertext.toString('hex')}`;
};
const decryptTotpSecret = (encrypted) => {
    const [ivHex, tagHex, ciphertextHex] = encrypted.split('.');
    const decipher = createDecipheriv('aes-256-gcm', totpEncryptionKey, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([
        decipher.update(Buffer.from(ciphertextHex, 'hex')),
        decipher.final()
    ]).toString('utf8');
};
const totpAtStep = (secret, step) => {
    const counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(step));
    const digest = createHmac('sha1', decodeBase32(secret)).update(counter).digest();
    const offset = digest[digest.length - 1] & 0x0f;
    const binary = digest.readUInt32BE(offset) & 0x7fffffff;
    return String(binary % 1_000_000).padStart(6, '0');
};
const matchingTotpStep = (secret, code, now = Date.now()) => {
    if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return null;
    const currentStep = Math.floor(now / 30_000);
    for (const step of [currentStep - 1, currentStep, currentStep + 1]) {
        const expected = totpAtStep(secret, step);
        if (timingSafeEqual(Buffer.from(expected), Buffer.from(code))) return step;
    }
    return null;
};
const normalizeRecoveryCode = (value) => typeof value === 'string'
    ? value.trim().replace(/[\s-]/g, '').toUpperCase()
    : '';
const createRecoveryCodes = () => Array.from(
    { length: 10 },
    () => randomBytes(5).toString('hex').toUpperCase()
);
const normalizeEmail = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validEmail = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    return `${localPart[0]}***@${domain}`;
};
const normalizePersonName = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const validPersonName = (value) => value.length <= 80
    && /^[\p{L}\p{M}][\p{L}\p{M}\s.'â€™-]*$/u.test(value);
const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const validTronAddress = (address) => {
    if (typeof address !== 'string' || !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return false;
    let decoded = 0n;
    for (const character of address) {
        const digit = base58Alphabet.indexOf(character);
        if (digit < 0) return false;
        decoded = decoded * 58n + BigInt(digit);
    }
    let hex = decoded.toString(16);
    if (hex.length % 2) hex = `0${hex}`;
    const leadingZeroes = address.match(/^1*/)?.[0].length || 0;
    const payload = Buffer.concat([Buffer.alloc(leadingZeroes), Buffer.from(hex, 'hex')]);
    if (payload.length !== 25 || payload[0] !== 0x41) return false;
    const checksum = createHash('sha256').update(createHash('sha256').update(payload.subarray(0, 21)).digest()).digest();
    return timingSafeEqual(payload.subarray(21), checksum.subarray(0, 4));
};
const decimalToBaseUnits = (value, decimals) => {
    if (typeof value !== 'string' || !/^(?:0|[1-9]\d{0,29})(?:\.\d+)?$/.test(value)) return null;
    const [whole, fraction = ''] = value.split('.');
    if (fraction.length > decimals) return null;
    return (BigInt(whole) * (10n ** BigInt(decimals))
        + BigInt((fraction + '0'.repeat(decimals)).slice(0, decimals) || '0')).toString();
};
const baseUnitsToDecimal = (value, decimals) => {
    const amount = BigInt(value);
    const divisor = 10n ** BigInt(decimals);
    const fraction = (amount % divisor).toString().padStart(decimals, '0').replace(/0+$/, '');
    return fraction ? `${amount / divisor}.${fraction}` : (amount / divisor).toString();
};
const sendError = (response, status, code) => response.status(status).json({ error: code });

const isUniqueViolation = (error) => error?.code === 'SQLITE_CONSTRAINT_UNIQUE'
    || error?.errcode === 2067
    || /UNIQUE constraint failed/i.test(error?.message || '');

const brevoApiKey = process.env.BREVO_API_KEY || '';
const parseMailbox = (value) => {
    const match = /^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/.exec(value || '');
    return match ? { name: match[1]?.trim() || undefined, email: match[2].trim() } : { email: (value || '').trim() };
};

const smtpReady = Boolean(
    process.env.SMTP_FROM
    && (brevoApiKey || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD))
);

// Railway'in ucretsiz/Hobby planlari giden SMTP'yi engeller; Brevo HTTPS API'si 443 uzerinden calisir.
const brevoMailer = {
    async sendMail({ from, to, subject, text }) {
        const result = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ sender: parseMailbox(from), to: [{ email: to }], subject, textContent: text }),
            signal: AbortSignal.timeout(15000)
        });
        if (!result.ok) throw new Error(`brevo_http_${result.status}: ${(await result.text()).slice(0, 300)}`);
    }
};

console.log(`Mail transport: ${brevoApiKey ? 'brevo-api' : smtpReady ? 'smtp' : 'none'}`);
const mailer = brevoApiKey
    ? brevoMailer
    : smtpReady
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })
    : null;

const createSession = (response, userId) => {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
        .run(hashToken(token), userId, expiresAt);
    response.cookie('stakeai_session', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        expires: new Date(expiresAt)
    });
};

const requireSameOrigin = (request, response, next) => {
    if (request.get('origin') !== publicOrigin) {
        return sendError(response, 403, 'origin_not_allowed');
    }
    next();
};

const requireSession = (request, response, next) => {
    const token = getCookie(request, 'stakeai_session');
    if (!token) return sendError(response, 401, 'authentication_required');

    const session = db.prepare(`
        SELECT users.id, users.email, users.username, users.avatar, users.first_name, users.email_verified, users.disabled_at,
               users.referral_code, sessions.token_hash
        FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `).get(hashToken(token), Date.now());

    if (!session || !session.email_verified || session.disabled_at) {
        if (session?.token_hash) {
            db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(session.token_hash);
        }
        return sendError(response, 401, 'authentication_required');
    }
    session.is_admin = adminEmails.has(session.email.toLowerCase());
    request.user = session;
    next();
};

const consumeSecondFactor = (userId, user, code) => {
    if (!user.totp_enabled) return true;
    const step = user.totp_secret
        ? matchingTotpStep(decryptTotpSecret(user.totp_secret), code)
        : null;
    if (step !== null && step > user.totp_last_used_step) {
        const updated = db.prepare(`
            UPDATE users SET totp_last_used_step = ?
            WHERE id = ? AND totp_enabled = 1 AND totp_last_used_step < ?
        `).run(step, userId, step);
        if (updated.changes === 1) return true;
    }

    const recoveryCode = normalizeRecoveryCode(code);
    if (!/^[A-F0-9]{10}$/.test(recoveryCode)) return false;
    const deleted = db.prepare(`
        DELETE FROM totp_recovery_codes
        WHERE user_id = ? AND code_hash = ?
    `).run(userId, hashToken(recoveryCode));
    return deleted.changes === 1;
};

const requireAdmin = (request, response, next) => {
    requireSession(request, response, (error) => {
        if (error) return next(error);
        if (!request.user.is_admin) return sendError(response, 403, 'admin_access_required');
        next();
    });
};

const passwordDigest = async (password, salt = randomBytes(16)) => {
    const key = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    return `scrypt$16384$8$1$${salt.toString('hex')}$${key.toString('hex')}`;
};

const verifyPassword = async (password, encoded) => {
    const [algorithm, n, r, p, saltHex, keyHex] = encoded.split('$');
    if (algorithm !== 'scrypt' || n !== '16384' || r !== '8' || p !== '1') return false;
    const expected = Buffer.from(keyHex, 'hex');
    const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length, {
        N: Number(n),
        r: Number(r),
        p: Number(p),
        maxmem: 64 * 1024 * 1024
    });
    return expected.length === actual.length && timingSafeEqual(expected, actual);
};

const createReferralCode = () => randomBytes(8).toString('hex').toUpperCase();
const marketAssets = [
    { asset: 'BTC', symbol: 'BTCUSDT' },
    { asset: 'ETH', symbol: 'ETHUSDT' },
    { asset: 'BNB', symbol: 'BNBUSDT' }
];
const paperAssets = [...marketAssets, { asset: 'STKAI', symbol: 'STKAIUSDT' }];
const marketPriceScale = 100_000_000n;
const stkaiReferenceMarket = {
    asset: 'STKAI',
    symbol: 'STKAIUSDT',
    price: '1',
    priceBaseUnits: marketPriceScale.toString(),
    priceType: 'fixed-reference',
    changePercent: null,
    high: '1',
    low: '1',
    quoteVolume: 0,
    candles: []
};
const paperQuantityScale = 100_000_000n;
const paperCashScale = 1_000_000n;
const paperStakeOffers = [
    { durationDays: 7, rewardBps: 500 },
    { durationDays: 30, rewardBps: 2_500 },
    { durationDays: 180, rewardBps: 20_000 }
];
let marketCache = null;
let marketRefresh = null;

const marketDecimalToUnits = (value, decimals) => {
    if (typeof value !== 'string' || !/^(?:0|[1-9]\d{0,20})(?:\.\d+)?$/.test(value)) return null;
    const [whole, fraction = ''] = value.split('.');
    if (fraction.length > decimals) return null;
    return BigInt(whole) * (10n ** BigInt(decimals))
        + BigInt((fraction + '0'.repeat(decimals)).slice(0, decimals) || '0');
};

const unitsToDecimalString = (value, decimals) => {
    const amount = BigInt(value);
    const scale = 10n ** BigInt(decimals);
    const whole = amount / scale;
    const fraction = (amount % scale).toString().padStart(decimals, '0').replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole.toString();
};

const fetchMarketJson = async (url) => {
    const result = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!result.ok) throw new Error(`market_provider_http_${result.status}`);
    return result.json();
};

const getMarketSummary = async () => {
    if (marketCache && Date.now() - marketCache.fetchedAt < 15_000) return marketCache;
    if (marketRefresh) return marketRefresh;

    marketRefresh = (async () => {
        const tickerUrl = new URL('/api/v3/ticker/24hr', marketDataBaseUrl);
        tickerUrl.searchParams.set('symbols', JSON.stringify(marketAssets.map(({ symbol }) => symbol)));
        const [tickers, ...candleSets] = await Promise.all([
            fetchMarketJson(tickerUrl),
            ...marketAssets.map(({ symbol }) => {
                const url = new URL('/api/v3/klines', marketDataBaseUrl);
                url.searchParams.set('symbol', symbol);
                url.searchParams.set('interval', '1h');
                url.searchParams.set('limit', '48');
                return fetchMarketJson(url);
            })
        ]);
        if (!Array.isArray(tickers) || tickers.length !== marketAssets.length) {
            throw new Error('market_provider_invalid_tickers');
        }

        const bySymbol = new Map(tickers.map((ticker) => [ticker.symbol, ticker]));
        const markets = marketAssets.map(({ asset, symbol }, index) => {
            const ticker = bySymbol.get(symbol);
            const candles = candleSets[index];
            const price = marketDecimalToUnits(ticker?.lastPrice, 8);
            const high = marketDecimalToUnits(ticker?.highPrice, 8);
            const low = marketDecimalToUnits(ticker?.lowPrice, 8);
            const changePercent = Number(ticker?.priceChangePercent);
            const quoteVolume = Number(ticker?.quoteVolume);
            if (price === null || price <= 0n || high === null || low === null
                || !Number.isFinite(changePercent) || !Number.isFinite(quoteVolume)
                || !Array.isArray(candles) || candles.length < 25) {
                throw new Error('market_provider_invalid_market_data');
            }
            const history = candles.map((candle) => {
                const close = marketDecimalToUnits(candle?.[4], 8);
                const closeTime = Number(candle?.[6]);
                if (close === null || close <= 0n || !Number.isSafeInteger(closeTime)) {
                    throw new Error('market_provider_invalid_candles');
                }
                return { close: unitsToDecimalString(close, 8), closeTime };
            });
            return {
                asset,
                symbol,
                price: unitsToDecimalString(price, 8),
                priceBaseUnits: price.toString(),
                priceType: 'live',
                changePercent,
                high: unitsToDecimalString(high, 8),
                low: unitsToDecimalString(low, 8),
                quoteVolume,
                candles: history
            };
        });
        const summary = {
            source: 'Binance public market data + STKAI fixed reference',
            interval: '1h',
            fetchedAt: Date.now(),
            markets: [...markets, stkaiReferenceMarket],
            marketDataUnavailable: false
        };
        marketCache = summary;
        return summary;
    })();

    try {
        return await marketRefresh;
    } finally {
        marketRefresh = null;
    }
};

const getPaperPortfolio = (userId) => {
    db.prepare('INSERT OR IGNORE INTO paper_portfolios (user_id) VALUES (?)').run(userId);
    const portfolio = db.prepare(`
        SELECT cash_balance_units, created_at
        FROM paper_portfolios
        WHERE user_id = ?
    `).get(userId);
    const positions = db.prepare(`
        SELECT asset, quantity_base_units, average_price_base_units
        FROM paper_positions
        WHERE user_id = ?
        ORDER BY asset
    `).all(userId).map((position) => ({
        asset: position.asset,
        quantity: unitsToDecimalString(position.quantity_base_units, 8),
        averagePrice: unitsToDecimalString(position.average_price_base_units, 8)
    }));
    const trades = db.prepare(`
        SELECT id, symbol, side, quantity_base_units, price_base_units, quote_asset,
               quote_amount_base_units,
               notional_base_units, fee_base_units, created_at
        FROM paper_trades
        WHERE user_id = ?
        ORDER BY created_at DESC, rowid DESC
        LIMIT 50
    `).all(userId).map((trade) => ({
        id: trade.id,
        symbol: `${trade.symbol.slice(0, -4)}${trade.quote_asset}`,
        quoteAsset: trade.quote_asset,
        side: trade.side,
        quantity: unitsToDecimalString(trade.quantity_base_units, 8),
        price: unitsToDecimalString(trade.price_base_units, 8),
        notional: unitsToDecimalString(trade.notional_base_units, 6),
        fee: unitsToDecimalString(trade.fee_base_units, treasuryDecimals(trade.quote_asset)),
        quoteAmount: trade.quote_amount_base_units === null
            ? null
            : unitsToDecimalString(trade.quote_amount_base_units, treasuryDecimals(trade.quote_asset)),
        createdAt: trade.created_at
    }));
    const stakes = db.prepare(`
        SELECT id, asset, amount_base_units, reward_base_units, offer_id,
               unlock_at, status, created_at, claimed_at
        FROM paper_stakes
        WHERE user_id = ?
        ORDER BY created_at DESC, rowid DESC
        LIMIT 50
    `).all(userId).map((stake) => ({
        id: stake.id,
        asset: stake.asset,
        amount: unitsToDecimalString(stake.amount_base_units, treasuryDecimals(stake.asset)),
        reward: unitsToDecimalString(stake.reward_base_units, treasuryDecimals(stake.asset)),
        offerId: stake.offer_id,
        unlockAt: new Date(stake.unlock_at * 1000).toISOString(),
        status: stake.status,
        canClaim: stake.status === 'active' && stake.unlock_at <= Math.floor(Date.now() / 1000),
        createdAt: stake.created_at,
        claimedAt: stake.claimed_at
    }));
    return {
        cashBalance: unitsToDecimalString(portfolio.cash_balance_units, 6),
        positions,
        trades,
        stakes,
        createdAt: portfolio.created_at
    };
};

const treasuryAssets = ['USDT', 'BTC', 'ETH', 'BNB', 'STKAI'];
const treasuryDecimals = (asset) => asset === 'USDT' ? 6 : 8;
const getTreasuryBalances = () => {
    const balances = db.prepare(`
        SELECT asset, balance_base_units
        FROM admin_treasury_balances
        ORDER BY CASE asset
            WHEN 'USDT' THEN 0 WHEN 'BTC' THEN 1 WHEN 'ETH' THEN 2
            WHEN 'BNB' THEN 3 ELSE 4
        END
    `).all();
    return balances.map(({ asset, balance_base_units }) => ({
        asset,
        balance: unitsToDecimalString(balance_base_units, treasuryDecimals(asset))
    }));
};

const assistantProfiles = {
    code: {
        name: 'STAKEAI Coding Assistant',
        instructions: 'You are the coding assistant created for the STAKEAI project. Help with programming, debugging, code explanations, and technical problem solving. Be accurate, practical, and concise. Ask for missing details when they materially affect the answer. Put code in fenced code blocks and name the language when known. Never claim you executed code or inspected files unless the user provided that evidence. If asked who created you, say the STAKEAI project team created this assistant; do not claim a particular model provider.'
    },
    companion: {
        name: 'STAKEAI Chat Assistant',
        instructions: 'You are the friendly general-purpose conversation assistant created for the STAKEAI project. Answer the user directly, naturally, and in the language they use. Explain difficult topics clearly and acknowledge uncertainty. If asked who created you, say the STAKEAI project team created this assistant; do not claim a particular model provider. Do not invent facts about STAKEAI.'
    },
    strategy: {
        name: 'STAKEAI Crypto Guide',
        instructions: 'You are the educational crypto and strategy explainer created for the STAKEAI project. Explain concepts such as blockchain, trading mechanics, and risk management in clear language. You do not have live market data, must not give personalized financial advice or promise returns, and must never claim to place trades. Mention meaningful risks and uncertainty. If asked who created you, say the STAKEAI project team created this assistant; do not claim a particular model provider.'
    }
};

const assistantKnowledgeBase = JSON.parse(readFileSync(path.join(root, 'data', 'assistant-knowledge.json'), 'utf8'));

const buildAssistantInstructions = (assistantKey, assistant) => [
    assistant.instructions,
    'Use the following verified STAKEAI project facts as authoritative context. Do not invent missing project details or claim access to live account data. Distinguish simulations from real blockchain activity.',
    assistantKnowledgeBase.context.shared,
    assistantKnowledgeBase.context[assistantKey]
].join('\n\n');

const isTurkishAssistantMessage = (question) => /[ÄŸÃ¼ÅŸÃ¶Ã§Ä±Ä°]/i.test(question)
    || /(?:\b(?:bu|nasilsin|nasilsiniz|nasil|nedir|kim|sen|merhaba|selam|tesekkur|site|bot|botlar|asistan|asistanlar|yapar|kod|kripto|risk|strateji|ucret|ucretsiz)\b)/i.test(
        question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Ä±/g, 'i')
    );

const findAssistantKnowledgeReply = (assistantKey, question) => {
    const normalized = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Ä±/g, 'i');
    const entry = assistantKnowledgeBase.entries.find((item) => (
        (!item.assistants || item.assistants.includes(assistantKey))
        && item.patterns.some((pattern) => new RegExp(pattern, 'i').test(normalized))
    ));
    if (!entry) return null;
    const answer = entry[isTurkishAssistantMessage(question) ? 'tr' : 'en'];
    if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error(`Assistant knowledge entry is missing a ${isTurkishAssistantMessage(question) ? 'Turkish' : 'English'} answer.`);
    }
    return answer;
};

const buildDemoAssistantReply = (assistantKey, question) => findAssistantKnowledgeReply(assistantKey, question)
    || assistantKnowledgeBase.fallback[isTurkishAssistantMessage(question) ? 'tr' : 'en'];

const createOpenAiReply = async (assistant, messages) => {
    const url = new URL('chat/completions', `${openAiApiBaseUrl.toString().replace(/\/+$/, '')}/`);
    const result = await fetch(url, {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(25_000),
        headers: {
            authorization: `Bearer ${openAiApiKey}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: openAiModel,
            max_completion_tokens: 700,
            messages: [
                { role: 'system', content: assistant.instructions },
                ...messages
            ]
        })
    });
    if (!result.ok) {
        let providerError = null;
        try {
            providerError = await result.json();
        } catch {
            providerError = null;
        }
        const errorCode = providerError?.error?.code;
        const errorType = providerError?.error?.type;
        if (result.status === 429 && ['insufficient_quota', 'billing_hard_limit_reached', 'credit_balance_exhausted'].includes(errorCode || errorType)) {
            console.warn(`OpenAI assistant request failed with HTTP 429 (${errorCode || errorType}).`);
            throw new Error('ai_assistant_quota_exceeded');
        }
        console.warn(`OpenAI assistant request failed with HTTP ${result.status}${result.status === 429 && (errorCode || errorType) ? ` (${errorCode || errorType})` : ''}.`);
        throw new Error(result.status === 429 ? 'ai_assistant_rate_limited' : 'ai_provider_unavailable');
    }
    const payload = await result.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
        throw new Error('ai_provider_invalid_response');
    }
    return content.trim();
};

const createOllamaReply = async (assistant, messages) => {
    let result;
    try {
        result = await fetch(new URL('/api/chat', ollamaBaseUrl), {
            method: 'POST',
            signal: AbortSignal.timeout(120_000),
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                model: ollamaModel,
                stream: false,
                think: false,
                keep_alive: '30m',
                options: { num_predict: 250 },
                messages: [
                    { role: 'system', content: assistant.instructions },
                    ...messages
                ]
            })
        });
    } catch (error) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') throw error;
        if (error.cause?.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNRESET') {
            throw new Error('ai_local_model_unavailable');
        }
        throw error;
    }
    if (result.status === 404) throw new Error('ai_local_model_not_found');
    if (!result.ok) {
        console.warn(`Local Ollama assistant request failed with HTTP ${result.status}.`);
        throw new Error('ai_provider_unavailable');
    }
    const payload = await result.json();
    const content = payload?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
        throw new Error('ai_provider_invalid_response');
    }
    return content.trim();
};

const createAssistantReply = (assistant, messages) => assistantProvider === 'ollama'
    ? createOllamaReply(assistant, messages)
    : createOpenAiReply(assistant, messages);
app.post('/api/auth/register', authLimiter, requireSameOrigin, async (request, response, next) => {
    try {
        if (!smtpReady) return sendError(response, 503, 'email_service_not_configured');
        const email = normalizeEmail(request.body?.email);
        const password = request.body?.password;
        const firstName = normalizePersonName(request.body?.firstName);
        const lastName = normalizePersonName(request.body?.lastName);
        const trc20Address = typeof request.body?.trc20Address === 'string'
            ? request.body.trc20Address.trim()
            : '';
        const referralCode = typeof request.body?.referralCode === 'string'
            ? request.body.referralCode.trim().toUpperCase()
            : '';
        const username = typeof request.body?.username === 'string' ? request.body.username.trim() : '';

        if (!validEmail(email)) return sendError(response, 400, 'invalid_email');
        if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) return sendError(response, 400, 'invalid_username');
        if (db.prepare('SELECT 1 FROM users WHERE username = ? COLLATE NOCASE AND email <> ?').get(username, email)) {
            return sendError(response, 409, 'username_taken');
        }
        if ((firstName && !validPersonName(firstName)) || (lastName && !validPersonName(lastName))) {
            return sendError(response, 400, 'invalid_name');
        }
        if (trc20Address && !validTronAddress(trc20Address)) {
            return sendError(response, 400, 'invalid_trc20_address');
        }
        if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password) > 128) {
            return sendError(response, 400, 'password_must_be_12_to_128_bytes');
        }
        if (referralCode && !/^[A-F0-9]{16}$/.test(referralCode)) {
            return sendError(response, 400, 'invalid_referral_code');
        }

        const passwordHash = await passwordDigest(password);
        const id = randomBytes(16).toString('hex');
        const verificationToken = randomBytes(32).toString('base64url');
        const verificationHash = hashToken(verificationToken);
        const referrer = referralCode
            ? db.prepare('SELECT id FROM users WHERE referral_code = ?').get(referralCode)
            : null;
        if (referralCode && !referrer) return sendError(response, 400, 'invalid_referral_code');
        const referredBy = referrer?.id || null;

        let userId = id;
        try {
            db.prepare(`
                INSERT INTO users (id, email, password_hash, first_name, last_name, username, trc20_address, referral_code, referred_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(id, email, passwordHash, firstName, lastName, username, trc20Address, createReferralCode(), referredBy);
        } catch (error) {
            if (!isUniqueViolation(error)) throw error;
            // Dogrulanmamis mevcut hesap icin yalnizca dogrulama e-postasi yeniden gonderilir; sifre degistirilmez.
            const existing = db.prepare('SELECT id, email_verified, disabled_at FROM users WHERE email = ?').get(email);
            if (!existing || existing.email_verified || existing.disabled_at) {
                return response.status(202).json({ message: 'If eligible, a verification email has been sent.' });
            }
            userId = existing.id;
            db.prepare('DELETE FROM email_verifications WHERE user_id = ?').run(userId);
        }

        db.prepare('INSERT INTO email_verifications (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
            .run(verificationHash, userId, Date.now() + 30 * 60 * 1000);
        const verificationUrl = new URL('/verify-email.html', publicOrigin);
        verificationUrl.searchParams.set('token', verificationToken);
        try {
            await mailer.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Verify your STAKEAI account',
                text: `Verify your STAKEAI account within 30 minutes: ${verificationUrl.toString()}`
            });
        } catch (error) {
            if (userId === id) db.prepare('DELETE FROM users WHERE id = ?').run(id);
            else db.prepare('DELETE FROM email_verifications WHERE token_hash = ?').run(verificationHash);
            console.error('Email delivery failed during registration.', error);
            return sendError(response, 503, 'verification_email_unavailable');
        }
        response.status(202).json({ message: 'If eligible, a verification email has been sent.' });
    } catch (error) {
        next(error);
    }
});

const isLocalAdminBootstrapRequest = (request) => {
    const localOrigin = !isProduction
        && ['localhost', '127.0.0.1', '[::1]'].includes(publicOriginUrl.hostname);
    const remoteAddress = (request.socket.remoteAddress || '').replace(/^::ffff:/, '');
    return localOrigin && ['127.0.0.1', '::1'].includes(remoteAddress);
};

app.get('/api/admin/bootstrap', (request, response) => {
    if (!isLocalAdminBootstrapRequest(request) || adminEmails.size !== 1) {
        return sendError(response, 404, 'admin_setup_unavailable');
    }
    const email = [...adminEmails][0];
    const existing = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
    if (existing) return sendError(response, 409, 'admin_account_already_exists');
    response.json({ available: true, email });
});

app.post('/api/admin/bootstrap', authLimiter, requireSameOrigin, async (request, response, next) => {
    try {
        if (!isLocalAdminBootstrapRequest(request) || adminEmails.size !== 1) {
            return sendError(response, 404, 'admin_setup_unavailable');
        }
        const email = [...adminEmails][0];
        const password = request.body?.password;
        const confirmation = request.body?.confirmation;
        if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password) > 128) {
            return sendError(response, 400, 'password_must_be_12_to_128_bytes');
        }
        if (confirmation !== password) return sendError(response, 400, 'password_confirmation_mismatch');

        const passwordHash = await passwordDigest(password);
        const id = randomBytes(16).toString('hex');
        db.exec('BEGIN IMMEDIATE');
        try {
            if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'admin_account_already_exists');
            }
            db.prepare(`
                INSERT INTO users (
                    id, email, password_hash, email_verified, first_name, referral_code
                ) VALUES (?, ?, ?, 1, 'Admin', ?)
            `).run(id, email, passwordHash, createReferralCode());
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
        createSession(response, id);
        response.status(201).json({ created: true });
    } catch (error) {
        next(error);
    }
});

app.post('/api/auth/verify-email', authLimiter, requireSameOrigin, (request, response) => {
    const token = request.body?.token;
    if (typeof token !== 'string' || token.length < 32 || token.length > 128) {
        return sendError(response, 400, 'invalid_or_expired_verification');
    }

    const verification = db.prepare(`
        SELECT user_id FROM email_verifications
        WHERE token_hash = ? AND expires_at > ?
    `).get(hashToken(token), Date.now());
    if (!verification) return sendError(response, 400, 'invalid_or_expired_verification');

    db.exec('BEGIN IMMEDIATE');
    try {
        db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(verification.user_id);
        db.prepare('DELETE FROM email_verifications WHERE token_hash = ?').run(hashToken(token));
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.json({ verified: true });
});

app.post('/api/account/verify-email-change', requireSameOrigin, (request, response) => {
    const token = request.body?.token;
    if (typeof token !== 'string' || token.length < 32 || token.length > 128) {
        return sendError(response, 400, 'invalid_or_expired_verification');
    }
    const tokenHash = hashToken(token);
    const verification = db.prepare(`
        SELECT user_id, new_email FROM email_change_verifications
        WHERE token_hash = ? AND expires_at > ?
    `).get(tokenHash, Date.now());
    if (!verification) return sendError(response, 400, 'invalid_or_expired_verification');

    db.exec('BEGIN IMMEDIATE');
    try {
        const updated = db.prepare(`
            UPDATE users SET email = ?, email_verified = 1
            WHERE id = ? AND disabled_at IS NULL AND EXISTS (
                SELECT 1 FROM email_change_verifications
                WHERE token_hash = ? AND expires_at > ?
            )
        `).run(verification.new_email, verification.user_id, tokenHash, Date.now());
        if (updated.changes !== 1) {
            db.exec('ROLLBACK');
            return sendError(response, 400, 'invalid_or_expired_verification');
        }
        db.prepare('DELETE FROM email_change_verifications WHERE user_id = ?')
            .run(verification.user_id);
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(verification.user_id);
        db.prepare('DELETE FROM totp_login_challenges WHERE user_id = ?').run(verification.user_id);
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        if (isUniqueViolation(error)) {
            return sendError(response, 409, 'email_already_in_use');
        }
        throw error;
    }
    response.clearCookie('stakeai_session', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/'
    });
    response.json({ emailUpdated: true, authenticated: false });
});

app.post('/api/auth/login', authLimiter, requireSameOrigin, async (request, response, next) => {
    try {
        const email = normalizeEmail(request.body?.email);
        const password = request.body?.password;
        if (!validEmail(email) || typeof password !== 'string' || Buffer.byteLength(password) > 128) {
            return sendError(response, 400, 'invalid_credentials');
        }

        const user = db.prepare(`
            SELECT id, password_hash, email_verified, disabled_at, totp_enabled
            FROM users WHERE email = ?
        `).get(email);
        const valid = user
            ? await verifyPassword(password, user.password_hash)
            : await passwordDigest(password, Buffer.alloc(16));
        if (!user || !valid || !user.email_verified || user.disabled_at) {
            return sendError(response, 401, 'invalid_credentials_or_unverified_email');
        }

        if (user.totp_enabled) {
            const challenge = randomBytes(32).toString('base64url');
            const expiresAt = Date.now() + 5 * 60 * 1000;
            db.prepare('DELETE FROM totp_login_challenges WHERE expires_at <= ?').run(Date.now());
            db.prepare('INSERT INTO totp_login_challenges (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
                .run(hashToken(challenge), user.id, expiresAt);
            response.cookie('stakeai_2fa_challenge', challenge, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
                path: '/api/auth',
                expires: new Date(expiresAt)
            });
            return response.json({ authenticated: false, twoFactorRequired: true });
        }
        createSession(response, user.id);
        response.json({ authenticated: true });
    } catch (error) {
        next(error);
    }
});

app.post('/api/auth/verify-2fa', authLimiter, requireSameOrigin, (request, response) => {
    const challenge = getCookie(request, 'stakeai_2fa_challenge');
    const code = request.body?.code;
    if (!challenge || typeof code !== 'string' || code.length > 64) {
        return sendError(response, 401, 'invalid_or_expired_two_factor_challenge');
    }
    const tokenHash = hashToken(challenge);
    const pending = db.prepare(`
        SELECT c.user_id, u.totp_secret, u.totp_last_used_step, u.totp_enabled
        FROM totp_login_challenges c
        JOIN users u ON u.id = c.user_id
        WHERE c.token_hash = ? AND c.expires_at > ? AND u.disabled_at IS NULL
    `).get(tokenHash, Date.now());
    if (!pending || !pending.totp_enabled) {
        response.clearCookie('stakeai_2fa_challenge', { path: '/api/auth' });
        return sendError(response, 401, 'invalid_or_expired_two_factor_challenge');
    }
    db.exec('BEGIN IMMEDIATE');
    try {
        if (!consumeSecondFactor(pending.user_id, pending, code)) {
            db.exec('ROLLBACK');
            return sendError(response, 401, 'invalid_two_factor_code');
        }
        db.prepare('DELETE FROM totp_login_challenges WHERE token_hash = ?').run(tokenHash);
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.clearCookie('stakeai_2fa_challenge', { path: '/api/auth' });
    createSession(response, pending.user_id);
    response.json({ authenticated: true });
});

app.get('/api/auth/session', requireSession, (request, response) => {
    response.json({
        authenticated: true,
        email: request.user.email,
        username: request.user.username || request.user.first_name || request.user.email.split('@')[0],
        avatar: request.user.avatar || '',
        isAdmin: request.user.is_admin
    });
});

app.post('/api/auth/logout', requireSameOrigin, (request, response) => {
    const token = getCookie(request, 'stakeai_session');
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    response.clearCookie('stakeai_session', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/'
    });
    response.json({ authenticated: false });
});

app.get('/api/assistants/status', (_request, response) => {
    response.set('Cache-Control', 'no-store').json({
        mode: assistantRuntimeMode,
        configured: ['openai', 'ollama'].includes(assistantRuntimeMode)
    });
});

app.post('/api/assistants/chat', assistantLimiter, requireSameOrigin, async (request, response) => {
    const { assistant: assistantKey, messages } = request.body || {};
    const assistant = Object.hasOwn(assistantProfiles, assistantKey)
        ? assistantProfiles[assistantKey]
        : null;
    if (!assistant || !Array.isArray(messages) || messages.length < 1 || messages.length > 10
        || messages[messages.length - 1]?.role !== 'user'
        || messages.some((message) => !message || !['user', 'assistant'].includes(message.role)
            || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 4000)) {
        return sendError(response, 400, 'invalid_assistant_request');
    }

    if (assistantRuntimeMode === 'unavailable') return sendError(response, 503, 'ai_assistant_not_configured');
    if (assistantRuntimeMode === 'demo') {
        return response.set('Cache-Control', 'no-store').json({
            assistant: assistantKey,
            mode: 'demo',
            reply: buildDemoAssistantReply(assistantKey, messages[messages.length - 1].content.trim())
        });
    }
    if (assistantRuntimeMode === 'ollama') {
        const knowledgeReply = findAssistantKnowledgeReply(assistantKey, messages[messages.length - 1].content.trim());
        if (knowledgeReply) {
            return response.set('Cache-Control', 'no-store').json({
                assistant: assistantKey,
                mode: 'ollama',
                source: 'knowledge',
                reply: knowledgeReply
            });
        }
    }

    try {
        const reply = await createAssistantReply({
            ...assistant,
            instructions: buildAssistantInstructions(assistantKey, assistant)
        }, messages);
        response.set('Cache-Control', 'no-store').json({
            assistant: assistantKey,
            mode: assistantRuntimeMode,
            reply
        });
    } catch (error) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
            return sendError(response, 504, 'ai_assistant_timeout');
        }
        if (['ai_assistant_quota_exceeded', 'ai_assistant_rate_limited', 'ai_local_model_unavailable', 'ai_local_model_not_found', 'ai_provider_unavailable', 'ai_provider_invalid_response'].includes(error.message)) {
            const status = error.message.startsWith('ai_assistant_') ? 503 : 502;
            return sendError(response, status, error.message);
        }
        console.error('Unexpected error while contacting the configured AI provider.', error);
        return sendError(response, 502, 'ai_provider_unavailable');
    }
});

app.get('/api/tasks', (_request, response) => {
    response.json({
        reward: '10',
        asset: 'USDT',
        tasks: taskDefinitions.map((task) => ({
            key: task.key,
            links: task.links,
            configured: task.links.every(Boolean)
        }))
    });
});

app.get('/api/account/tasks', requireSession, (request, response) => {
    const submissions = new Map(db.prepare(`
        SELECT task_key, proof, status, created_at, reviewed_at
        FROM task_submissions
        WHERE user_id = ?
    `).all(request.user.id).map((submission) => [submission.task_key, submission]));
    response.json({
        reward: '10',
        asset: 'USDT',
        tasks: taskDefinitions.map((task) => {
            const submission = submissions.get(task.key);
            return {
                key: task.key,
                links: task.links,
                configured: task.links.every(Boolean),
                status: submission?.status || 'available',
                proof: submission?.proof || '',
                submittedAt: submission?.created_at || null,
                reviewedAt: submission?.reviewed_at || null
            };
        })
    });
});

app.post('/api/account/tasks', requireSameOrigin, requireSession, (request, response) => {
    const taskKey = request.body?.taskKey;
    const proof = typeof request.body?.proof === 'string' ? request.body.proof.trim() : '';
    const task = taskDefinitions.find((definition) => definition.key === taskKey);
    if (!task) return sendError(response, 400, 'invalid_task');
    if (!task.links.every(Boolean)) return sendError(response, 409, 'task_not_configured');
    if (!proof || proof.length > 1000 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(proof)) {
        return sendError(response, 400, 'invalid_task_proof');
    }

    db.exec('BEGIN IMMEDIATE');
    try {
        const existing = db.prepare(`
            SELECT id, status
            FROM task_submissions
            WHERE user_id = ? AND task_key = ?
        `).get(request.user.id, task.key);
        if (existing && existing.status !== 'rejected') {
            db.exec('ROLLBACK');
            return sendError(response, 409, 'task_already_submitted');
        }
        if (existing) {
            db.prepare(`
                UPDATE task_submissions
                SET proof = ?, status = 'pending', reviewed_by = NULL,
                    created_at = CURRENT_TIMESTAMP, reviewed_at = NULL
                WHERE id = ? AND status = 'rejected'
            `).run(proof, existing.id);
        } else {
            db.prepare(`
                INSERT INTO task_submissions (id, user_id, task_key, proof)
                VALUES (?, ?, ?, ?)
            `).run(randomBytes(16).toString('hex'), request.user.id, task.key, proof);
        }
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.status(201).json({ taskKey: task.key, status: 'pending' });
});

app.get('/api/admin/tasks', requireAdmin, (_request, response) => {
    const submissions = db.prepare(`
        SELECT s.id, s.task_key, s.proof, s.created_at, u.email
        FROM task_submissions s
        JOIN users u ON u.id = s.user_id
        WHERE s.status = 'pending'
        ORDER BY s.created_at ASC, s.id ASC
        LIMIT 100
    `).all().map((submission) => ({
        id: submission.id,
        taskKey: submission.task_key,
        proof: submission.proof,
        userEmail: submission.email,
        submittedAt: submission.created_at
    }));
    response.json({ submissions });
});

app.post('/api/admin/tasks/:submissionId/decision', requireSameOrigin, requireAdmin, (request, response) => {
    const { submissionId } = request.params;
    const { decision } = request.body || {};
    if (!/^[a-f0-9]{32}$/.test(submissionId) || !['approve', 'reject'].includes(decision)) {
        return sendError(response, 400, 'invalid_task_decision');
    }

    db.exec('BEGIN IMMEDIATE');
    try {
        const submission = db.prepare(`
            SELECT id, user_id, task_key
            FROM task_submissions
            WHERE id = ? AND status = 'pending'
        `).get(submissionId);
        if (!submission) {
            db.exec('ROLLBACK');
            return sendError(response, 404, 'pending_task_not_found');
        }
        if (decision === 'approve') {
            const account = db.prepare(`
                SELECT usdt_balance, email_verified, disabled_at
                FROM users
                WHERE id = ?
            `).get(submission.user_id);
            if (!account || !account.email_verified || account.disabled_at) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'task_account_unavailable');
            }
            const previousBalance = BigInt(account.usdt_balance);
            const newBalance = previousBalance + 10_000_000n;
            db.prepare('UPDATE users SET usdt_balance = ? WHERE id = ?')
                .run(newBalance.toString(), submission.user_id);
            db.prepare(`
                INSERT INTO balance_audit_log
                    (admin_user_id, target_user_id, asset, previous_balance, new_balance)
                VALUES (?, ?, 'USDT', ?, ?)
            `).run(request.user.id, submission.user_id, previousBalance.toString(), newBalance.toString());
        }
        const status = decision === 'approve' ? 'approved' : 'rejected';
        db.prepare(`
            UPDATE task_submissions
            SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
            WHERE id = ? AND status = 'pending'
        `).run(status, request.user.id, submissionId);
        db.exec('COMMIT');
        response.json({ submissionId, status, reward: decision === 'approve' ? '10' : '0', asset: 'USDT' });
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
});

app.get('/api/admin/session', requireAdmin, (request, response) => {
    response.json({
        isAdmin: true,
        email: request.user.email
    });
});

app.get('/api/staking/config', (_request, response) => {
    const enabled = Boolean(stakeaiTokenAddress && stakingContractAddress);
    response.set('Cache-Control', 'no-store').json({
        enabled,
        chainId: 97,
        contractVersion: Number(stakingContractVersion),
        tokenAddress: enabled ? stakeaiTokenAddress : null,
        stakingAddress: enabled ? stakingContractAddress : null
    });
});

const stakingReadAbi = [
    'function getUserPositions(address account) view returns ((uint256 amount,uint256 reward,uint64 unlockAt,uint8 offerId,bool principalWithdrawn)[])'
];
const stakingTokenInterface = new Interface([
    'event Transfer(address indexed from, address indexed to, uint256 value)'
]);

function getBscTestnetProvider() {
    return new JsonRpcProvider(
        process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
        97
    );
}

app.get('/api/admin/staking-reward-payouts', requireAdmin, (request, response) => {
    if (stakingContractVersion !== '1') {
        return sendError(response, 409, 'legacy_staking_rewards_disabled');
    }
    const payouts = db.prepare(`
        SELECT id, admin_wallet AS adminWallet, recipient_wallet AS recipientWallet,
            recipient_email AS recipientEmail, position_id AS positionId,
            amount_base_units AS amountBaseUnits, status, transaction_hash AS transactionHash,
            created_at AS createdAt, paid_at AS paidAt
        FROM staking_reward_payouts
        WHERE status = 'paid'
        ORDER BY paid_at DESC, id DESC
        LIMIT 100
    `).all();
    response.json({ payouts });
});

app.post('/api/admin/staking-reward-payouts/prepare', requireSameOrigin, requireAdmin, async (request, response) => {
    if (stakingContractVersion !== '1') {
        return sendError(response, 409, 'legacy_staking_rewards_disabled');
    }
    if (!stakeaiTokenAddress || !stakingContractAddress) {
        return sendError(response, 503, 'staking_not_configured');
    }
    const { adminWallet, recipientWallet, positionId, recipientEmail = '' } = request.body || {};
    if (typeof adminWallet !== 'string' || !isAddress(adminWallet)
        || typeof recipientWallet !== 'string' || !isAddress(recipientWallet)
        || typeof positionId !== 'string' || !/^(?:0|[1-9]\d{0,8})$/.test(positionId)
        || typeof recipientEmail !== 'string' || recipientEmail.length > 254
        || (recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail))) {
        return sendError(response, 400, 'invalid_staking_reward_payout');
    }

    const normalizedAdminWallet = getAddress(adminWallet);
    const normalizedRecipient = getAddress(recipientWallet);
    const now = Date.now();
    db.prepare(`
        UPDATE staking_reward_payouts SET status = 'expired'
        WHERE status = 'pending' AND expires_at <= ?
    `).run(now);

    let position;
    let block;
    try {
        const provider = getBscTestnetProvider();
        const chain = await provider.getNetwork();
        if (chain.chainId !== 97n) return sendError(response, 503, 'staking_rpc_wrong_network');
        const staking = new Contract(stakingContractAddress, stakingReadAbi, provider);
        const positions = await staking.getUserPositions(normalizedRecipient);
        if (BigInt(positionId) >= BigInt(positions.length)) {
            return sendError(response, 404, 'staking_position_not_found');
        }
        position = positions[Number(positionId)];
        block = await provider.getBlock('latest');
        if (!block) return sendError(response, 503, 'staking_rpc_unavailable');
    } catch (error) {
        console.error('Could not verify an eligible testnet staking position.', error);
        return sendError(response, 503, 'staking_rpc_unavailable');
    }

    if (position.reward <= 0n) return sendError(response, 409, 'staking_reward_empty');
    if (BigInt(block.timestamp) < position.unlockAt) {
        return sendError(response, 409, 'staking_position_locked');
    }

    const payoutId = randomBytes(16).toString('hex');
    try {
        db.prepare(`
            INSERT INTO staking_reward_payouts (
                id, admin_user_id, admin_wallet, recipient_wallet, recipient_email,
                position_id, amount_base_units, status, expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        `).run(
            payoutId,
            request.user.id,
            normalizedAdminWallet,
            normalizedRecipient,
            recipientEmail.trim().toLowerCase(),
            positionId,
            position.reward.toString(),
            now + 15 * 60 * 1000
        );
    } catch (error) {
        if (isUniqueViolation(error)) {
            return sendError(response, 409, 'staking_reward_already_reserved_or_paid');
        }
        throw error;
    }
    response.status(201).json({
        payoutId,
        recipientWallet: normalizedRecipient,
        positionId,
        amountBaseUnits: position.reward.toString(),
        amount: formatUnits(position.reward, 18),
        unlockAt: Number(position.unlockAt),
        principalWithdrawn: position.principalWithdrawn,
        expiresAt: now + 15 * 60 * 1000
    });
});

app.post('/api/admin/staking-reward-payouts/:payoutId/confirm', requireSameOrigin, requireAdmin, async (request, response) => {
    if (stakingContractVersion !== '1') {
        return sendError(response, 409, 'legacy_staking_rewards_disabled');
    }
    const payoutId = request.params.payoutId;
    if (typeof payoutId !== 'string' || !/^[a-f0-9]{32}$/.test(payoutId)) {
        return sendError(response, 400, 'invalid_staking_reward_payout');
    }
    const { transactionHash } = request.body || {};
    if (typeof transactionHash !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(transactionHash)) {
        return sendError(response, 400, 'invalid_staking_reward_transaction');
    }
    const payout = db.prepare(`
        SELECT id, admin_wallet AS adminWallet, recipient_wallet AS recipientWallet,
            amount_base_units AS amountBaseUnits, status, transaction_hash AS transactionHash,
            expires_at AS expiresAt
        FROM staking_reward_payouts
        WHERE id = ? AND admin_user_id = ?
    `).get(payoutId, request.user.id);
    if (!payout) return sendError(response, 404, 'staking_reward_payout_not_found');
    if (payout.status === 'paid') {
        return payout.transactionHash.toLowerCase() === transactionHash.toLowerCase()
            ? response.json({ payoutId, paid: true, transactionHash: payout.transactionHash })
            : sendError(response, 409, 'staking_reward_payout_already_paid');
    }
    if (payout.status !== 'pending' || payout.expiresAt <= Date.now()) {
        if (payout.status === 'pending') {
            db.prepare("UPDATE staking_reward_payouts SET status = 'expired' WHERE id = ?").run(payoutId);
        }
        return sendError(response, 409, 'staking_reward_payout_expired');
    }

    let verified = false;
    try {
        const provider = getBscTestnetProvider();
        const chain = await provider.getNetwork();
        if (chain.chainId !== 97n) return sendError(response, 503, 'staking_rpc_wrong_network');
        const receipt = await provider.getTransactionReceipt(transactionHash);
        if (!receipt) return sendError(response, 409, 'staking_reward_transaction_unconfirmed');
        if (receipt.status !== 1) return sendError(response, 409, 'staking_reward_transaction_failed');
        if (getAddress(receipt.from) !== payout.adminWallet) {
            return sendError(response, 409, 'staking_reward_sender_mismatch');
        }
        verified = receipt.logs.some((log) => {
            if (getAddress(log.address) !== getAddress(stakeaiTokenAddress)) return false;
            try {
                const parsed = stakingTokenInterface.parseLog(log);
                return parsed?.name === 'Transfer'
                    && getAddress(parsed.args.from) === payout.adminWallet
                    && getAddress(parsed.args.to) === payout.recipientWallet
                    && parsed.args.value === BigInt(payout.amountBaseUnits);
            } catch {
                return false;
            }
        });
    } catch (error) {
        console.error('Could not verify a testnet STAKEAI reward transfer.', error);
        return sendError(response, 503, 'staking_rpc_unavailable');
    }
    if (!verified) return sendError(response, 409, 'staking_reward_transfer_mismatch');

    const result = db.prepare(`
        UPDATE staking_reward_payouts
        SET status = 'paid', transaction_hash = ?, paid_at = CURRENT_TIMESTAMP
        WHERE id = ? AND admin_user_id = ? AND status = 'pending'
    `).run(transactionHash.toLowerCase(), payoutId, request.user.id);
    if (result.changes !== 1) return sendError(response, 409, 'staking_reward_payout_already_paid');
    response.json({ payoutId, paid: true, transactionHash: transactionHash.toLowerCase() });
});

app.get('/api/market/summary', async (_request, response) => {
    try {
        const summary = await getMarketSummary();
        response.set('Cache-Control', 'no-store').json({
            source: summary.source,
            interval: summary.interval,
            fetchedAt: summary.fetchedAt,
            marketDataUnavailable: summary.marketDataUnavailable,
            markets: summary.markets.map(({ priceBaseUnits: _privatePrice, ...market }) => market)
        });
    } catch (error) {
        console.warn('Public market data could not be refreshed.', error.message);
        response.set('Cache-Control', 'no-store').json({
            source: 'STAKEAI fixed reference only',
            interval: '1h',
            fetchedAt: Date.now(),
            marketDataUnavailable: true,
            markets: [stkaiReferenceMarket].map(({ priceBaseUnits: _privatePrice, ...market }) => market)
        });
    }
});

app.get('/api/paper/portfolio', requireSession, (request, response) => {
    response.set('Cache-Control', 'no-store').json(getPaperPortfolio(request.user.id));
});

app.post('/api/paper/stakes', requireSameOrigin, requireSession, (request, response) => {
    const { asset, amount } = request.body || {};
    const offerValue = request.body?.offerId;
    const offerId = typeof offerValue === 'number' ? offerValue
        : typeof offerValue === 'string' && /^\d$/.test(offerValue) ? Number(offerValue)
            : -1;
    const offer = paperStakeOffers[offerId];
    const amountUnits = ['USDT', 'BTC', 'ETH', 'BNB', 'STKAI'].includes(asset)
        ? decimalToBaseUnits(amount, treasuryDecimals(asset))
        : null;
    if (!offer || amountUnits === null || BigInt(amountUnits) <= 0n) {
        return sendError(response, 400, 'invalid_paper_stake');
    }
    const principal = BigInt(amountUnits);
    const reward = principal * BigInt(offer.rewardBps) / 10_000n;
    if (reward <= 0n) return sendError(response, 400, 'paper_stake_below_minimum');

    const stakeId = randomBytes(16).toString('hex');
    const now = Math.floor(Date.now() / 1000);
    const unlockAt = now + offer.durationDays * 24 * 60 * 60;
    db.exec('BEGIN IMMEDIATE');
    try {
        db.prepare('INSERT OR IGNORE INTO paper_portfolios (user_id) VALUES (?)').run(request.user.id);
        let averagePrice = 100_000_000n;
        if (asset === 'USDT') {
            const portfolio = db.prepare(`
                SELECT cash_balance_units FROM paper_portfolios WHERE user_id = ?
            `).get(request.user.id);
            const available = BigInt(portfolio.cash_balance_units);
            if (available < principal) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'paper_stake_insufficient_balance');
            }
            db.prepare(`
                UPDATE paper_portfolios
                SET cash_balance_units = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `).run((available - principal).toString(), request.user.id);
        } else {
            const position = db.prepare(`
                SELECT quantity_base_units, average_price_base_units
                FROM paper_positions WHERE user_id = ? AND asset = ?
            `).get(request.user.id, asset);
            const available = BigInt(position?.quantity_base_units || '0');
            if (!position || available < principal) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'paper_stake_insufficient_balance');
            }
            averagePrice = BigInt(position.average_price_base_units);
            const remaining = available - principal;
            if (remaining === 0n) {
                db.prepare('DELETE FROM paper_positions WHERE user_id = ? AND asset = ?')
                    .run(request.user.id, asset);
            } else {
                db.prepare(`
                    UPDATE paper_positions SET quantity_base_units = ?
                    WHERE user_id = ? AND asset = ?
                `).run(remaining.toString(), request.user.id, asset);
            }
        }
        db.prepare(`
            INSERT INTO paper_stakes
                (id, user_id, asset, amount_base_units, reward_base_units,
                 average_price_base_units, offer_id, unlock_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            stakeId,
            request.user.id,
            asset,
            principal.toString(),
            reward.toString(),
            averagePrice.toString(),
            offerId,
            unlockAt
        );
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.status(201).json({
        stakeId,
        asset,
        amount: unitsToDecimalString(principal, treasuryDecimals(asset)),
        reward: unitsToDecimalString(reward, treasuryDecimals(asset)),
        offerId,
        unlockAt: new Date(unlockAt * 1000).toISOString(),
        portfolio: getPaperPortfolio(request.user.id)
    });
});

app.post('/api/paper/stakes/:stakeId/claim', requireSameOrigin, requireSession, (request, response) => {
    if (!/^[a-f0-9]{32}$/i.test(request.params.stakeId)) {
        return sendError(response, 400, 'invalid_paper_stake');
    }
    db.exec('BEGIN IMMEDIATE');
    try {
        const stake = db.prepare(`
            SELECT asset, amount_base_units, reward_base_units,
                   average_price_base_units, unlock_at, status
            FROM paper_stakes
            WHERE id = ? AND user_id = ?
        `).get(request.params.stakeId, request.user.id);
        if (!stake) {
            db.exec('ROLLBACK');
            return sendError(response, 404, 'paper_stake_not_found');
        }
        if (stake.status !== 'active') {
            db.exec('ROLLBACK');
            return sendError(response, 409, 'paper_stake_already_claimed');
        }
        if (stake.unlock_at > Math.floor(Date.now() / 1000)) {
            db.exec('ROLLBACK');
            return sendError(response, 409, 'paper_stake_locked');
        }
        const principal = BigInt(stake.amount_base_units);
        const payout = principal + BigInt(stake.reward_base_units);
        if (stake.asset === 'USDT') {
            const portfolio = db.prepare(`
                SELECT cash_balance_units FROM paper_portfolios WHERE user_id = ?
            `).get(request.user.id);
            db.prepare(`
                UPDATE paper_portfolios
                SET cash_balance_units = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `).run((BigInt(portfolio.cash_balance_units) + payout).toString(), request.user.id);
        } else {
            const current = db.prepare(`
                SELECT quantity_base_units, average_price_base_units
                FROM paper_positions WHERE user_id = ? AND asset = ?
            `).get(request.user.id, stake.asset);
            const oldQuantity = BigInt(current?.quantity_base_units || '0');
            const newQuantity = oldQuantity + payout;
            const oldCost = oldQuantity * BigInt(current?.average_price_base_units || '0');
            const addedCost = payout * BigInt(stake.average_price_base_units);
            const averagePrice = newQuantity === 0n ? 0n : (oldCost + addedCost) / newQuantity;
            db.prepare(`
                INSERT INTO paper_positions
                    (user_id, asset, quantity_base_units, average_price_base_units)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id, asset) DO UPDATE SET
                    quantity_base_units = excluded.quantity_base_units,
                    average_price_base_units = excluded.average_price_base_units
            `).run(request.user.id, stake.asset, newQuantity.toString(), averagePrice.toString());
        }
        const update = db.prepare(`
            UPDATE paper_stakes
            SET status = 'claimed', claimed_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ? AND status = 'active'
        `).run(request.params.stakeId, request.user.id);
        if (update.changes !== 1) throw new Error('paper_stake_claim_race');
        db.exec('COMMIT');
        response.json({
            stakeId: request.params.stakeId,
            asset: stake.asset,
            amount: unitsToDecimalString(principal, treasuryDecimals(stake.asset)),
            reward: unitsToDecimalString(stake.reward_base_units, treasuryDecimals(stake.asset)),
            payout: unitsToDecimalString(payout, treasuryDecimals(stake.asset)),
            portfolio: getPaperPortfolio(request.user.id)
        });
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
});

app.post('/api/paper/orders', requireSameOrigin, requireSession, async (request, response) => {
    const { symbol, side, quantity } = request.body || {};
    const quoteAsset = request.body?.quoteAsset || 'USDT';
    const market = paperAssets.find((item) => item.symbol === symbol);
    const quantityUnits = decimalToBaseUnits(quantity, 8);
    if (!market || !['buy', 'sell'].includes(side)
        || !['USDT', 'BTC', 'ETH', 'BNB'].includes(quoteAsset)
        || (quoteAsset !== 'USDT' && market.asset !== 'STKAI')
        || quoteAsset === market.asset
        || quantityUnits === null || BigInt(quantityUnits) <= 0n) {
        return sendError(response, 400, 'invalid_paper_order');
    }

    let currentMarket;
    let marketSummary;
    if (symbol === stkaiReferenceMarket.symbol && quoteAsset === 'USDT') {
        currentMarket = stkaiReferenceMarket;
    } else {
        try {
            marketSummary = await getMarketSummary();
        } catch (error) {
            console.warn('Paper order blocked because public market data is unavailable.', error.message);
            return sendError(response, 503, 'market_data_unavailable');
        }
        currentMarket = marketSummary.markets.find((item) => item.symbol === symbol);
    }
    if (!currentMarket) return sendError(response, 503, 'market_data_unavailable');
    const priceUnits = BigInt(currentMarket.priceBaseUnits);
    const quotePriceUnits = quoteAsset === 'USDT'
        ? 100_000_000n
        : BigInt(marketSummary.markets.find((item) => item.asset === quoteAsset)?.priceBaseUnits || '0');
    if (quotePriceUnits <= 0n) return sendError(response, 503, 'market_data_unavailable');
    const quantityAmount = BigInt(quantityUnits);
    const notionalUnits = (quantityAmount * priceUnits + 5_000_000_000n) / 10_000_000_000n;
    if (notionalUnits < paperCashScale) return sendError(response, 400, 'paper_order_below_minimum');
    const quoteUnitScale = 10n ** BigInt(treasuryDecimals(quoteAsset) + 2);
    const quoteNotionalUnits = (notionalUnits * quoteUnitScale + quotePriceUnits / 2n) / quotePriceUnits;
    const feeUnits = (quoteNotionalUnits * 50n + 9_999n) / 10_000n;

    db.exec('BEGIN IMMEDIATE');
    try {
        db.prepare('INSERT OR IGNORE INTO paper_portfolios (user_id) VALUES (?)').run(request.user.id);
        const portfolio = db.prepare(`
            SELECT cash_balance_units
            FROM paper_portfolios
            WHERE user_id = ?
        `).get(request.user.id);
        const position = db.prepare(`
            SELECT quantity_base_units, average_price_base_units
            FROM paper_positions
            WHERE user_id = ? AND asset = ?
        `).get(request.user.id, market.asset);
        const existingQuantity = BigInt(position?.quantity_base_units || '0');
        const quotePosition = quoteAsset === 'USDT'
            ? null
            : db.prepare(`
                SELECT quantity_base_units, average_price_base_units
                FROM paper_positions
                WHERE user_id = ? AND asset = ?
            `).get(request.user.id, quoteAsset);
        const quotePositionUnits = BigInt(quotePosition?.quantity_base_units || '0');
        const cashBalance = BigInt(portfolio.cash_balance_units);
        let newCashBalance;
        const treasury = new Map(db.prepare(`
            SELECT asset, balance_base_units
            FROM admin_treasury_balances
            WHERE asset IN (?, ?)
        `).all(market.asset, quoteAsset).map((row) => [row.asset, BigInt(row.balance_base_units)]));
        const assetPoolBalance = treasury.get(market.asset) || 0n;
        const quotePoolBalance = treasury.get(quoteAsset) || 0n;
        const gasFeePoolBalance = BigInt(db.prepare(`
            SELECT balance_base_units
            FROM paper_gas_fee_balances
            WHERE asset = ?
        `).get(quoteAsset).balance_base_units);
        newCashBalance = cashBalance;
        const updateTreasury = db.prepare(`
            UPDATE admin_treasury_balances
            SET balance_base_units = ?, updated_at = CURRENT_TIMESTAMP
            WHERE asset = ? AND balance_base_units = ?
        `);
        const recordTreasuryMovement = db.prepare(`
            INSERT INTO admin_treasury_audit_log
                (admin_user_id, reference, asset, previous_balance, new_balance, reason)
            VALUES (NULL, ?, ?, ?, ?, 'simulated_trade')
        `);
        const adjustTreasury = (asset, oldBalance, newBalance) => {
            if (newBalance < 0n) throw new Error('admin_treasury_balance_underflow');
            const update = updateTreasury.run(newBalance.toString(), asset, oldBalance.toString());
            if (update.changes !== 1) throw new Error('admin_treasury_balance_changed');
            recordTreasuryMovement.run(tradeId, asset, oldBalance.toString(), newBalance.toString());
        };
        const addPaperGasFee = () => {
            const update = db.prepare(`
                UPDATE paper_gas_fee_balances
                SET balance_base_units = ?, updated_at = CURRENT_TIMESTAMP
                WHERE asset = ? AND balance_base_units = ?
            `).run(
                (gasFeePoolBalance + feeUnits).toString(),
                quoteAsset,
                gasFeePoolBalance.toString()
            );
            if (update.changes !== 1) throw new Error('paper_gas_fee_balance_changed');
        };
        const upsertPosition = (asset, oldPosition, oldQuantity, addedQuantity, averagePrice) => {
            const newQuantity = oldQuantity + addedQuantity;
            const weightedPrice = oldPosition
                ? (oldQuantity * BigInt(oldPosition.average_price_base_units)
                    + addedQuantity * averagePrice) / newQuantity
                : averagePrice;
            db.prepare(`
                INSERT INTO paper_positions (user_id, asset, quantity_base_units, average_price_base_units)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id, asset) DO UPDATE SET
                    quantity_base_units = excluded.quantity_base_units,
                    average_price_base_units = excluded.average_price_base_units
            `).run(request.user.id, asset, newQuantity.toString(), weightedPrice.toString());
        };
        const adjustQuotePosition = (oldQuantity, newQuantity) => {
            if (quoteAsset === 'USDT') {
                newCashBalance = newQuantity;
                return;
            }
            if (newQuantity === 0n) {
                db.prepare('DELETE FROM paper_positions WHERE user_id = ? AND asset = ?')
                    .run(request.user.id, quoteAsset);
            } else if (newQuantity > oldQuantity) {
                upsertPosition(
                    quoteAsset,
                    quotePosition,
                    oldQuantity,
                    newQuantity - oldQuantity,
                    quotePriceUnits
                );
            } else {
                db.prepare('UPDATE paper_positions SET quantity_base_units = ? WHERE user_id = ? AND asset = ?')
                    .run(newQuantity.toString(), request.user.id, quoteAsset);
            }
        };
        const tradeId = randomBytes(16).toString('hex');

        if (side === 'buy') {
            const totalCost = quoteNotionalUnits + feeUnits;
            const availableQuote = quoteAsset === 'USDT' ? cashBalance : quotePositionUnits;
            if (availableQuote < totalCost) {
                db.exec('ROLLBACK');
                return sendError(response, 409, quoteAsset === 'USDT'
                    ? 'paper_insufficient_cash'
                    : 'paper_insufficient_quote_position');
            }
            if (assetPoolBalance < quantityAmount) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'paper_insufficient_treasury_inventory');
            }
            adjustQuotePosition(availableQuote, availableQuote - totalCost);
            upsertPosition(market.asset, position, existingQuantity, quantityAmount, priceUnits);
            adjustTreasury(market.asset, assetPoolBalance, assetPoolBalance - quantityAmount);
            adjustTreasury(quoteAsset, quotePoolBalance, quotePoolBalance + quoteNotionalUnits);
            addPaperGasFee();
        } else {
            if (existingQuantity < quantityAmount) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'paper_insufficient_position');
            }
            const proceeds = quoteNotionalUnits - feeUnits;
            if (quotePoolBalance < quoteNotionalUnits) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'paper_insufficient_treasury_quote');
            }
            const availableQuote = quoteAsset === 'USDT' ? cashBalance : quotePositionUnits;
            adjustQuotePosition(availableQuote, availableQuote + proceeds);
            adjustTreasury(market.asset, assetPoolBalance, assetPoolBalance + quantityAmount);
            adjustTreasury(quoteAsset, quotePoolBalance, quotePoolBalance - quoteNotionalUnits);
            addPaperGasFee();
            const newQuantity = existingQuantity - quantityAmount;
            if (newQuantity === 0n) {
                db.prepare('DELETE FROM paper_positions WHERE user_id = ? AND asset = ?')
                    .run(request.user.id, market.asset);
            } else {
                db.prepare('UPDATE paper_positions SET quantity_base_units = ? WHERE user_id = ? AND asset = ?')
                    .run(newQuantity.toString(), request.user.id, market.asset);
            }
        }

        db.prepare(`
            UPDATE paper_portfolios
            SET cash_balance_units = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `).run(newCashBalance.toString(), request.user.id);
        db.prepare(`
            INSERT INTO paper_trades
                (id, user_id, symbol, side, quantity_base_units, price_base_units,
                 notional_base_units, fee_base_units, quote_asset, quote_amount_base_units)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            tradeId,
            request.user.id,
            symbol,
            side,
            quantityAmount.toString(),
            priceUnits.toString(),
            notionalUnits.toString(),
            feeUnits.toString(),
            quoteAsset,
            (side === 'buy' ? quoteNotionalUnits + feeUnits : quoteNotionalUnits - feeUnits).toString()
        );
        db.prepare(`
            INSERT INTO paper_gas_fee_movements (trade_id, asset, amount_base_units, side)
            VALUES (?, ?, ?, ?)
        `).run(tradeId, quoteAsset, feeUnits.toString(), side);
        db.exec('COMMIT');
        response.status(201).json({
            trade: {
                id: tradeId,
                symbol: `${market.asset}${quoteAsset}`,
                quoteAsset,
                side,
                quantity: unitsToDecimalString(quantityAmount, 8),
                price: unitsToDecimalString(priceUnits, 8),
                notional: unitsToDecimalString(notionalUnits, 6),
                quoteAmount: unitsToDecimalString(
                    side === 'buy' ? quoteNotionalUnits + feeUnits : quoteNotionalUnits - feeUnits,
                    treasuryDecimals(quoteAsset)
                ),
                fee: unitsToDecimalString(feeUnits, treasuryDecimals(quoteAsset)),
                createdAt: new Date().toISOString()
            },
            portfolio: getPaperPortfolio(request.user.id)
        });
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
});

app.get('/api/admin/treasury', requireAdmin, (_request, response) => {
    const movements = db.prepare(`
        SELECT a.asset, a.previous_balance, a.new_balance, a.reason, a.created_at, u.email AS admin_email
        FROM admin_treasury_audit_log a
        LEFT JOIN users u ON u.id = a.admin_user_id
        ORDER BY a.id DESC
        LIMIT 50
    `).all().map((movement) => ({
        asset: movement.asset,
        previousBalance: unitsToDecimalString(movement.previous_balance, treasuryDecimals(movement.asset)),
        newBalance: unitsToDecimalString(movement.new_balance, treasuryDecimals(movement.asset)),
        reason: movement.reason,
        createdAt: movement.created_at,
        adminEmail: movement.admin_email
    }));
    response.set('Cache-Control', 'no-store').json({
        simulated: true,
        balances: getTreasuryBalances(),
        movements
    });
});

app.get('/api/admin/paper-fees', requireAdmin, (_request, response) => {
    const feeAssets = ['USDT', 'BTC', 'ETH', 'BNB'];
    const balances = db.prepare(`
        SELECT asset, balance_base_units
        FROM paper_gas_fee_balances
        ORDER BY CASE asset
            WHEN 'USDT' THEN 0 WHEN 'BTC' THEN 1 WHEN 'ETH' THEN 2 ELSE 3
        END
    `).all().map(({ asset, balance_base_units }) => ({
        asset,
        balance: unitsToDecimalString(balance_base_units, treasuryDecimals(asset))
    }));
    const movements = db.prepare(`
        SELECT m.asset, m.amount_base_units, m.side, m.created_at,
               substr(t.symbol, 1, length(t.symbol) - 4) || m.asset AS symbol
        FROM paper_gas_fee_movements m
        JOIN paper_trades t ON t.id = m.trade_id
        ORDER BY m.id DESC
        LIMIT 100
    `).all().map((movement) => ({
        asset: movement.asset,
        amount: unitsToDecimalString(movement.amount_base_units, treasuryDecimals(movement.asset)),
        side: movement.side,
        symbol: movement.symbol,
        createdAt: movement.created_at
    }));
    response.set('Cache-Control', 'no-store').json({
        simulated: true,
        feeRate: '0.5%',
        assets: feeAssets,
        balances,
        movements
    });
});

app.post('/api/admin/treasury', requireSameOrigin, requireAdmin, (request, response) => {
    const balances = request.body?.balances;
    if (!balances || typeof balances !== 'object' || Array.isArray(balances)
        || Object.keys(balances).length !== treasuryAssets.length
        || treasuryAssets.some((asset) => !Object.hasOwn(balances, asset))) {
        return sendError(response, 400, 'invalid_treasury_balances');
    }
    const units = new Map(treasuryAssets.map((asset) => [
        asset,
        decimalToBaseUnits(balances[asset], treasuryDecimals(asset))
    ]));
    if ([...units.values()].some((balance) => balance === null)) {
        return sendError(response, 400, 'invalid_treasury_balance');
    }

    db.exec('BEGIN IMMEDIATE');
    try {
        const update = db.prepare(`
            UPDATE admin_treasury_balances
            SET balance_base_units = ?, updated_at = CURRENT_TIMESTAMP
            WHERE asset = ?
        `);
        const audit = db.prepare(`
            INSERT INTO admin_treasury_audit_log
                (admin_user_id, reference, asset, previous_balance, new_balance, reason)
            VALUES (?, ?, ?, ?, ?, 'admin_adjustment')
        `);
        for (const asset of treasuryAssets) {
            const previous = db.prepare(`
                SELECT balance_base_units FROM admin_treasury_balances WHERE asset = ?
            `).get(asset).balance_base_units;
            const next = units.get(asset);
            if (previous !== next) {
                update.run(next, asset);
                audit.run(
                    request.user.id,
                    `adjustment:${randomBytes(16).toString('hex')}`,
                    asset,
                    previous,
                    next
                );
            }
        }
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.json({ balances: getTreasuryBalances() });
});

app.get('/api/admin/users', requireAdmin, (request, response) => {
    const search = typeof request.query.search === 'string' ? request.query.search.trim().toLowerCase() : '';
    const pageValue = Number.parseInt(request.query.page, 10);
    const page = Number.isInteger(pageValue) ? Math.max(1, Math.min(pageValue, 100000)) : 1;
    const pageSize = 25;
    if (search.length > 100) return sendError(response, 400, 'search_query_too_long');

    const where = search ? 'WHERE instr(lower(u.email), ?) > 0' : '';
    const parameters = search ? [search] : [];
    const total = db.prepare(`SELECT COUNT(*) AS count FROM users u ${where}`).get(...parameters).count;
    const users = db.prepare(`
        SELECT u.id, u.email, u.first_name, u.last_name, u.trc20_address,
               u.usdt_balance, u.stakeai_balance, u.email_verified, u.referral_code,
               u.disabled_at, u.created_at,
               (SELECT COUNT(*) FROM users referred WHERE referred.referred_by = u.id) AS direct_referrals
        FROM users u
        ${where}
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT ? OFFSET ?
    `).all(...parameters, pageSize, (page - 1) * pageSize).map((user) => ({
        ...user,
        usdt_balance: baseUnitsToDecimal(user.usdt_balance, 6),
        stakeai_balance: baseUnitsToDecimal(user.stakeai_balance, 18),
        isAdmin: adminEmails.has(user.email.toLowerCase())
    }));
    response.json({ users, page, pageSize, total });
});

app.get('/api/account/summary', requireSession, (request, response) => {
    const account = db.prepare(`
        SELECT email, first_name, last_name, trc20_address, usdt_balance, stakeai_balance, totp_enabled
        FROM users
        WHERE id = ?
    `).get(request.user.id);
    response.json({
        email: account.email,
        firstName: account.first_name,
        lastName: account.last_name,
        trc20Address: account.trc20_address,
        usdtBalance: baseUnitsToDecimal(account.usdt_balance, 6),
        stakeaiBalance: baseUnitsToDecimal(account.stakeai_balance, 18),
        twoFactorEnabled: Boolean(account.totp_enabled)
    });
});

app.post('/api/account/profile', requireSession, requireSameOrigin, (request, response) => {
    return sendError(response, 403, 'profile_locked');
    const firstName = normalizePersonName(request.body?.firstName);
    const lastName = normalizePersonName(request.body?.lastName);
    if (!validPersonName(firstName) || !validPersonName(lastName)) {
        return sendError(response, 400, 'invalid_name');
    }
    db.prepare('UPDATE users SET first_name = ?, last_name = ? WHERE id = ?')
        .run(firstName, lastName, request.user.id);
    response.json({ firstName, lastName });
});

app.post('/api/account/avatar', requireSession, requireSameOrigin, (request, response) => {
    const avatar = request.body?.avatar;
    if (avatar !== '' && (typeof avatar !== 'string' || avatar.length > 24000
        || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(avatar))) {
        return sendError(response, 400, 'invalid_avatar');
    }
    db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, request.user.id);
    response.json({ avatar });
});

app.post('/api/account/change-password', authLimiter, requireSession, requireSameOrigin, async (request, response, next) => {
    try {
        const currentPassword = request.body?.currentPassword;
        const newPassword = request.body?.newPassword;
        if (typeof currentPassword !== 'string' || Buffer.byteLength(currentPassword) > 128
            || typeof newPassword !== 'string' || newPassword.length < 12
            || Buffer.byteLength(newPassword) > 128) {
            return sendError(response, 400, 'password_must_be_12_to_128_bytes');
        }
        const user = db.prepare(`
            SELECT password_hash, totp_enabled, totp_secret, totp_last_used_step
            FROM users WHERE id = ?
        `).get(request.user.id);
        if (!user || !await verifyPassword(currentPassword, user.password_hash)) {
            return sendError(response, 401, 'current_password_incorrect');
        }
        if (user.totp_enabled && !consumeSecondFactor(request.user.id, user, request.body?.twoFactorCode)) {
            return sendError(response, 401, 'invalid_two_factor_code');
        }
        const passwordHash = await passwordDigest(newPassword);
        db.exec('BEGIN IMMEDIATE');
        try {
            db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
                .run(passwordHash, request.user.id);
            db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?')
                .run(request.user.id, request.user.token_hash);
            db.prepare('DELETE FROM totp_login_challenges WHERE user_id = ?').run(request.user.id);
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
        response.json({ passwordChanged: true });
    } catch (error) {
        next(error);
    }
});

app.post('/api/account/change-email', authLimiter, requireSession, requireSameOrigin, async (request, response, next) => {
    return sendError(response, 403, 'profile_locked');
    try {
        if (!smtpReady) return sendError(response, 503, 'email_service_not_configured');
        const email = normalizeEmail(request.body?.email);
        const currentPassword = request.body?.currentPassword;
        if (!validEmail(email)) return sendError(response, 400, 'invalid_email');
        if (typeof currentPassword !== 'string' || Buffer.byteLength(currentPassword) > 128) {
            return sendError(response, 400, 'current_password_required');
        }
        const user = db.prepare(`
            SELECT email, password_hash, totp_enabled, totp_secret, totp_last_used_step
            FROM users WHERE id = ?
        `).get(request.user.id);
        if (!user || !await verifyPassword(currentPassword, user.password_hash)) {
            return sendError(response, 401, 'current_password_incorrect');
        }
        if (email === user.email.toLowerCase()) return sendError(response, 400, 'email_unchanged');
        if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
            return sendError(response, 409, 'email_already_in_use');
        }
        if (user.totp_enabled && !consumeSecondFactor(request.user.id, user, request.body?.twoFactorCode)) {
            return sendError(response, 401, 'invalid_two_factor_code');
        }
        const token = randomBytes(32).toString('base64url');
        const tokenHash = hashToken(token);
        db.prepare('DELETE FROM email_change_verifications WHERE user_id = ? OR expires_at <= ?')
            .run(request.user.id, Date.now());
        db.prepare(`
            INSERT INTO email_change_verifications (token_hash, user_id, new_email, expires_at)
            VALUES (?, ?, ?, ?)
        `).run(tokenHash, request.user.id, email, Date.now() + 30 * 60 * 1000);
        const verificationUrl = new URL('/verify-email.html', publicOrigin);
        verificationUrl.searchParams.set('emailChangeToken', token);
        try {
            await mailer.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Confirm your new STAKEAI email address',
                text: `Confirm your new STAKEAI email address within 30 minutes: ${verificationUrl.toString()}`
            });
        } catch (error) {
            db.prepare('DELETE FROM email_change_verifications WHERE token_hash = ?').run(tokenHash);
            console.error('Email delivery failed during account email change.', error);
            return sendError(response, 503, 'verification_email_unavailable');
        }
        response.json({ verificationRequired: true });
    } catch (error) {
        next(error);
    }
});

app.get('/api/account/2fa', requireSession, (request, response) => {
    const account = db.prepare('SELECT totp_enabled FROM users WHERE id = ?').get(request.user.id);
    response.json({ enabled: Boolean(account.totp_enabled) });
});

app.post('/api/account/2fa/setup', authLimiter, requireSession, requireSameOrigin, async (request, response, next) => {
    try {
        const password = request.body?.password;
        if (typeof password !== 'string' || Buffer.byteLength(password) > 128) {
            return sendError(response, 400, 'current_password_required');
        }
        const user = db.prepare('SELECT email, password_hash, totp_enabled FROM users WHERE id = ?')
            .get(request.user.id);
        if (!user || !await verifyPassword(password, user.password_hash)) {
            return sendError(response, 401, 'current_password_incorrect');
        }
        if (user.totp_enabled) return sendError(response, 409, 'two_factor_already_enabled');
        const secret = encodeBase32(randomBytes(20));
        db.prepare('UPDATE users SET totp_pending_secret = ? WHERE id = ?')
            .run(encryptTotpSecret(secret), request.user.id);
        const label = encodeURIComponent(`STAKEAI:${user.email}`);
        const issuer = encodeURIComponent('STAKEAI');
        const otpauthUrl = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
        const qrSvg = await QRCode.toString(otpauthUrl, { type: 'svg', margin: 2, width: 192 });
        response.json({ secret, otpauthUrl, qrSvg });
    } catch (error) {
        next(error);
    }
});

app.post('/api/account/2fa/enable', authLimiter, requireSession, requireSameOrigin, async (request, response, next) => {
    try {
        const password = request.body?.password;
        const code = request.body?.code;
        if (typeof password !== 'string' || Buffer.byteLength(password) > 128
            || typeof code !== 'string' || code.length > 64) {
            return sendError(response, 400, 'invalid_two_factor_setup');
        }
        const user = db.prepare(`
            SELECT password_hash, totp_pending_secret, totp_enabled
            FROM users WHERE id = ?
        `).get(request.user.id);
        if (!user || !await verifyPassword(password, user.password_hash)) {
            return sendError(response, 401, 'current_password_incorrect');
        }
        if (user.totp_enabled) return sendError(response, 409, 'two_factor_already_enabled');
        if (!user.totp_pending_secret) return sendError(response, 409, 'two_factor_setup_required');
        const pendingSecret = decryptTotpSecret(user.totp_pending_secret);
        const step = matchingTotpStep(pendingSecret, code);
        if (step === null) return sendError(response, 400, 'invalid_two_factor_code');
        const recoveryCodes = createRecoveryCodes();
        db.exec('BEGIN IMMEDIATE');
        try {
            db.prepare(`
                UPDATE users SET totp_secret = totp_pending_secret, totp_pending_secret = NULL,
                    totp_enabled = 1, totp_last_used_step = ?
                WHERE id = ? AND totp_enabled = 0
            `).run(step, request.user.id);
            const insertCode = db.prepare('INSERT INTO totp_recovery_codes (user_id, code_hash) VALUES (?, ?)');
            for (const recoveryCode of recoveryCodes) {
                insertCode.run(request.user.id, hashToken(recoveryCode));
            }
            db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?')
                .run(request.user.id, request.user.token_hash);
            db.prepare('DELETE FROM totp_login_challenges WHERE user_id = ?').run(request.user.id);
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
        response.json({ enabled: true, recoveryCodes });
    } catch (error) {
        next(error);
    }
});

app.post('/api/account/2fa/disable', authLimiter, requireSession, requireSameOrigin, async (request, response, next) => {
    try {
        const password = request.body?.password;
        const code = request.body?.code;
        if (typeof password !== 'string' || Buffer.byteLength(password) > 128
            || typeof code !== 'string' || code.length > 64) {
            return sendError(response, 400, 'invalid_two_factor_setup');
        }
        const user = db.prepare(`
            SELECT password_hash, totp_secret, totp_last_used_step, totp_enabled
            FROM users WHERE id = ?
        `).get(request.user.id);
        if (!user || !await verifyPassword(password, user.password_hash)) {
            return sendError(response, 401, 'current_password_incorrect');
        }
        if (!user.totp_enabled) return sendError(response, 409, 'two_factor_not_enabled');
        db.exec('BEGIN IMMEDIATE');
        try {
            if (!consumeSecondFactor(request.user.id, user, code)) {
                db.exec('ROLLBACK');
                return sendError(response, 401, 'invalid_two_factor_code');
            }
            db.prepare(`
                UPDATE users SET totp_secret = NULL, totp_pending_secret = NULL,
                    totp_enabled = 0, totp_last_used_step = 0
                WHERE id = ?
            `).run(request.user.id);
            db.prepare('DELETE FROM totp_recovery_codes WHERE user_id = ?').run(request.user.id);
            db.prepare('DELETE FROM totp_login_challenges WHERE user_id = ?').run(request.user.id);
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
        response.json({ enabled: false });
    } catch (error) {
        next(error);
    }
});

app.get('/api/account/transfers', requireSession, (request, response) => {
    const internalTransfers = db.prepare(`
        SELECT t.id, t.sender_user_id, t.recipient_user_id, t.asset,
               t.amount_base_units, t.status, t.created_at, t.reviewed_at,
               sender.email AS sender_email, recipient.email AS recipient_email
        FROM user_transfers t
        JOIN users sender ON sender.id = t.sender_user_id
        JOIN users recipient ON recipient.id = t.recipient_user_id
        WHERE t.sender_user_id = ? OR t.recipient_user_id = ?
        ORDER BY t.created_at DESC, t.id DESC
        LIMIT 100
    `).all(request.user.id, request.user.id);
    const paperTransfers = db.prepare(`
        SELECT t.id, t.sender_user_id, t.recipient_user_id, t.asset,
               t.amount_base_units, t.status, t.created_at, t.reviewed_at,
               sender.email AS sender_email, recipient.email AS recipient_email
        FROM paper_asset_transfers t
        JOIN users sender ON sender.id = t.sender_user_id
        JOIN users recipient ON recipient.id = t.recipient_user_id
        WHERE t.sender_user_id = ? OR t.recipient_user_id = ?
        ORDER BY t.created_at DESC, t.id DESC
        LIMIT 100
    `).all(request.user.id, request.user.id);
    const transfers = [...internalTransfers, ...paperTransfers].map((transfer) => ({
        id: transfer.id,
        direction: transfer.sender_user_id === request.user.id ? 'sent' : 'received',
        counterpartyEmail: transfer.sender_user_id === request.user.id
            ? transfer.recipient_email
            : transfer.sender_email,
        asset: transfer.asset,
        amount: baseUnitsToDecimal(
            transfer.amount_base_units,
            transfer.asset === 'USDT' ? 6 : ['BTC', 'ETH', 'BNB'].includes(transfer.asset) ? 8 : 18
        ),
        status: transfer.status,
        createdAt: transfer.created_at,
        reviewedAt: transfer.reviewed_at
    })).sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id))
        .slice(0, 100);
    response.json({ transfers });
});

app.post('/api/account/transfers', requireSameOrigin, requireSession, (request, response) => {
    const asset = request.body?.asset;
    const isPaperAsset = ['BTC', 'ETH', 'BNB'].includes(asset);
    const decimals = asset === 'USDT' ? 6 : isPaperAsset ? 8 : asset === 'STAKEAI' ? 18 : null;
    const recipientInfo = typeof request.body?.recipientInfo === 'string'
        ? request.body.recipientInfo.trim()
        : '';
    if (decimals === null) {
        return sendError(response, 400, 'invalid_transfer_request');
    }
    if (asset === 'USDT' && !validTronAddress(recipientInfo)) {
        return sendError(response, 400, 'invalid_transfer_recipient');
    }
    if (asset !== 'USDT' && !/^[A-Fa-f0-9]{16}$/.test(recipientInfo)) {
        return sendError(response, 400, 'invalid_transfer_recipient');
    }
    const amountUnits = decimalToBaseUnits(request.body?.amount, decimals);
    if (amountUnits === null || amountUnits === '0') {
        return sendError(response, 400, 'invalid_transfer_amount');
    }
    const recipientMatches = asset === 'USDT'
        ? db.prepare(`
            SELECT id, email
            FROM users
            WHERE trc20_address = ? AND email_verified = 1 AND disabled_at IS NULL
            LIMIT 2
        `).all(recipientInfo)
        : db.prepare(`
            SELECT id, email
            FROM users
            WHERE referral_code = ? AND email_verified = 1 AND disabled_at IS NULL
            LIMIT 2
        `).all(recipientInfo.toUpperCase());
    if (recipientMatches.length > 1) return sendError(response, 409, 'transfer_recipient_ambiguous');
    const recipient = recipientMatches[0];
    if (!recipient) return sendError(response, 404, 'transfer_recipient_not_found');
    if (recipient.id === request.user.id) return sendError(response, 400, 'cannot_transfer_to_self');

    if (isPaperAsset) {
        db.exec('BEGIN IMMEDIATE');
        try {
            const senderPosition = db.prepare(`
                SELECT quantity_base_units FROM paper_positions
                WHERE user_id = ? AND asset = ?
            `).get(request.user.id, asset);
            if (!senderPosition || BigInt(senderPosition.quantity_base_units) < BigInt(amountUnits)) {
                db.exec('ROLLBACK');
                return sendError(response, 400, 'insufficient_transfer_balance');
            }
            const id = randomBytes(16).toString('hex');
            db.prepare(`
                INSERT INTO paper_asset_transfers
                    (id, sender_user_id, recipient_user_id, asset, amount_base_units)
                VALUES (?, ?, ?, ?, ?)
            `).run(id, request.user.id, recipient.id, asset, amountUnits);
            db.exec('COMMIT');
            return response.status(201).json({
                id,
                recipientEmail: recipient.email,
                asset,
                amount: baseUnitsToDecimal(amountUnits, decimals),
                status: 'pending'
            });
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
    }

    const balanceColumn = asset === 'USDT' ? 'usdt_balance' : 'stakeai_balance';
    db.exec('BEGIN IMMEDIATE');
    try {
        const sender = db.prepare(`SELECT ${balanceColumn} AS balance FROM users WHERE id = ?`)
            .get(request.user.id);
        if (BigInt(sender.balance) < BigInt(amountUnits)) {
            db.exec('ROLLBACK');
            return sendError(response, 400, 'insufficient_transfer_balance');
        }
        const id = randomBytes(16).toString('hex');
        db.prepare(`
            INSERT INTO user_transfers (id, sender_user_id, recipient_user_id, asset, amount_base_units)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, request.user.id, recipient.id, asset, amountUnits);
        db.exec('COMMIT');
        response.status(201).json({
            id,
            recipientEmail: recipient.email,
            asset,
            amount: baseUnitsToDecimal(amountUnits, decimals),
            status: 'pending'
        });
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
});

app.get('/api/admin/transfers', requireAdmin, (request, response) => {
    const internalTransfers = db.prepare(`
        SELECT t.id, t.asset, t.amount_base_units, t.created_at,
               sender.email AS sender_email, recipient.email AS recipient_email
        FROM user_transfers t
        JOIN users sender ON sender.id = t.sender_user_id
        JOIN users recipient ON recipient.id = t.recipient_user_id
        WHERE t.status = 'pending'
        ORDER BY t.created_at ASC, t.id ASC
        LIMIT 100
    `).all();
    const paperTransfers = db.prepare(`
        SELECT t.id, t.asset, t.amount_base_units, t.created_at,
               sender.email AS sender_email, recipient.email AS recipient_email
        FROM paper_asset_transfers t
        JOIN users sender ON sender.id = t.sender_user_id
        JOIN users recipient ON recipient.id = t.recipient_user_id
        WHERE t.status = 'pending'
        ORDER BY t.created_at ASC, t.id ASC
        LIMIT 100
    `).all();
    const transfers = [...internalTransfers, ...paperTransfers].map((transfer) => ({
        id: transfer.id,
        senderEmail: transfer.sender_email,
        recipientEmail: transfer.recipient_email,
        asset: transfer.asset,
        amount: baseUnitsToDecimal(
            transfer.amount_base_units,
            transfer.asset === 'USDT' ? 6 : ['BTC', 'ETH', 'BNB'].includes(transfer.asset) ? 8 : 18
        ),
        createdAt: transfer.created_at
    })).sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
        .slice(0, 100);
    response.json({ transfers });
});

app.post('/api/admin/transfers/:transferId/decision', requireSameOrigin, requireAdmin, (request, response) => {
    const { transferId } = request.params;
    const { decision } = request.body || {};
    if (!/^[a-f0-9]{32}$/.test(transferId) || !['approve', 'reject'].includes(decision)) {
        return sendError(response, 400, 'invalid_transfer_decision');
    }

    db.exec('BEGIN IMMEDIATE');
    try {
        const transfer = db.prepare(`
            SELECT id, sender_user_id, recipient_user_id, asset, amount_base_units
            FROM user_transfers
            WHERE id = ? AND status = 'pending'
        `).get(transferId) || db.prepare(`
            SELECT id, sender_user_id, recipient_user_id, asset, amount_base_units
            FROM paper_asset_transfers
            WHERE id = ? AND status = 'pending'
        `).get(transferId);
        const isPaperTransfer = transfer && ['BTC', 'ETH', 'BNB'].includes(transfer.asset);
        if (!transfer) {
            db.exec('ROLLBACK');
            return sendError(response, 404, 'pending_transfer_not_found');
        }
        if (decision === 'approve') {
            if (isPaperTransfer) {
                const accounts = db.prepare(`
                    SELECT id, email_verified, disabled_at
                    FROM users
                    WHERE id IN (?, ?)
                `).all(transfer.sender_user_id, transfer.recipient_user_id);
                const sender = accounts.find((account) => account.id === transfer.sender_user_id);
                const recipient = accounts.find((account) => account.id === transfer.recipient_user_id);
                if (!sender || !recipient
                    || !sender.email_verified || sender.disabled_at
                    || !recipient.email_verified || recipient.disabled_at) {
                    db.exec('ROLLBACK');
                    return sendError(response, 409, 'transfer_account_unavailable');
                }
                const senderPosition = db.prepare(`
                    SELECT quantity_base_units, average_price_base_units
                    FROM paper_positions WHERE user_id = ? AND asset = ?
                `).get(transfer.sender_user_id, transfer.asset);
                const amount = BigInt(transfer.amount_base_units);
                const senderQuantity = BigInt(senderPosition?.quantity_base_units || '0');
                if (senderQuantity < amount) {
                    db.exec('ROLLBACK');
                    return sendError(response, 409, 'insufficient_transfer_balance');
                }
                const recipientPosition = db.prepare(`
                    SELECT quantity_base_units, average_price_base_units
                    FROM paper_positions WHERE user_id = ? AND asset = ?
                `).get(transfer.recipient_user_id, transfer.asset);
                const recipientQuantity = BigInt(recipientPosition?.quantity_base_units || '0');
                const updatedSenderQuantity = senderQuantity - amount;
                const updatedRecipientQuantity = recipientQuantity + amount;
                if (updatedSenderQuantity === 0n) {
                    db.prepare('DELETE FROM paper_positions WHERE user_id = ? AND asset = ?')
                        .run(transfer.sender_user_id, transfer.asset);
                } else {
                    db.prepare(`
                        UPDATE paper_positions SET quantity_base_units = ?
                        WHERE user_id = ? AND asset = ?
                    `).run(updatedSenderQuantity.toString(), transfer.sender_user_id, transfer.asset);
                }
                const transferredCost = amount * BigInt(senderPosition.average_price_base_units);
                const recipientCost = recipientQuantity * BigInt(recipientPosition?.average_price_base_units || '0');
                const newAveragePrice = updatedRecipientQuantity === 0n
                    ? 0n
                    : (recipientCost + transferredCost) / updatedRecipientQuantity;
                db.prepare(`
                    INSERT INTO paper_positions
                        (user_id, asset, quantity_base_units, average_price_base_units)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(user_id, asset) DO UPDATE SET
                        quantity_base_units = excluded.quantity_base_units,
                        average_price_base_units = excluded.average_price_base_units
                `).run(
                    transfer.recipient_user_id,
                    transfer.asset,
                    updatedRecipientQuantity.toString(),
                    newAveragePrice.toString()
                );
                db.prepare(`
                    UPDATE paper_asset_transfers
                    SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
                    WHERE id = ? AND status = 'pending'
                `).run(request.user.id, transferId);
                db.exec('COMMIT');
                return response.json({ transferId, status: 'approved' });
            }
            const balanceColumn = transfer.asset === 'USDT' ? 'usdt_balance' : 'stakeai_balance';
            const accounts = db.prepare(`
                SELECT id, email_verified, disabled_at, ${balanceColumn} AS balance
                FROM users
                WHERE id IN (?, ?)
            `).all(transfer.sender_user_id, transfer.recipient_user_id);
            const sender = accounts.find((account) => account.id === transfer.sender_user_id);
            const recipient = accounts.find((account) => account.id === transfer.recipient_user_id);
            if (!sender || !recipient
                || !sender.email_verified || sender.disabled_at
                || !recipient.email_verified || recipient.disabled_at) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'transfer_account_unavailable');
            }
            const senderBalance = BigInt(sender.balance);
            const recipientBalance = BigInt(recipient.balance);
            const amount = BigInt(transfer.amount_base_units);
            if (senderBalance < amount) {
                db.exec('ROLLBACK');
                return sendError(response, 409, 'insufficient_transfer_balance');
            }

            db.prepare(`UPDATE users SET ${balanceColumn} = ? WHERE id = ?`)
                .run((senderBalance - amount).toString(), transfer.sender_user_id);
            db.prepare(`UPDATE users SET ${balanceColumn} = ? WHERE id = ?`)
                .run((recipientBalance + amount).toString(), transfer.recipient_user_id);
            const audit = db.prepare(`
                INSERT INTO balance_audit_log
                    (admin_user_id, target_user_id, asset, previous_balance, new_balance)
                VALUES (?, ?, ?, ?, ?)
            `);
            audit.run(
                request.user.id,
                transfer.sender_user_id,
                transfer.asset,
                senderBalance.toString(),
                (senderBalance - amount).toString()
            );
            audit.run(
                request.user.id,
                transfer.recipient_user_id,
                transfer.asset,
                recipientBalance.toString(),
                (recipientBalance + amount).toString()
            );
        }
        const status = decision === 'approve' ? 'approved' : 'rejected';
        db.prepare(`
            UPDATE ${isPaperTransfer ? 'paper_asset_transfers' : 'user_transfers'}
            SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
            WHERE id = ? AND status = 'pending'
        `).run(status, request.user.id, transferId);
        db.exec('COMMIT');
        response.json({ transferId, status });
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
});

app.post('/api/admin/users/:userId/balances', requireSameOrigin, requireAdmin, (request, response) => {
    const { userId } = request.params;
    const { usdtBalance, stakeaiBalance } = request.body || {};
    if (!/^[a-f0-9]{32}$/.test(userId)) return sendError(response, 400, 'invalid_user_id');
    const usdtUnits = decimalToBaseUnits(usdtBalance, 6);
    const stakeaiUnits = decimalToBaseUnits(stakeaiBalance, 18);
    if (usdtUnits === null || stakeaiUnits === null) {
        return sendError(response, 400, 'invalid_balance_amount');
    }
    const target = db.prepare(`
        SELECT id, usdt_balance, stakeai_balance
        FROM users
        WHERE id = ?
    `).get(userId);
    if (!target) return sendError(response, 404, 'user_not_found');

    db.exec('BEGIN IMMEDIATE');
    try {
        const updateUser = db.prepare(`
            UPDATE users
            SET usdt_balance = ?, stakeai_balance = ?
            WHERE id = ?
        `);
        updateUser.run(usdtUnits, stakeaiUnits, userId);
        const recordChange = db.prepare(`
            INSERT INTO balance_audit_log
                (admin_user_id, target_user_id, asset, previous_balance, new_balance)
            VALUES (?, ?, ?, ?, ?)
        `);
        if (target.usdt_balance !== usdtUnits) {
            recordChange.run(request.user.id, userId, 'USDT', target.usdt_balance, usdtUnits);
        }
        if (target.stakeai_balance !== stakeaiUnits) {
            recordChange.run(request.user.id, userId, 'STAKEAI', target.stakeai_balance, stakeaiUnits);
        }
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.json({
        userId,
        usdtBalance: baseUnitsToDecimal(usdtUnits, 6),
        stakeaiBalance: baseUnitsToDecimal(stakeaiUnits, 18)
    });
});

app.post('/api/admin/users/:userId/status', requireSameOrigin, requireAdmin, (request, response) => {
    const { userId } = request.params;
    const { disabled } = request.body || {};
    if (!/^[a-f0-9]{32}$/.test(userId) || typeof disabled !== 'boolean') {
        return sendError(response, 400, 'invalid_user_status_request');
    }

    const target = db.prepare('SELECT id, email FROM users WHERE id = ?').get(userId);
    if (!target) return sendError(response, 404, 'user_not_found');
    if (adminEmails.has(target.email.toLowerCase())) {
        return sendError(response, 403, 'cannot_change_admin_status');
    }

    const action = disabled ? 'user_disabled' : 'user_enabled';
    db.exec('BEGIN IMMEDIATE');
    try {
        db.prepare('UPDATE users SET disabled_at = ? WHERE id = ?')
            .run(disabled ? new Date().toISOString() : null, userId);
        if (disabled) db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
        db.prepare('INSERT INTO admin_audit_log (admin_user_id, target_user_id, action) VALUES (?, ?, ?)')
            .run(request.user.id, userId, action);
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    response.json({ userId, disabled, action });
});

app.get('/api/referrals/summary', requireSession, (request, response) => {
    const referredUsers = db.prepare(`
        SELECT email FROM users
        WHERE referred_by = ?
        ORDER BY created_at DESC, id DESC
    `).all(request.user.id).map(({ email }) => ({ email: maskEmail(email) }));
    const commissions = db.prepare(`
        SELECT level, asset, amount_base_units
        FROM referral_commissions
        WHERE beneficiary_user_id = ? AND status = 'pending'
    `).all(request.user.id);
    const totalsByAssetAndLevel = new Map();
    for (const commission of commissions) {
        const key = `${commission.level}:${commission.asset}`;
        const total = totalsByAssetAndLevel.get(key) || {
            level: commission.level,
            asset: commission.asset,
            amount: 0n
        };
        total.amount += BigInt(commission.amount_base_units);
        totalsByAssetAndLevel.set(key, total);
    }
    const totals = [...totalsByAssetAndLevel.values()].map((total) => ({
        level: total.level,
        asset: total.asset,
        amount_base_units: total.amount.toString()
    }));
    response.json({
        referralCode: request.user.referral_code,
        directReferrals: referredUsers.length,
        referredUsers,
        proposedRatesBasisPoints: [500, 200, 100],
        pendingCommissions: totals
    });
});

app.post('/api/internal/collected-service-fees', (request, response) => {
    const configuredKey = process.env.INTERNAL_SERVICE_API_KEY || '';
    const suppliedKey = request.get('x-service-api-key') || '';
    if (configuredKey.length < 32 || suppliedKey.length !== configuredKey.length
        || !timingSafeEqual(Buffer.from(suppliedKey), Buffer.from(configuredKey))) {
        return sendError(response, 401, 'internal_service_unauthorized');
    }

    const { reference, payerUserId, amountBaseUnits, asset } = request.body || {};
    if (typeof reference !== 'string' || reference.length < 8 || reference.length > 128
        || typeof payerUserId !== 'string' || !/^[a-f0-9]{32}$/.test(payerUserId)
        || typeof amountBaseUnits !== 'string' || !/^[1-9]\d{0,77}$/.test(amountBaseUnits)
        || typeof asset !== 'string' || !/^[A-Z0-9]{2,16}$/.test(asset)) {
        return sendError(response, 400, 'invalid_collected_fee');
    }

    const payer = db.prepare('SELECT id, referred_by FROM users WHERE id = ? AND email_verified = 1')
        .get(payerUserId);
    if (!payer) return sendError(response, 404, 'payer_not_found');

    const ratesBasisPoints = [500n, 200n, 100n];
    db.exec('BEGIN IMMEDIATE');
    try {
        db.prepare(`
            INSERT INTO collected_service_fees (reference, payer_user_id, amount_base_units, asset)
            VALUES (?, ?, ?, ?)
        `).run(reference, payerUserId, amountBaseUnits, asset);

        let beneficiaryId = payer.referred_by;
        for (let index = 0; index < ratesBasisPoints.length && beneficiaryId; index += 1) {
            const beneficiary = db.prepare('SELECT id, referred_by FROM users WHERE id = ?')
                .get(beneficiaryId);
            if (!beneficiary) break;
            const commission = (BigInt(amountBaseUnits) * ratesBasisPoints[index]) / 10000n;
            if (commission > 0n) {
                db.prepare(`
                    INSERT INTO referral_commissions
                        (fee_reference, beneficiary_user_id, level, amount_base_units, asset)
                    VALUES (?, ?, ?, ?, ?)
                `).run(reference, beneficiary.id, index + 1, commission.toString(), asset);
            }
            beneficiaryId = beneficiary.referred_by;
        }
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || isUniqueViolation(error)) {
            return sendError(response, 409, 'fee_reference_already_recorded');
        }
        throw error;
    }
    response.status(201).json({ recorded: true, paid: false });
});

app.get('/vendor/ethers.umd.min.js', (_request, response, next) => {
    response.sendFile(path.join(root, 'node_modules', 'ethers', 'dist', 'ethers.umd.min.js'), (error) => {
        if (error) next(error);
    });
});

const publicFilePattern = /^\/(?:(?:index|admin|admin-setup|referrals|verify-email|check-email|staking-rehberi)\.html|(?:app|admin|admin-setup|referrals|verify-email|check-email|tailwind\.config)\.js|theme\.css|stakeai-logo\.svg|og-image\.png)?$/;
const noindexPattern = /^\/(?:admin|admin-setup|referrals|verify-email|check-email)\.html$/;

app.get('/robots.txt', (_request, response) => {
    response.type('text/plain').send([
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin.html',
        'Disallow: /admin-setup.html',
        'Disallow: /verify-email.html',
        'Disallow: /check-email.html',
        'Disallow: /referrals.html',
        'Disallow: /api/',
        `Sitemap: ${publicOrigin}/sitemap.xml`,
        ''
    ].join('\n'));
});

app.get('/sitemap.xml', (_request, response) => {
    response.type('application/xml').send(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + `  <url><loc>${publicOrigin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`
        + `  <url><loc>${publicOrigin}/staking-rehberi.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`
        + '</urlset>\n'
    );
});

const publicStatic = express.static(root, {
    dotfiles: 'ignore',
    index: 'index.html',
    maxAge: isProduction ? '1h' : 0,
    setHeaders: (response, filePath) => {
        if (/\.(html|js|css|mjs)$/i.test(filePath)) response.setHeader('Cache-Control', 'no-cache');
    }
});
app.use((request, response, next) => {
    if (!publicFilePattern.test(request.path)) return next();
    if (noindexPattern.test(request.path)) response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return publicStatic(request, response, next);
});

app.use((error, _request, response, _next) => {
    console.error('Unhandled request error.', error);
    if (response.headersSent) return;
    response.status(500).json({ error: 'internal_server_error' });
});

app.listen(port, () => {
    console.log(`STAKEAI API and preview running at ${publicOrigin}`);
});
