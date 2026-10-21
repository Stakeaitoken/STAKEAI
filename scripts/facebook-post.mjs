// Usage: node scripts/facebook-post.mjs "message text" [path/to/image.png]
import { readFileSync } from 'node:fs';
import path from 'node:path';

try {
    for (const line of readFileSync(path.join(process.cwd(), '.env'), 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
} catch {
    // .env is optional when variables are already set
}

const pageId = process.env.FB_PAGE_ID;
const pageToken = process.env.FB_PAGE_TOKEN;
const [message, imagePath] = process.argv.slice(2);
if (!pageId || !pageToken || !message) {
    console.error('Set FB_PAGE_ID and FB_PAGE_TOKEN, and pass the message text as the first argument.');
    process.exit(1);
}

const body = new FormData();
body.append('access_token', pageToken);
let edge = 'feed';
if (imagePath) {
    edge = 'photos';
    body.append('caption', message);
    body.append('source', new Blob([readFileSync(imagePath)]), path.basename(imagePath));
} else {
    body.append('message', message);
}

const response = await fetch(`https://graph.facebook.com/v21.0/${pageId}/${edge}`, { method: 'POST', body });
const result = await response.json();
if (result.error) {
    console.error('Facebook error:', result.error.message);
    process.exit(1);
}
console.log('Posted, id', result.post_id || result.id);
