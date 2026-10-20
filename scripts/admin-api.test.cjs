const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { createHash, createHmac, scryptSync } = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { once } = require('node:events');
const { createServer } = require('node:http');
const { mkdtempSync, rmSync } = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const { tmpdir } = require('node:os');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const adminId = 'a'.repeat(32);
const memberId = 'b'.repeat(32);
const referralId = 'c'.repeat(32);
const adminToken = 'admin-api-test-token';
const memberToken = 'member-api-test-token';
const sessionSecret = 'admin-api-test-session-secret-32-chars';
const memberPassword = 'correct-horse-battery-staple';

async function unusedPort() {
    const listener = net.createServer();
    listener.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    const { port } = listener.address();
    await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
    return port;
}

function passwordHash(password) {
    const salt = Buffer.from('0123456789abcdef');
    const digest = scryptSync(password, salt, 64, {
        N: 16384,
        r: 8,
        p: 1,
        maxmem: 64 * 1024 * 1024
    });
    return `scrypt$16384$8$1$${salt.toString('hex')}$${digest.toString('hex')}`;
}

function totpCode(secret, time = Date.now()) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let buffer = 0;
    const secretBytes = [];
    for (const character of secret) {
        buffer = (buffer << 5) | alphabet.indexOf(character);
        bits += 5;
        if (bits >= 8) {
            secretBytes.push((buffer >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    const counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(Math.floor(time / 30_000)));
    const digest = createHmac('sha1', Buffer.from(secretBytes)).update(counter).digest();
    const offset = digest[digest.length - 1] & 0x0f;
    return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

function addSession(db, token, userId) {
    const hash = createHmac('sha256', sessionSecret).update(token).digest('hex');
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
        .run(hash, userId, Date.now() + 60 * 60 * 1000);
}

function makeTronAddress(fillByte) {
    const payload = Buffer.concat([Buffer.from([0x41]), Buffer.alloc(20, fillByte)]);
    const checksum = createHash('sha256')
        .update(createHash('sha256').update(payload).digest())
        .digest()
        .subarray(0, 4);
    const bytes = Buffer.concat([payload, checksum]);
    let value = BigInt(`0x${bytes.toString('hex')}`);
    let encoded = '';
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    while (value > 0n) {
        encoded = alphabet[Number(value % 58n)] + encoded;
        value /= 58n;
    }
    for (const byte of bytes) {
        if (byte !== 0) break;
        encoded = `1${encoded}`;
    }
    return encoded;
}

test('admin API restricts access and audits account status changes', async (context) => {
    const directory = mkdtempSync(path.join(tmpdir(), 'stakeai-admin-api-'));
    let server;
    let marketServer;
    let aiServer;
    let lastAiRequest;
    context.after(async () => {
        if (server && server.exitCode === null) {
            server.kill('SIGKILL');
            server.unref();
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (marketServer?.listening) {
            await new Promise((resolve, reject) => marketServer.close((error) => error ? reject(error) : resolve()));
        }
        if (aiServer?.listening) {
            await new Promise((resolve, reject) => aiServer.close((error) => error ? reject(error) : resolve()));
        }
        rmSync(directory, { recursive: true, force: true });
    });
    const databasePath = path.join(directory, 'admin-test.sqlite');
    const db = new DatabaseSync(databasePath);
    db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            email_verified INTEGER NOT NULL DEFAULT 0,
            trc20_address TEXT NOT NULL DEFAULT '',
            referral_code TEXT NOT NULL UNIQUE,
            referred_by TEXT REFERENCES users(id),
            disabled_at TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE sessions (
            token_hash TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            expires_at INTEGER NOT NULL
        );
    `);
    const insertUser = db.prepare(`
        INSERT INTO users (id, email, password_hash, email_verified, referral_code)
        VALUES (?, ?, ?, 1, ?)
    `);
    insertUser.run(adminId, 'admin@example.test', passwordHash('admin-password-for-test'), 'A'.repeat(16));
    insertUser.run(memberId, 'member@example.test', passwordHash(memberPassword), 'B'.repeat(16));
    db.prepare(`
        INSERT INTO users (id, email, password_hash, email_verified, referral_code, referred_by)
        VALUES (?, ?, ?, 1, ?, ?)
    `).run(referralId, 'alice.smith@example.test', passwordHash('referral-password-for-test'), 'C'.repeat(16), memberId);
    const recipientTronAddress = makeTronAddress(2);
    db.prepare('UPDATE users SET trc20_address = ? WHERE id = ?').run(recipientTronAddress, referralId);
    addSession(db, adminToken, adminId);
    addSession(db, memberToken, memberId);
    db.close();

    marketServer = createServer((request, response) => {
        response.setHeader('content-type', 'application/json');
        if (request.url.startsWith('/api/v3/ticker/24hr')) {
            response.end(JSON.stringify([
                { symbol: 'BTCUSDT', lastPrice: '60000.00000000', priceChangePercent: '1.25', highPrice: '61000.00000000', lowPrice: '59000.00000000', quoteVolume: '1000000' },
                { symbol: 'ETHUSDT', lastPrice: '3000.00000000', priceChangePercent: '-0.50', highPrice: '3100.00000000', lowPrice: '2900.00000000', quoteVolume: '500000' },
                { symbol: 'BNBUSDT', lastPrice: '600.00000000', priceChangePercent: '0.75', highPrice: '620.00000000', lowPrice: '580.00000000', quoteVolume: '100000' }
            ]));
            return;
        }
        if (request.url.startsWith('/api/v3/klines')) {
            const candles = Array.from({ length: 48 }, (_, index) => {
                const closeTime = (index + 1) * 60 * 60 * 1000;
                return [String(index * 60 * 60 * 1000), '1', '2', '0.5', '1.5', '100', String(closeTime)];
            });
            response.end(JSON.stringify(candles));
            return;
        }
        response.statusCode = 404;
        response.end(JSON.stringify({ error: 'not_found' }));
    });
    const marketProviderPort = await unusedPort();
    marketServer.listen(marketProviderPort, '127.0.0.1');
    await once(marketServer, 'listening');

    aiServer = createServer((request, response) => {
        const chunks = [];
        request.on('data', (chunk) => chunks.push(chunk));
        request.on('end', () => {
            lastAiRequest = {
                authorization: request.headers.authorization,
                body: JSON.parse(Buffer.concat(chunks).toString('utf8'))
            };
            response.setHeader('content-type', 'application/json');
            const latestMessage = lastAiRequest.body.messages.at(-1)?.content;
            if (latestMessage === 'simulate provider rate limit') {
                response.statusCode = 429;
                response.end(JSON.stringify({ error: { code: 'rate_limit_exceeded', type: 'requests', message: 'provider detail must not be exposed' } }));
                return;
            }
            if (latestMessage === 'simulate provider quota') {
                response.statusCode = 429;
                response.end(JSON.stringify({ error: { code: 'credit_balance_exhausted', type: 'insufficient_quota', message: 'provider detail must not be exposed' } }));
                return;
            }
            response.end(JSON.stringify({
                choices: [{ message: { content: 'STAKEAI tarafından oluşturuldum; OpenAI modeliyle destekleniyorum.' } }]
            }));
        });
    });
    const aiProviderPort = await unusedPort();
    aiServer.listen(aiProviderPort, '127.0.0.1');
    await once(aiServer, 'listening');

    const port = await unusedPort();
    const origin = `http://127.0.0.1:${port}`;
    server = spawn(process.execPath, ['server.mjs'], {
        cwd: root,
        env: {
            ...process.env,
            SESSION_SECRET: sessionSecret,
            PUBLIC_ORIGIN: origin,
            PORT: String(port),
            DATABASE_PATH: databasePath,
            MARKET_DATA_BASE_URL: `http://127.0.0.1:${marketProviderPort}`,
            OPENAI_API_KEY: 'openai-api-test-key',
            OPENAI_MODEL: 'test-model',
            OPENAI_API_BASE_URL: `http://127.0.0.1:${aiProviderPort}/v1`,
            ASSISTANT_PROVIDER: 'openai',
            ASSISTANT_TEST_MODE: 'false',
            API_RATE_LIMIT_PER_MINUTE: '200',
            ADMIN_EMAILS: 'admin@example.test',
            TASK_TELEGRAM_URL: 'https://t.me/stakeai_test',
            TASK_X_PROFILE_URL: 'https://x.com/stakeai_test',
            TASK_X_POST_URL: 'https://x.com/stakeai_test/status/1',
            TASK_FACEBOOK_URL: 'https://facebook.com/stakeai_test'
        },
        stdio: 'ignore'
    });
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
        if (server.exitCode !== null) throw new Error(`Test API exited with code ${server.exitCode}.`);
        try {
            const response = await fetch(`${origin}/api/auth/session`);
            if (response.ok || response.status === 401) {
                ready = true;
                break;
            }
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    assert.equal(ready, true, 'test API should start');

    const cookieHeaders = (token) => ({ cookie: `stakeai_session=${token}` });
    const assistantRequest = (body, requestOrigin = origin) => fetch(`${origin}/api/assistants/chat`, {
        method: 'POST',
        headers: {
            origin: requestOrigin,
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    assert.equal((await assistantRequest(
        { assistant: 'companion', messages: [{ role: 'user', content: 'Hello' }] },
        'https://attacker.test'
    )).status, 403);
    assert.equal((await assistantRequest({ assistant: 'unknown', messages: [{ role: 'user', content: 'Hello' }] })).status, 400);
    assert.equal((await assistantRequest({ assistant: 'companion', messages: [null] })).status, 400);
    assert.equal((await assistantRequest({
        assistant: 'companion',
        messages: [{ role: 'user', content: 'x'.repeat(4001) }]
    })).status, 400);
    const assistantResponse = await assistantRequest({
        assistant: 'companion',
        messages: [{ role: 'user', content: 'Sen nasıl oluştun?' }]
    });
    assert.equal(assistantResponse.status, 200);
    assert.equal(assistantResponse.headers.get('cache-control'), 'no-store');
    assert.equal(lastAiRequest.authorization, 'Bearer openai-api-test-key');
    assert.equal(lastAiRequest.body.model, 'test-model');
    assert.equal(lastAiRequest.body.messages[0].role, 'system');
    assert.match(lastAiRequest.body.messages[0].content, /do not claim a particular model provider/);
    assert.equal((await assistantResponse.json()).reply, 'STAKEAI tarafından oluşturuldum; OpenAI modeliyle destekleniyorum.');
    const providerRateLimitResponse = await assistantRequest({
        assistant: 'companion',
        messages: [{ role: 'user', content: 'simulate provider rate limit' }]
    });
    assert.equal(providerRateLimitResponse.status, 503);
    assert.equal((await providerRateLimitResponse.json()).error, 'ai_assistant_rate_limited');
    const providerQuotaResponse = await assistantRequest({
        assistant: 'companion',
        messages: [{ role: 'user', content: 'simulate provider quota' }]
    });
    assert.equal(providerQuotaResponse.status, 503);
    assert.equal((await providerQuotaResponse.json()).error, 'ai_assistant_quota_exceeded');

    const listResponse = await fetch(`${origin}/api/admin/users?page=1`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal(listResponse.status, 200);
    const list = await listResponse.json();
    assert.equal(list.total, 3);
    assert.equal(list.users.find((user) => user.email === 'admin@example.test').isAdmin, true);
    const listedMember = list.users.find((user) => user.id === memberId);
    assert.equal(listedMember.first_name, '');
    assert.equal(listedMember.last_name, '');
    assert.equal(listedMember.trc20_address, '');
    assert.equal(listedMember.usdt_balance, '0');
    assert.equal(listedMember.stakeai_balance, '0');

    const unauthenticated = await fetch(`${origin}/api/admin/users`);
    assert.equal(unauthenticated.status, 401);
    const nonAdmin = await fetch(`${origin}/api/admin/users`, {
        headers: cookieHeaders(memberToken)
    });
    assert.equal(nonAdmin.status, 403);

    const searchResponse = await fetch(`${origin}/api/admin/users?search=member%40example.test`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal((await searchResponse.json()).total, 1);

    const referralResponse = await fetch(`${origin}/api/referrals/summary`, {
        headers: cookieHeaders(memberToken)
    });
    assert.equal(referralResponse.status, 200);
    const referralSummary = await referralResponse.json();
    assert.equal(referralSummary.directReferrals, 1);
    assert.deepEqual(referralSummary.referredUsers, [{ email: 'a***@example.test' }]);
    assert.equal(JSON.stringify(referralSummary).includes('alice.smith@example.test'), false);

    const updateStatus = (userId, disabled, token = adminToken, requestOrigin = origin) => fetch(
        `${origin}/api/admin/users/${userId}/status`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ disabled })
        }
    );
    assert.equal((await updateStatus(adminId, true)).status, 403);
    assert.equal((await updateStatus(memberId, true, memberToken)).status, 403);
    assert.equal((await updateStatus(memberId, true, adminToken, 'https://attacker.test')).status, 403);

    const disabled = await updateStatus(memberId, true);
    assert.equal(disabled.status, 200);
    assert.equal((await disabled.json()).disabled, true);
    assert.equal((await fetch(`${origin}/api/admin/session`, {
        headers: cookieHeaders(memberToken)
    })).status, 401);

    const loginResponse = await fetch(`${origin}/api/auth/login`, {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'member@example.test', password: memberPassword })
    });
    assert.equal(loginResponse.status, 401);

    const enabled = await updateStatus(memberId, false);
    assert.equal(enabled.status, 200);
    assert.equal((await enabled.json()).disabled, false);

    const balancesMemberToken = 'member-balances-test-token';
    const sessionDb = new DatabaseSync(databasePath);
    addSession(sessionDb, balancesMemberToken, memberId);
    sessionDb.close();
    const accountSummary = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal(accountSummary.status, 200);
    assert.deepEqual(await accountSummary.json(), {
        email: 'member@example.test',
        firstName: '',
        lastName: '',
        trc20Address: '',
        usdtBalance: '0',
        stakeaiBalance: '0',
        twoFactorEnabled: false
    });
    const profileUpdate = await fetch(`${origin}/api/account/profile`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ firstName: 'Member', lastName: 'Example' })
    });
    assert.equal(profileUpdate.status, 200);
    assert.deepEqual(await profileUpdate.json(), { firstName: 'Member', lastName: 'Example' });
    const invalidProfileUpdate = await fetch(`${origin}/api/account/profile`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ firstName: '', lastName: 'Example' })
    });
    assert.equal(invalidProfileUpdate.status, 400);
    const unavailableEmailChange = await fetch(`${origin}/api/account/change-email`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            email: 'new-member@example.test',
            currentPassword: memberPassword
        })
    });
    assert.equal(unavailableEmailChange.status, 503);
    const storedTrc20Address = `T${'1'.repeat(33)}`;
    const profileDb = new DatabaseSync(databasePath);
    profileDb.prepare('UPDATE users SET trc20_address = ? WHERE id = ?')
        .run(storedTrc20Address, memberId);
    profileDb.close();

    const updateBalances = (userId, balances, token = adminToken, requestOrigin = origin) => fetch(
        `${origin}/api/admin/users/${userId}/balances`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify(balances)
        }
    );
    const balances = { usdtBalance: '123.456789', stakeaiBalance: '1.123456789012345678' };
    assert.equal((await updateBalances(memberId, balances, balancesMemberToken)).status, 403);
    assert.equal((await updateBalances(memberId, balances, adminToken, 'https://attacker.test')).status, 403);
    assert.equal((await updateBalances(memberId, {
        usdtBalance: '1.0000001',
        stakeaiBalance: '1'
    })).status, 400);
    assert.equal((await updateBalances(memberId, {
        usdtBalance: '-1',
        stakeaiBalance: '1'
    })).status, 400);
    const savedBalances = await updateBalances(memberId, balances);
    assert.equal(savedBalances.status, 200);
    assert.deepEqual(await savedBalances.json(), {
        userId: memberId,
        usdtBalance: balances.usdtBalance,
        stakeaiBalance: balances.stakeaiBalance
    });
    const updatedSummary = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.deepEqual(await updatedSummary.json(), {
        email: 'member@example.test',
        firstName: 'Member',
        lastName: 'Example',
        trc20Address: storedTrc20Address,
        usdtBalance: balances.usdtBalance,
        stakeaiBalance: balances.stakeaiBalance,
        twoFactorEnabled: false
    });

    const recipientToken = 'recipient-transfer-test-token';
    const transferDb = new DatabaseSync(databasePath);
    addSession(transferDb, recipientToken, referralId);
    transferDb.close();
    const createTransfer = (payload, token = balancesMemberToken, requestOrigin = origin) => fetch(
        `${origin}/api/account/transfers`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );
    const transferPayload = {
        recipientInfo: recipientTronAddress,
        asset: 'USDT',
        amount: '25.123456'
    };
    assert.equal((await createTransfer(transferPayload, memberToken)).status, 401);
    assert.equal((await createTransfer(transferPayload, balancesMemberToken, 'https://attacker.test')).status, 403);
    assert.equal((await createTransfer({ ...transferPayload, recipientInfo: 'invalid-address' })).status, 400);
    assert.equal((await createTransfer({ ...transferPayload, recipientInfo: makeTronAddress(3) })).status, 404);
    assert.equal((await createTransfer({ ...transferPayload, amount: '1000' })).status, 400);
    assert.equal((await createTransfer({ ...transferPayload, amount: '1.1234567' })).status, 400);
    const selfTransfer = await createTransfer({
        recipientInfo: 'B'.repeat(16),
        asset: 'STAKEAI',
        amount: '1'
    });
    assert.equal(selfTransfer.status, 400);
    assert.equal((await selfTransfer.json()).error, 'cannot_transfer_to_self');
    const duplicateAddressDb = new DatabaseSync(databasePath);
    duplicateAddressDb.prepare('UPDATE users SET trc20_address = ? WHERE id = ?')
        .run(recipientTronAddress, memberId);
    duplicateAddressDb.close();
    const ambiguousRecipient = await createTransfer(transferPayload);
    assert.equal(ambiguousRecipient.status, 409);
    assert.equal((await ambiguousRecipient.json()).error, 'transfer_recipient_ambiguous');
    const restoreRecipientDb = new DatabaseSync(databasePath);
    restoreRecipientDb.prepare("UPDATE users SET trc20_address = '' WHERE id = ?").run(memberId);
    restoreRecipientDb.close();
    const createdTransferResponse = await createTransfer(transferPayload);
    assert.equal(createdTransferResponse.status, 201);
    const createdTransfer = await createdTransferResponse.json();
    assert.equal(createdTransfer.status, 'pending');
    const pendingHistoryResponse = await fetch(`${origin}/api/account/transfers`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal(pendingHistoryResponse.status, 200);
    const pendingHistory = await pendingHistoryResponse.json();
    assert.equal(pendingHistory.transfers[0].direction, 'sent');
    assert.equal(pendingHistory.transfers[0].status, 'pending');
    assert.equal(pendingHistory.transfers[0].amount, transferPayload.amount);

    assert.equal((await fetch(`${origin}/api/admin/transfers`, {
        headers: cookieHeaders(balancesMemberToken)
    })).status, 403);
    const pendingTransfersResponse = await fetch(`${origin}/api/admin/transfers`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal(pendingTransfersResponse.status, 200);
    const pendingTransfers = await pendingTransfersResponse.json();
    assert.equal(pendingTransfers.transfers.length, 1);
    assert.equal(pendingTransfers.transfers[0].senderEmail, 'member@example.test');
    assert.equal(pendingTransfers.transfers[0].recipientEmail, 'alice.smith@example.test');
    const decideTransfer = (transferId, decision, token = adminToken, requestOrigin = origin) => fetch(
        `${origin}/api/admin/transfers/${transferId}/decision`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ decision })
        }
    );
    assert.equal((await decideTransfer(createdTransfer.id, 'approve', balancesMemberToken)).status, 403);
    assert.equal((await decideTransfer(createdTransfer.id, 'approve', adminToken, 'https://attacker.test')).status, 403);
    const approved = await decideTransfer(createdTransfer.id, 'approve');
    assert.equal(approved.status, 200);
    assert.deepEqual(await approved.json(), { transferId: createdTransfer.id, status: 'approved' });
    assert.equal((await decideTransfer(createdTransfer.id, 'approve')).status, 404);
    const senderAfterTransfer = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal((await senderAfterTransfer.json()).usdtBalance, '98.333333');
    const recipientAfterTransfer = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(recipientToken)
    });
    assert.equal((await recipientAfterTransfer.json()).usdtBalance, '25.123456');

    const rejectedTransferResponse = await createTransfer({
        ...transferPayload,
        amount: '10'
    });
    assert.equal(rejectedTransferResponse.status, 201);
    const rejectedTransfer = await rejectedTransferResponse.json();
    assert.equal((await decideTransfer(rejectedTransfer.id, 'reject')).status, 200);
    const noPendingResponse = await fetch(`${origin}/api/admin/transfers`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal((await noPendingResponse.json()).transfers.length, 0);
    const senderAfterRejection = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal((await senderAfterRejection.json()).usdtBalance, '98.333333');
    const requestBeforeBalanceChange = await createTransfer({
        ...transferPayload,
        amount: '90'
    });
    assert.equal(requestBeforeBalanceChange.status, 201);
    const pendingBeforeBalanceChange = await requestBeforeBalanceChange.json();
    assert.equal((await updateBalances(memberId, {
        usdtBalance: '10',
        stakeaiBalance: balances.stakeaiBalance
    })).status, 200);
    assert.equal((await decideTransfer(pendingBeforeBalanceChange.id, 'approve')).status, 409);
    const stillPending = await fetch(`${origin}/api/admin/transfers`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal((await stillPending.json()).transfers.length, 1);
    const senderAfterFailedApproval = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal((await senderAfterFailedApproval.json()).usdtBalance, '10');
    const stakeaiTransferResponse = await createTransfer({
        recipientInfo: 'C'.repeat(16),
        asset: 'STAKEAI',
        amount: '0.123456789012345678'
    });
    assert.equal(stakeaiTransferResponse.status, 201);
    const stakeaiTransfer = await stakeaiTransferResponse.json();
    assert.equal((await decideTransfer(stakeaiTransfer.id, 'approve')).status, 200);
    const senderAfterStakeaiTransfer = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal((await senderAfterStakeaiTransfer.json()).stakeaiBalance, '1');
    const recipientAfterStakeaiTransfer = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(recipientToken)
    });
    assert.equal((await recipientAfterStakeaiTransfer.json()).stakeaiBalance, '0.123456789012345678');
    const receivedHistory = await fetch(`${origin}/api/account/transfers`, {
        headers: cookieHeaders(recipientToken)
    });
    const recipientTransfers = await receivedHistory.json();
    const receivedStakeaiTransfer = recipientTransfers.transfers.find((transfer) => transfer.id === stakeaiTransfer.id);
    assert.equal(receivedStakeaiTransfer.direction, 'received');
    assert.equal(receivedStakeaiTransfer.status, 'approved');

    const taskCatalogResponse = await fetch(`${origin}/api/tasks`);
    assert.equal(taskCatalogResponse.status, 200);
    const taskCatalog = await taskCatalogResponse.json();
    assert.equal(taskCatalog.reward, '10');
    assert.equal(taskCatalog.asset, 'USDT');
    assert.deepEqual(taskCatalog.tasks.map((task) => task.key), ['telegram', 'x', 'facebook']);
    assert.equal(taskCatalog.tasks.every((task) => task.configured), true);
    assert.equal((await fetch(`${origin}/api/account/tasks`)).status, 401);
    const createTask = (taskKey, proof, token = balancesMemberToken, requestOrigin = origin) => fetch(
        `${origin}/api/account/tasks`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ taskKey, proof })
        }
    );
    assert.equal((await createTask('telegram', '@member', memberToken)).status, 401);
    assert.equal((await createTask('telegram', '@member', balancesMemberToken, 'https://attacker.test')).status, 403);
    assert.equal((await createTask('other', '@member')).status, 400);
    assert.equal((await createTask('telegram', '   ')).status, 400);
    const telegramTask = await createTask('telegram', '@member-social');
    assert.equal(telegramTask.status, 201);
    assert.equal((await createTask('telegram', '@member-social-again')).status, 409);
    const xTask = await createTask('x', 'https://proof.example/x-repost');
    assert.equal(xTask.status, 201);
    const facebookTask = await createTask('facebook', '@member-facebook');
    assert.equal(facebookTask.status, 201);
    const taskSubmissionHistory = await fetch(`${origin}/api/account/tasks`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    const accountTasks = await taskSubmissionHistory.json();
    assert.equal(accountTasks.tasks.find((task) => task.key === 'telegram').status, 'pending');
    assert.equal(accountTasks.tasks.find((task) => task.key === 'x').proof, 'https://proof.example/x-repost');

    assert.equal((await fetch(`${origin}/api/admin/tasks`, {
        headers: cookieHeaders(balancesMemberToken)
    })).status, 403);
    const pendingTaskResponse = await fetch(`${origin}/api/admin/tasks`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal(pendingTaskResponse.status, 200);
    const pendingTasks = await pendingTaskResponse.json();
    assert.equal(pendingTasks.submissions.length, 3);
    const decideTask = (submissionId, decision, token = adminToken, requestOrigin = origin) => fetch(
        `${origin}/api/admin/tasks/${submissionId}/decision`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ decision })
        }
    );
    const telegramSubmission = pendingTasks.submissions.find((submission) => submission.taskKey === 'telegram');
    const facebookSubmission = pendingTasks.submissions.find((submission) => submission.taskKey === 'facebook');
    assert.equal((await decideTask(telegramSubmission.id, 'approve', balancesMemberToken)).status, 403);
    assert.equal((await decideTask(telegramSubmission.id, 'approve', adminToken, 'https://attacker.test')).status, 403);
    assert.equal((await decideTask(facebookSubmission.id, 'reject')).status, 200);
    assert.equal((await createTask('facebook', '@member-facebook-updated')).status, 201);
    for (const submission of pendingTasks.submissions) {
        const approvedTask = await decideTask(submission.id, 'approve');
        assert.equal(approvedTask.status, 200);
        assert.deepEqual(await approvedTask.json(), {
            submissionId: submission.id,
            status: 'approved',
            reward: '10',
            asset: 'USDT'
        });
    }
    assert.equal((await decideTask(telegramSubmission.id, 'approve')).status, 404);
    const noPendingTaskResponse = await fetch(`${origin}/api/admin/tasks`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal((await noPendingTaskResponse.json()).submissions.length, 0);
    const taskBalanceResponse = await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    assert.equal((await taskBalanceResponse.json()).usdtBalance, '40');

    const marketResponse = await fetch(`${origin}/api/market/summary`);
    assert.equal(marketResponse.status, 200);
    const marketSummary = await marketResponse.json();
    assert.equal(marketSummary.source, 'Binance public market data + STKAI fixed reference');
    assert.deepEqual(marketSummary.markets.map((market) => market.symbol), ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'STKAIUSDT']);
    assert.equal(marketSummary.markets[0].price, '60000');
    assert.equal(marketSummary.markets[0].candles.length, 48);
    assert.equal(marketSummary.markets[0].priceBaseUnits, undefined);
    assert.deepEqual(
        { asset: marketSummary.markets[3].asset, price: marketSummary.markets[3].price, priceType: marketSummary.markets[3].priceType },
        { asset: 'STKAI', price: '1', priceType: 'fixed-reference' }
    );
    assert.equal((await fetch(`${origin}/api/paper/portfolio`)).status, 401);
    assert.equal((await fetch(`${origin}/api/admin/treasury`, {
        headers: cookieHeaders(balancesMemberToken)
    })).status, 403);
    assert.equal((await fetch(`${origin}/api/admin/paper-fees`, {
        headers: cookieHeaders(balancesMemberToken)
    })).status, 403);
    const initialTreasuryResponse = await fetch(`${origin}/api/admin/treasury`, {
        headers: cookieHeaders(adminToken)
    });
    assert.equal(initialTreasuryResponse.status, 200);
    const initialTreasury = await initialTreasuryResponse.json();
    assert.equal(initialTreasury.simulated, true);
    assert.deepEqual(initialTreasury.balances, [
        { asset: 'USDT', balance: '0' },
        { asset: 'BTC', balance: '0' },
        { asset: 'ETH', balance: '0' },
        { asset: 'BNB', balance: '0' },
        { asset: 'STKAI', balance: '21000000' }
    ]);
    const initialPaperFees = await (await fetch(`${origin}/api/admin/paper-fees`, {
        headers: cookieHeaders(adminToken)
    })).json();
    assert.deepEqual(initialPaperFees.balances, [
        { asset: 'USDT', balance: '0' },
        { asset: 'BTC', balance: '0' },
        { asset: 'ETH', balance: '0' },
        { asset: 'BNB', balance: '0' }
    ]);
    assert.deepEqual(initialPaperFees.movements, []);
    const adjustTreasury = (balances, token = adminToken, requestOrigin = origin) => fetch(
        `${origin}/api/admin/treasury`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ balances })
        }
    );
    const startingTreasury = {
        USDT: '0',
        BTC: '1',
        ETH: '1',
        BNB: '1',
        STKAI: '21000000'
    };
    assert.equal((await adjustTreasury(startingTreasury, balancesMemberToken)).status, 403);
    assert.equal((await adjustTreasury(startingTreasury, adminToken, 'https://attacker.test')).status, 403);
    assert.equal((await adjustTreasury({ ...startingTreasury, ETH: '1.000000001' })).status, 400);
    const fundedTreasury = await adjustTreasury(startingTreasury);
    assert.equal(fundedTreasury.status, 200);
    assert.deepEqual((await fundedTreasury.json()).balances, [
        { asset: 'USDT', balance: '0' },
        { asset: 'BTC', balance: '1' },
        { asset: 'ETH', balance: '1' },
        { asset: 'BNB', balance: '1' },
        { asset: 'STKAI', balance: '21000000' }
    ]);

    const paperPortfolio = async (token = balancesMemberToken) => fetch(`${origin}/api/paper/portfolio`, {
        headers: cookieHeaders(token)
    });
    const initialPaperPortfolio = await paperPortfolio();
    assert.equal(initialPaperPortfolio.status, 200);
    const initialPaperState = await initialPaperPortfolio.json();
    assert.equal(initialPaperState.cashBalance, '10000');
    assert.deepEqual(initialPaperState.positions, []);
    const createPaperOrder = (payload, token = balancesMemberToken, requestOrigin = origin) => fetch(
        `${origin}/api/paper/orders`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );
    const createPaperStake = (payload, token = balancesMemberToken, requestOrigin = origin) => fetch(
        `${origin}/api/paper/stakes`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );
    const claimPaperStake = (stakeId, token = balancesMemberToken, requestOrigin = origin) => fetch(
        `${origin}/api/paper/stakes/${encodeURIComponent(stakeId)}/claim`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({})
        }
    );
    const emptyBtcTreasury = { ...startingTreasury, BTC: '0' };
    assert.equal((await adjustTreasury(emptyBtcTreasury)).status, 200);
    const unstockedBtcOrder = await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0.01' });
    assert.equal(unstockedBtcOrder.status, 409);
    assert.deepEqual(await unstockedBtcOrder.json(), { error: 'paper_insufficient_treasury_inventory' });
    assert.equal((await adjustTreasury(startingTreasury)).status, 200);
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0.01' }, memberToken)).status, 401);
    assert.equal((await createPaperOrder(
        { symbol: 'BTCUSDT', side: 'buy', quantity: '0.01' },
        balancesMemberToken,
        'https://attacker.test'
    )).status, 403);
    assert.equal((await createPaperOrder({ symbol: 'DOGEUSDT', side: 'buy', quantity: '1' })).status, 400);
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0' })).status, 400);
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0.000000001' })).status, 400);
    const initialBtcBuy = await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0.01' });
    assert.equal(initialBtcBuy.status, 201, await initialBtcBuy.text());
    const afterBuy = await paperPortfolio();
    const afterBuyState = await afterBuy.json();
    assert.equal(afterBuyState.cashBalance, '9397');
    assert.deepEqual(afterBuyState.positions, [{ asset: 'BTC', quantity: '0.01', averagePrice: '60000' }]);
    assert.equal(afterBuyState.trades.length, 1);
    assert.equal(afterBuyState.trades[0].notional, '600');
    assert.equal(afterBuyState.trades[0].fee, '3');
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'sell', quantity: '0.02' })).status, 409);
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0.2' })).status, 409);
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'buy', quantity: '0.00001' })).status, 400);
    assert.equal((await createPaperOrder({ symbol: 'BTCUSDT', side: 'sell', quantity: '0.004' })).status, 201);
    const afterSell = await (await paperPortfolio()).json();
    assert.equal(afterSell.cashBalance, '9635.8');
    assert.deepEqual(afterSell.positions, [{ asset: 'BTC', quantity: '0.006', averagePrice: '60000' }]);
    assert.equal(
        afterSell.trades.find((trade) => trade.symbol === 'BTCUSDT' && trade.side === 'sell').fee,
        '1.2'
    );
    const stkaiBuy = await createPaperOrder({ symbol: 'STKAIUSDT', side: 'buy', quantity: '5' });
    assert.equal(stkaiBuy.status, 201);
    const afterStkaiBuy = await (await paperPortfolio()).json();
    assert.equal(afterStkaiBuy.cashBalance, '9630.775');
    assert.ok(afterStkaiBuy.positions.some((position) =>
        position.asset === 'STKAI' && position.quantity === '5' && position.averagePrice === '1'
    ));
    const stkaiSell = await createPaperOrder({ symbol: 'STKAIUSDT', side: 'sell', quantity: '2' });
    assert.equal(stkaiSell.status, 201);
    const afterStkaiSell = await (await paperPortfolio()).json();
    assert.equal(afterStkaiSell.cashBalance, '9632.765');
    assert.ok(afterStkaiSell.positions.some((position) =>
        position.asset === 'STKAI' && position.quantity === '3' && position.averagePrice === '1'
    ));
    const stkaiTrade = afterStkaiSell.trades.find((trade) => trade.symbol === 'STKAIUSDT' && trade.side === 'sell');
    assert.equal(stkaiTrade.price, '1');
    assert.equal((await createPaperOrder({ symbol: 'STKAIUSDT', side: 'sell', quantity: '4' })).status, 409);
    const btcPaidStkaiPurchase = await createPaperOrder({
        symbol: 'STKAIUSDT',
        side: 'buy',
        quantity: '100',
        quoteAsset: 'BTC'
    });
    assert.equal(btcPaidStkaiPurchase.status, 201);
    const btcPaidTrade = (await btcPaidStkaiPurchase.json()).trade;
    assert.deepEqual({
        symbol: btcPaidTrade.symbol,
        quoteAsset: btcPaidTrade.quoteAsset,
        quantity: btcPaidTrade.quantity,
        quoteAmount: btcPaidTrade.quoteAmount
    }, {
        symbol: 'STKAIBTC',
        quoteAsset: 'BTC',
        quantity: '100',
        quoteAmount: '0.00167501'
    });
    const afterBtcPaidStkai = await (await paperPortfolio()).json();
    assert.equal(afterBtcPaidStkai.cashBalance, afterStkaiSell.cashBalance);
    assert.ok(afterBtcPaidStkai.positions.some((position) =>
        position.asset === 'STKAI' && position.quantity === '103'
    ));
    assert.ok(afterBtcPaidStkai.positions.some((position) =>
        position.asset === 'BTC' && position.quantity === '0.00432499'
    ));
    const treasuryAfterTrades = await (await fetch(`${origin}/api/admin/treasury`, {
        headers: cookieHeaders(adminToken)
    })).json();
    assert.deepEqual(treasuryAfterTrades.balances, [
        { asset: 'USDT', balance: '363' },
        { asset: 'BTC', balance: '0.99566667' },
        { asset: 'ETH', balance: '1' },
        { asset: 'BNB', balance: '1' },
        { asset: 'STKAI', balance: '20999897' }
    ]);
    const ethPurchase = await createPaperOrder({ symbol: 'ETHUSDT', side: 'buy', quantity: '0.1' });
    assert.equal(ethPurchase.status, 201);
    const bnbPurchase = await createPaperOrder({ symbol: 'BNBUSDT', side: 'buy', quantity: '0.1' });
    assert.equal(bnbPurchase.status, 201);
    const ethPaidStkaiPurchase = await createPaperOrder({
        symbol: 'STKAIUSDT',
        side: 'buy',
        quantity: '10',
        quoteAsset: 'ETH'
    });
    assert.equal(ethPaidStkaiPurchase.status, 201);
    assert.equal((await ethPaidStkaiPurchase.json()).trade.quoteAmount, '0.00335');
    const bnbPaidStkaiPurchase = await createPaperOrder({
        symbol: 'STKAIUSDT',
        side: 'buy',
        quantity: '10',
        quoteAsset: 'BNB'
    });
    assert.equal(bnbPaidStkaiPurchase.status, 201);
    assert.equal((await bnbPaidStkaiPurchase.json()).trade.quoteAmount, '0.01675001');
    const allTreasuryBalances = await (await fetch(`${origin}/api/admin/treasury`, {
        headers: cookieHeaders(adminToken)
    })).json();
    assert.deepEqual(allTreasuryBalances.balances, [
        { asset: 'USDT', balance: '723' },
        { asset: 'BTC', balance: '0.99566667' },
        { asset: 'ETH', balance: '0.90333333' },
        { asset: 'BNB', balance: '0.91666667' },
        { asset: 'STKAI', balance: '20999877' }
    ]);
    const paperFeesAfterTrades = await (await fetch(`${origin}/api/admin/paper-fees`, {
        headers: cookieHeaders(adminToken)
    })).json();
    assert.equal(paperFeesAfterTrades.feeRate, '0.5%');
    assert.deepEqual(paperFeesAfterTrades.balances, [
        { asset: 'USDT', balance: '6.035' },
        { asset: 'BTC', balance: '0.00000834' },
        { asset: 'ETH', balance: '0.00001667' },
        { asset: 'BNB', balance: '0.00008334' }
    ]);
    assert.equal(paperFeesAfterTrades.movements.length, 9);
    assert.deepEqual(
        {
            asset: paperFeesAfterTrades.movements[0].asset,
            amount: paperFeesAfterTrades.movements[0].amount,
            side: paperFeesAfterTrades.movements[0].side,
            symbol: paperFeesAfterTrades.movements[0].symbol
        },
        { asset: 'BNB', amount: '0.00008334', side: 'buy', symbol: 'STKAIBNB' }
    );
    assert.equal((await createPaperStake({ asset: 'USDT', amount: '1', offerId: 0 }, memberToken)).status, 401);
    assert.equal((await createPaperStake(
        { asset: 'USDT', amount: '1', offerId: 0 },
        balancesMemberToken,
        'https://attacker.test'
    )).status, 403);
    assert.equal((await createPaperStake({ asset: 'DOGE', amount: '1', offerId: 0 })).status, 400);
    assert.equal((await createPaperStake({ asset: 'USDT', amount: '1', offerId: 9 })).status, 400);
    assert.equal((await createPaperStake({ asset: 'USDT', amount: '0.00000001', offerId: 0 })).status, 400);
    assert.equal((await createPaperStake({ asset: 'USDT', amount: '999999', offerId: 0 })).status, 409);
    const stateBeforePaperStakes = await (await paperPortfolio()).json();
    const virtualStakes = [];
    for (const [asset, amount, offerId, reward] of [
        ['USDT', '10', 0, '0.5'],
        ['BTC', '0.001', 1, '0.00025'],
        ['ETH', '0.01', 2, '0.02'],
        ['BNB', '0.01', 0, '0.0005'],
        ['STKAI', '10', 0, '0.5']
    ]) {
        const response = await createPaperStake({ asset, amount, offerId });
        assert.equal(response.status, 201);
        const result = await response.json();
        assert.equal(result.asset, asset);
        assert.equal(result.amount, amount);
        assert.equal(result.reward, reward);
        assert.equal(result.portfolio.stakes[0].offerId, offerId);
        virtualStakes.push(result.stakeId);
    }
    const stakedPaperPortfolio = await (await paperPortfolio()).json();
    assert.equal(stakedPaperPortfolio.stakes.length, 5);
    assert.equal(
        stakedPaperPortfolio.cashBalance,
        (Number(stateBeforePaperStakes.cashBalance) - 10).toString()
    );
    assert.equal(
        stakedPaperPortfolio.positions.find((position) => position.asset === 'BTC').quantity,
        '0.00332499'
    );
    assert.equal((await claimPaperStake(virtualStakes[0])).status, 409);
    assert.equal((await claimPaperStake(virtualStakes[0], recipientToken)).status, 404);
    const stakeDb = new DatabaseSync(databasePath);
    stakeDb.prepare(`
        UPDATE paper_stakes SET unlock_at = 0
        WHERE user_id = ? AND status = 'active'
    `).run(memberId);
    stakeDb.close();
    for (const stakeId of virtualStakes) {
        const response = await claimPaperStake(stakeId);
        assert.equal(response.status, 200);
        const result = await response.json();
        assert.equal(result.portfolio.stakes.find((stake) => stake.id === stakeId).status, 'claimed');
    }
    const claimedPaperPortfolio = await (await paperPortfolio()).json();
    assert.equal(claimedPaperPortfolio.cashBalance, (Number(stateBeforePaperStakes.cashBalance) + 0.5).toString());
    assert.equal(
        claimedPaperPortfolio.positions.find((position) => position.asset === 'BTC').quantity,
        '0.00457499'
    );
    assert.equal(
        claimedPaperPortfolio.positions.find((position) => position.asset === 'ETH').quantity,
        '0.11665'
    );
    assert.equal(
        claimedPaperPortfolio.positions.find((position) => position.asset === 'BNB').quantity,
        '0.08374999'
    );
    assert.equal(
        claimedPaperPortfolio.positions.find((position) => position.asset === 'STKAI').quantity,
        '123.5'
    );
    assert.equal((await claimPaperStake(virtualStakes[0])).status, 409);
    const recipientReferralResponse = await fetch(`${origin}/api/referrals/summary`, {
        headers: cookieHeaders(recipientToken)
    });
    const recipientReferral = await recipientReferralResponse.json();
    const createPaperAssetTransfer = (payload, token = balancesMemberToken, requestOrigin = origin) => fetch(
        `${origin}/api/account/transfers`,
        {
            method: 'POST',
            headers: {
                ...cookieHeaders(token),
                origin: requestOrigin,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );
    assert.equal((await createPaperAssetTransfer({
        recipientInfo: recipientReferral.referralCode,
        asset: 'BTC',
        amount: '0.002'
    })).status, 201);
    assert.equal((await createPaperAssetTransfer({
        recipientInfo: recipientReferral.referralCode,
        asset: 'ETH',
        amount: '0.2'
    })).status, 400);
    const paperTransfersResponse = await fetch(`${origin}/api/admin/transfers`, {
        headers: cookieHeaders(adminToken)
    });
    const paperTransfers = await paperTransfersResponse.json();
    const paperBtcTransfer = paperTransfers.transfers.find((transfer) => transfer.asset === 'BTC');
    assert.equal(paperBtcTransfer.amount, '0.002');
    assert.equal((await decideTransfer(paperBtcTransfer.id, 'approve')).status, 200);
    const senderPaperWallet = await (await paperPortfolio()).json();
    const recipientPaperWallet = await (await paperPortfolio(recipientToken)).json();
    assert.equal(senderPaperWallet.positions.find((position) => position.asset === 'BTC').quantity, '0.00257499');
    assert.equal(recipientPaperWallet.positions.find((position) => position.asset === 'BTC').quantity, '0.002');
    const rejectedPaperTransferResponse = await createPaperAssetTransfer({
        recipientInfo: recipientReferral.referralCode,
        asset: 'BTC',
        amount: '0.001'
    });
    const rejectedPaperTransfer = await rejectedPaperTransferResponse.json();
    assert.equal(rejectedPaperTransferResponse.status, 201);
    assert.equal((await decideTransfer(rejectedPaperTransfer.id, 'reject')).status, 200);
    const senderAfterRejectedPaperTransfer = await (await paperPortfolio()).json();
    assert.equal(
        senderAfterRejectedPaperTransfer.positions.find((position) => position.asset === 'BTC').quantity,
        '0.00257499'
    );
    const paperTransferHistory = await fetch(`${origin}/api/account/transfers`, {
        headers: cookieHeaders(balancesMemberToken)
    });
    const paperTransferRecords = (await paperTransferHistory.json()).transfers;
    assert.ok(paperTransferRecords.some((transfer) =>
        transfer.asset === 'BTC' && transfer.status === 'approved' && transfer.amount === '0.002'
    ));
    assert.ok(paperTransferRecords.some((transfer) =>
        transfer.asset === 'BTC' && transfer.status === 'rejected' && transfer.amount === '0.001'
    ));
    const separatePaperAccount = await paperPortfolio(recipientToken);
    assert.equal((await separatePaperAccount.json()).cashBalance, '10000');

    const setupTwoFactor = await fetch(`${origin}/api/account/2fa/setup`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ password: memberPassword })
    });
    assert.equal(setupTwoFactor.status, 200);
    const twoFactorSetup = await setupTwoFactor.json();
    assert.match(twoFactorSetup.secret, /^[A-Z2-7]{32}$/);
    assert.match(twoFactorSetup.otpauthUrl, /^otpauth:\/\/totp\//);
    const enableTwoFactor = await fetch(`${origin}/api/account/2fa/enable`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            password: memberPassword,
            code: totpCode(twoFactorSetup.secret)
        })
    });
    assert.equal(enableTwoFactor.status, 200);
    const enabledTwoFactor = await enableTwoFactor.json();
    assert.equal(enabledTwoFactor.enabled, true);
    assert.equal(enabledTwoFactor.recoveryCodes.length, 10);

    const secondFactorLogin = await fetch(`${origin}/api/auth/login`, {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'member@example.test', password: memberPassword })
    });
    assert.equal(secondFactorLogin.status, 200);
    assert.deepEqual(await secondFactorLogin.json(), {
        authenticated: false,
        twoFactorRequired: true
    });
    const challengeCookie = secondFactorLogin.headers.get('set-cookie')
        .match(/stakeai_2fa_challenge=([^;]+)/)?.[1];
    assert.ok(challengeCookie);
    const completeSecondFactorLogin = await fetch(`${origin}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: {
            cookie: `stakeai_2fa_challenge=${challengeCookie}`,
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ code: enabledTwoFactor.recoveryCodes[0] })
    });
    assert.equal(completeSecondFactorLogin.status, 200);
    assert.equal((await completeSecondFactorLogin.json()).authenticated, true);

    const otherMemberToken = 'member-other-session-token';
    const otherSessionDb = new DatabaseSync(databasePath);
    addSession(otherSessionDb, otherMemberToken, memberId);
    otherSessionDb.close();
    const changePassword = await fetch(`${origin}/api/account/change-password`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: memberPassword,
            newPassword: 'new-correct-horse-battery',
            twoFactorCode: enabledTwoFactor.recoveryCodes[1]
        })
    });
    assert.equal(changePassword.status, 200);
    assert.equal((await changePassword.json()).passwordChanged, true);
    assert.equal((await fetch(`${origin}/api/auth/session`, {
        headers: cookieHeaders(otherMemberToken)
    })).status, 401);
    assert.equal((await fetch(`${origin}/api/auth/login`, {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'member@example.test', password: memberPassword })
    })).status, 401);
    const updatedPasswordLogin = await fetch(`${origin}/api/auth/login`, {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'member@example.test', password: 'new-correct-horse-battery' })
    });
    assert.equal((await updatedPasswordLogin.json()).twoFactorRequired, true);

    const disableTwoFactor = await fetch(`${origin}/api/account/2fa/disable`, {
        method: 'POST',
        headers: {
            ...cookieHeaders(balancesMemberToken),
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            password: 'new-correct-horse-battery',
            code: enabledTwoFactor.recoveryCodes[2]
        })
    });
    assert.equal(disableTwoFactor.status, 200);
    assert.equal((await disableTwoFactor.json()).enabled, false);
    assert.equal((await fetch(`${origin}/api/account/summary`, {
        headers: cookieHeaders(balancesMemberToken)
    })).status, 200);
    const emailChangeToken = 'verified-email-change-test-token';
    const emailChangeDb = new DatabaseSync(databasePath);
    emailChangeDb.prepare(`
        INSERT INTO email_change_verifications (token_hash, user_id, new_email, expires_at)
        VALUES (?, ?, ?, ?)
    `).run(
        createHmac('sha256', sessionSecret).update(emailChangeToken).digest('hex'),
        memberId,
        'updated-member@example.test',
        Date.now() + 60_000
    );
    emailChangeDb.close();
    const confirmEmailChange = await fetch(`${origin}/api/account/verify-email-change`, {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ token: emailChangeToken })
    });
    assert.equal(confirmEmailChange.status, 200);
    assert.deepEqual(await confirmEmailChange.json(), {
        emailUpdated: true,
        authenticated: false
    });
    assert.equal((await fetch(`${origin}/api/auth/session`, {
        headers: cookieHeaders(balancesMemberToken)
    })).status, 401);

    const finalDb = new DatabaseSync(databasePath);
    assert.equal(finalDb.prepare('SELECT COUNT(*) AS count FROM admin_audit_log').get().count, 2);
    const balanceAudit = finalDb.prepare(`
        SELECT asset, previous_balance, new_balance
        FROM balance_audit_log
        WHERE target_user_id = ?
        ORDER BY asset
    `).all(memberId).map(({ asset, previous_balance, new_balance }) => ({
        asset,
        previous_balance,
        new_balance
    }));
    assert.deepEqual(balanceAudit, [
        { asset: 'STAKEAI', previous_balance: '0', new_balance: '1123456789012345678' },
        { asset: 'STAKEAI', previous_balance: '1123456789012345678', new_balance: '1000000000000000000' },
        { asset: 'USDT', previous_balance: '0', new_balance: '123456789' },
        { asset: 'USDT', previous_balance: '123456789', new_balance: '98333333' },
        { asset: 'USDT', previous_balance: '98333333', new_balance: '10000000' },
        { asset: 'USDT', previous_balance: '10000000', new_balance: '20000000' },
        { asset: 'USDT', previous_balance: '20000000', new_balance: '30000000' },
        { asset: 'USDT', previous_balance: '30000000', new_balance: '40000000' }
    ]);
    assert.equal(finalDb.prepare('SELECT status FROM user_transfers WHERE id = ?').get(createdTransfer.id).status, 'approved');
    assert.equal(finalDb.prepare('SELECT status FROM user_transfers WHERE id = ?').get(rejectedTransfer.id).status, 'rejected');
    assert.equal(finalDb.prepare('SELECT status FROM user_transfers WHERE id = ?').get(pendingBeforeBalanceChange.id).status, 'pending');
    assert.equal(finalDb.prepare('SELECT status FROM user_transfers WHERE id = ?').get(stakeaiTransfer.id).status, 'approved');
    assert.equal(finalDb.prepare('SELECT COUNT(*) AS count FROM task_submissions WHERE status = ?').get('approved').count, 3);
    assert.equal(finalDb.prepare('SELECT status FROM task_submissions WHERE id = ?').get(facebookSubmission.id).status, 'approved');
    assert.equal(finalDb.prepare('SELECT disabled_at FROM users WHERE id = ?').get(memberId).disabled_at, null);
    assert.equal(finalDb.prepare('SELECT email FROM users WHERE id = ?').get(memberId).email, 'updated-member@example.test');
    finalDb.close();
});
