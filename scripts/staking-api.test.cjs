const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { mkdtempSync, rmSync } = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { tmpdir } = require('node:os');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

async function unusedPort() {
    const listener = net.createServer();
    listener.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    const { port } = listener.address();
    await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
    return port;
}

test('staking config is exposed without secrets and the browser ethers bundle is served locally', async (context) => {
    const directory = mkdtempSync(path.join(tmpdir(), 'stakeai-staking-api-'));
    const port = await unusedPort();
    const marketPort = await unusedPort();
    const baseUrl = `http://127.0.0.1:${port}`;
    const marketProvider = http.createServer((request, response) => {
        response.setHeader('Content-Type', 'application/json');
        if (request.url.startsWith('/api/v3/ticker/24hr')) {
            response.end(JSON.stringify([
                { symbol: 'BTCUSDT', lastPrice: '50000', highPrice: '51000', lowPrice: '49000', priceChangePercent: '2', quoteVolume: '1000000' },
                { symbol: 'ETHUSDT', lastPrice: '2500', highPrice: '2600', lowPrice: '2400', priceChangePercent: '1', quoteVolume: '500000' },
                { symbol: 'BNBUSDT', lastPrice: '600', highPrice: '610', lowPrice: '590', priceChangePercent: '-1', quoteVolume: '100000' }
            ]));
            return;
        }
        response.end(JSON.stringify(Array.from({ length: 48 }, (_, index) => [
            0, 0, 0, 0, '100', 0, Date.now() + index
        ])));
    });
    marketProvider.listen(marketPort, '127.0.0.1');
    await once(marketProvider, 'listening');
    const child = spawn(process.execPath, ['server.mjs'], {
        cwd: root,
        env: {
            ...process.env,
            PORT: String(port),
            PUBLIC_ORIGIN: baseUrl,
            DATABASE_PATH: path.join(directory, 'test.sqlite'),
            SESSION_SECRET: 'staking-api-test-session-secret-32-chars',
            ASSISTANT_TEST_MODE: 'true',
            MARKET_DATA_BASE_URL: `http://127.0.0.1:${marketPort}`,
            STAKEAI_TOKEN_ADDRESS: '0x0000000000000000000000000000000000000001',
            STAKING_CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000002'
        },
        stdio: 'ignore'
    });
    context.after(async () => {
        child.kill();
        await once(child, 'exit').catch(() => {});
        await new Promise((resolve, reject) => marketProvider.close((error) => error ? reject(error) : resolve()));
        rmSync(directory, { recursive: true, force: true });
    });

    let configResponse;
    for (let attempt = 0; attempt < 100; attempt += 1) {
        try {
            configResponse = await fetch(`${baseUrl}/api/staking/config`);
            break;
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    assert.ok(configResponse, 'server did not start');
    assert.equal(configResponse.status, 200);
    assert.deepEqual(await configResponse.json(), {
        enabled: true,
        chainId: 97,
        tokenAddress: '0x0000000000000000000000000000000000000001',
        stakingAddress: '0x0000000000000000000000000000000000000002'
    });

    const marketResponse = await fetch(`${baseUrl}/api/market/summary`);
    assert.equal(marketResponse.status, 200);
    const marketSummary = await marketResponse.json();
    assert.equal(marketSummary.marketDataUnavailable, false);
    assert.deepEqual(marketSummary.markets.map((market) => market.asset), ['BTC', 'ETH', 'BNB', 'STKAI']);
    const stkaiMarket = marketSummary.markets.find((market) => market.asset === 'STKAI');
    assert.equal(stkaiMarket.symbol, 'STKAIUSDT');
    assert.equal(stkaiMarket.price, '1');
    assert.equal(stkaiMarket.priceType, 'fixed-reference');
    assert.equal(stkaiMarket.changePercent, null);
    assert.equal(stkaiMarket.high, '1');
    assert.equal(stkaiMarket.low, '1');
    assert.equal(Object.hasOwn(stkaiMarket, 'priceBaseUnits'), false);

    const payoutListResponse = await fetch(`${baseUrl}/api/admin/staking-reward-payouts`);
    assert.equal(payoutListResponse.status, 401);
    const preparePayoutResponse = await fetch(`${baseUrl}/api/admin/staking-reward-payouts/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: baseUrl },
        body: JSON.stringify({
            adminWallet: '0x0000000000000000000000000000000000000001',
            recipientWallet: '0x0000000000000000000000000000000000000002',
            positionId: '0'
        })
    });
    assert.equal(preparePayoutResponse.status, 401);

    const bundleResponse = await fetch(`${baseUrl}/vendor/ethers.umd.min.js`);
    assert.equal(bundleResponse.status, 200);
    assert.match(bundleResponse.headers.get('content-type'), /javascript/);
    assert.match(await bundleResponse.text(), /ethers/i);
});
