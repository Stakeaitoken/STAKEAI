const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');
const { once } = require('node:events');
const net = require('node:net');
const path = require('node:path');
const { mkdtempSync, rmSync } = require('node:fs');
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

test('local admin bootstrap creates a verified, authenticated one-time admin account', async (context) => {
    const directory = mkdtempSync(path.join(tmpdir(), 'stakeai-admin-bootstrap-'));
    const databasePath = path.join(directory, 'bootstrap.sqlite');
    const port = await unusedPort();
    const origin = `http://127.0.0.1:${port}`;
    const server = spawn(process.execPath, ['server.mjs'], {
        cwd: root,
        env: {
            ...process.env,
            SESSION_SECRET: 'admin-bootstrap-test-session-secret-32-chars',
            PUBLIC_ORIGIN: origin,
            PORT: String(port),
            DATABASE_PATH: databasePath,
            ADMIN_EMAILS: 'bootstrap@example.test',
            ASSISTANT_PROVIDER: 'library',
            ASSISTANT_TEST_MODE: 'true'
        },
        stdio: 'ignore'
    });
    context.after(async () => {
        if (server.exitCode === null) {
            server.kill('SIGKILL');
            server.unref();
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        rmSync(directory, { recursive: true, force: true });
    });

    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
        if (server.exitCode !== null) throw new Error(`Test API exited with code ${server.exitCode}.`);
        try {
            const response = await fetch(`${origin}/api/admin/bootstrap`);
            if (response.status === 200) {
                ready = true;
                break;
            }
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    assert.equal(ready, true, 'local setup endpoint should start');

    const setupPage = await fetch(`${origin}/admin-setup.html`);
    assert.equal(setupPage.status, 200);
    assert.match(await setupPage.text(), /Yönetici hesabını oluştur/);

    const setupState = await (await fetch(`${origin}/api/admin/bootstrap`)).json();
    assert.deepEqual(setupState, { available: true, email: 'bootstrap@example.test' });

    const submitSetup = (body, requestOrigin = origin) => fetch(`${origin}/api/admin/bootstrap`, {
        method: 'POST',
        headers: { origin: requestOrigin, 'content-type': 'application/json' },
        body: JSON.stringify(body)
    });
    assert.equal((await submitSetup({ password: 'short', confirmation: 'short' })).status, 400);
    assert.equal((await submitSetup({
        password: 'long-enough-bootstrap-password',
        confirmation: 'different-password'
    })).status, 400);
    assert.equal((await submitSetup({
        password: 'long-enough-bootstrap-password',
        confirmation: 'long-enough-bootstrap-password'
    }, 'https://attacker.test')).status, 403);

    const password = 'long-enough-bootstrap-password';
    const created = await submitSetup({ password, confirmation: password });
    assert.equal(created.status, 201);
    assert.deepEqual(await created.json(), { created: true });
    const sessionCookie = created.headers.get('set-cookie')?.match(/stakeai_session=([^;]+)/)?.[1];
    assert.ok(sessionCookie, 'bootstrap should start an authenticated session');

    const sessionResponse = await fetch(`${origin}/api/auth/session`, {
        headers: { cookie: `stakeai_session=${sessionCookie}` }
    });
    assert.deepEqual(await sessionResponse.json(), {
        authenticated: true,
        email: 'bootstrap@example.test',
        username: 'Admin',
        avatar: '',
        isAdmin: true
    });

    const database = new DatabaseSync(databasePath, { readOnly: true });
    const createdUser = database.prepare(`
        SELECT email, email_verified, password_hash
        FROM users WHERE email = ?
    `).get('bootstrap@example.test');
    assert.equal(createdUser.email_verified, 1);
    assert.match(createdUser.password_hash, /^scrypt\$16384\$8\$1\$/);
    assert.equal(createdUser.password_hash.includes(password), false);
    database.close();

    const secondAttempt = await submitSetup({ password, confirmation: password });
    assert.equal(secondAttempt.status, 409);
    assert.equal((await fetch(`${origin}/api/admin/bootstrap`)).status, 409);
});
