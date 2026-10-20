const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { mkdtempSync, rmSync } = require('node:fs');
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

test('local assistant test mode replies for all three assistants without calling OpenAI', async (context) => {
    const directory = mkdtempSync(path.join(tmpdir(), 'stakeai-assistant-demo-'));
    const port = await unusedPort();
    const origin = `http://127.0.0.1:${port}`;
    const server = spawn(process.execPath, ['server.mjs'], {
        cwd: root,
        env: {
            ...process.env,
            NODE_ENV: 'development',
            SESSION_SECRET: 'assistant-demo-test-session-secret-32',
            PUBLIC_ORIGIN: origin,
            PORT: String(port),
            DATABASE_PATH: path.join(directory, 'assistant-demo-test.sqlite'),
            ASSISTANT_PROVIDER: 'library',
            OPENAI_API_KEY: 'test-key-not-for-use',
            ASSISTANT_TEST_MODE: 'true'
        },
        stdio: 'ignore'
    });
    context.after(async () => {
        if (server.exitCode === null) {
            server.kill('SIGTERM');
            await Promise.race([
                once(server, 'exit'),
                new Promise((resolve) => setTimeout(resolve, 1000))
            ]);
        }
        rmSync(directory, { recursive: true, force: true });
    });

    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
        if (server.exitCode !== null) throw new Error(`Test API exited with code ${server.exitCode}.`);
        try {
            const response = await fetch(`${origin}/api/assistants/status`);
            if (response.ok) {
                ready = true;
                break;
            }
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    assert.equal(ready, true, 'test API should start');

    const status = await (await fetch(`${origin}/api/assistants/status`)).json();
    assert.deepEqual(status, { mode: 'demo', configured: false });

    const ask = async (assistant, content) => {
        const response = await fetch(`${origin}/api/assistants/chat`, {
            method: 'POST',
            headers: {
                origin,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                assistant,
                messages: [{ role: 'user', content }]
            })
        });
        assert.equal(response.status, 200);
        const result = await response.json();
        assert.equal(result.mode, 'demo');
        assert.equal(result.assistant, assistant);
        assert.ok(result.reply.length > 20);
        return result.reply;
    };

    const identityReply = await ask('companion', 'Sen nasıl oluştun?');
    assert.match(identityReply, /yerel bilgi kütüphanesi/);
    assert.match(identityReply, /yerel bilgi kütüphanesi/);

    const codeReply = await ask('code', 'Bu kodumdaki hatayı bulur musun?');
    assert.match(codeReply, /kodunuzu inceleyip çalıştıramaz/);
    assert.match(codeReply, /API anahtarı/);

    const strategyReply = await ask('strategy', 'DCA nasıl çalışır?');
    assert.match(strategyReply, /belirli aralıklarla sabit tutarda alım/);
    assert.match(strategyReply, /yatırım tavsiyesi değildir/);

    const virtualStakingReply = await ask('strategy', 'Sanal stake hangi coinlerde ve oranlar nedir?');
    assert.match(virtualStakingReply, /STKAI, USDT, BTC, ETH ve BNB/);
    assert.match(virtualStakingReply, /7 gün %5, 30 gün %25 ve 180 gün %200/);
    assert.match(virtualStakingReply, /Gerçek token, cüzdan veya blokzincir kullanılmaz/);

    const testnetStakingReply = await ask('strategy', 'Gerçek stake hangi ağda?');
    assert.match(testnetStakingReply, /yalnızca STKAI kabul eder/);
    assert.match(testnetStakingReply, /BNB Smart Chain testnet/);

    const feeReply = await ask('companion', 'Sanal al-sat komisyon oranları nedir?');
    assert.match(feeReply, /%0,5 simülasyon hizmet komisyonu/);
    assert.match(feeReply, /blokzincir gas ücreti değildir/);

    const supplyReply = await ask('strategy', 'STAKEAI token arzı kaç?');
    assert.match(supplyReply, /21\.000\.000 STKAI/);
    assert.match(supplyReply, /geri alım vaadi değildir/);

    const greetingReply = await ask('companion', 'Merhaba');
    assert.match(greetingReply, /ne öğrenmek istersiniz/);

    const siteReply = await ask('companion', 'STAKEAI sitesi nedir?');
    assert.match(siteReply, /üç asistanı/);
    assert.match(siteReply, /işlem gerçekleştirmez/);

    const aiReply = await ask('companion', 'Bu ChatGPT mi?');
    assert.match(aiReply, /OpenAI veya ChatGPT kullanmaz/);

    const unknownReply = await ask('companion', 'Mars uydularının isimleri neler?');
    assert.match(unknownReply, /bilgi kütüphanesinde henüz yok/);

    const englishReply = await ask('companion', 'Hello');
    assert.match(englishReply, /What would you like to know/);
});
