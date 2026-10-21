// Usage: node scripts/x-post.mjs "post text"
// Posts to X using OAuth 1.0a user-context credentials stored in .env.
import { readFileSync } from 'node:fs';
import { createHmac, randomBytes } from 'node:crypto';
import path from 'node:path';

try {
    for (const line of readFileSync(path.join(process.cwd(), '.env'), 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
} catch {
    // .env is optional when variables are already set
}

const { X_API_KEY, X_API_SECRET, X_OAUTH1_ACCESS_TOKEN, X_OAUTH1_ACCESS_SECRET } = process.env;
const text = process.argv[2];
if (!X_API_KEY || !X_API_SECRET || !X_OAUTH1_ACCESS_TOKEN || !X_OAUTH1_ACCESS_SECRET || !text) {
    console.error('Set X_API_KEY, X_API_SECRET, X_OAUTH1_ACCESS_TOKEN and X_OAUTH1_ACCESS_SECRET, and pass the post text.');
    process.exit(1);
}

const encode = (value) => encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
const url = 'https://api.twitter.com/2/tweets';
const oauth = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: X_OAUTH1_ACCESS_TOKEN,
    oauth_version: '1.0'
};
const parameterString = Object.keys(oauth).sort().map((key) => `${encode(key)}=${encode(oauth[key])}`).join('&');
const baseString = ['POST', encode(url), encode(parameterString)].join('&');
oauth.oauth_signature = createHmac('sha1', `${encode(X_API_SECRET)}&${encode(X_OAUTH1_ACCESS_SECRET)}`).update(baseString).digest('base64');
const authorization = `OAuth ${Object.keys(oauth).sort().map((key) => `${encode(key)}="${encode(oauth[key])}"`).join(', ')}`;

const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: authorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
});
const result = await response.json();
if (!response.ok) {
    console.error('X error:', response.status, result.detail || result.title || JSON.stringify(result));
    process.exitCode = 1;
} else {
    console.log(`Posted: https://x.com/stakeeai/status/${result.data.id}`);
}
