const assert = require('node:assert/strict');
const { createServer } = require('node:http');
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

test('Ollama provider sends assistant prompts to the configured local model', async (context) => {
    const directory = mkdtempSync(path.join(tmpdir(), 'stakeai-assistant-ollama-'));
    const providerPort = await unusedPort();
    const appPort = await unusedPort();
    const origin = `http://127.0.0.1:${appPort}`;
    let receivedRequest;
    const provider = createServer((request, response) => {
        const chunks = [];
        request.on('data', (chunk) => chunks.push(chunk));
        request.on('end', () => {
            receivedRequest = {
                url: request.url,
                body: JSON.parse(Buffer.concat(chunks).toString('utf8'))
            };
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify({
                model: 'qwen3:1.7b',
                message: { role: 'assistant', content: 'Merhaba! Ben yerel modelim.' },
                done: true
            }));
        });
    });
    provider.listen(providerPort, '127.0.0.1');
    await once(provider, 'listening');

    const server = spawn(process.execPath, ['server.mjs'], {
        cwd: root,
        env: {
            ...process.env,
            NODE_ENV: 'development',
            SESSION_SECRET: 'assistant-ollama-test-session-secret-32',
            PUBLIC_ORIGIN: origin,
            PORT: String(appPort),
            DATABASE_PATH: path.join(directory, 'assistant-ollama-test.sqlite'),
            ASSISTANT_PROVIDER: 'ollama',
            ASSISTANT_TEST_MODE: 'false',
            OPENAI_API_KEY: '',
            OLLAMA_BASE_URL: `http://127.0.0.1:${providerPort}`,
            OLLAMA_MODEL: 'qwen3:1.7b'
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
        await new Promise((resolve, reject) => provider.close((error) => error ? reject(error) : resolve()));
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
    assert.deepEqual(await (await fetch(`${origin}/api/assistants/status`)).json(), {
        mode: 'ollama',
        configured: true
    });

    const greetingResponse = await fetch(`${origin}/api/assistants/chat`, {
        method: 'POST',
        headers: {
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            assistant: 'companion',
            messages: [{ role: 'user', content: 'Merhaba' }]
        })
    });
    assert.equal(greetingResponse.status, 200);
    const greeting = await greetingResponse.json();
    assert.equal(greeting.mode, 'ollama');
    assert.equal(greeting.source, 'knowledge');
    assert.match(greeting.reply, /ne öğrenmek istersiniz/);
    assert.equal(receivedRequest, undefined, 'known FAQ greetings should bypass model generation');

    const response = await fetch(`${origin}/api/assistants/chat`, {
        method: 'POST',
        headers: {
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            assistant: 'companion',
            messages: [{ role: 'user', content: 'Write a short haiku about rain.' }]
        })
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
        assistant: 'companion',
        mode: 'ollama',
        reply: 'Merhaba! Ben yerel modelim.'
    });
    assert.equal(receivedRequest.url, '/api/chat');
    assert.equal(receivedRequest.body.model, 'qwen3:1.7b');
    assert.equal(receivedRequest.body.stream, false);
    assert.equal(receivedRequest.body.think, false);
    assert.equal(receivedRequest.body.keep_alive, '30m');
    assert.equal(receivedRequest.body.options.num_predict, 250);
    assert.equal(receivedRequest.body.messages[0].role, 'system');
    assert.match(receivedRequest.body.messages[0].content, /do not claim a particular model provider/);
    assert.match(receivedRequest.body.messages[0].content, /paper-trading balances, orders, and multi-asset staking are simulated/);
    assert.match(receivedRequest.body.messages[0].content, /Provider and privacy behavior depend on server configuration/);
    assert.deepEqual(receivedRequest.body.messages.at(-1), { role: 'user', content: 'Write a short haiku about rain.' });

    const strategyResponse = await fetch(`${origin}/api/assistants/chat`, {
        method: 'POST',
        headers: {
            origin,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            assistant: 'strategy',
            messages: [{ role: 'user', content: 'Explain liquidity pools in two sentences.' }]
        })
    });
    assert.equal(strategyResponse.status, 200);
    assert.match(receivedRequest.body.messages[0].content, /0\.5% commission/);
    assert.match(receivedRequest.body.messages[0].content, /BNB Smart Chain testnet staking contract accepts STKAI only/);
});
