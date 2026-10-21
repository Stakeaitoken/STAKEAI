// Usage: node scripts/telegram-post.mjs "message text" [path/to/image.png]
import { readFileSync } from 'node:fs';
import path from 'node:path';

const envPath = path.join(process.cwd(), '.env');
try {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
} catch {
    // .env is optional when variables are already set
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID || '@stakeaiio';
const [text, imagePath] = process.argv.slice(2);
if (!token || !text) {
    console.error('Set TELEGRAM_BOT_TOKEN and pass the message text as the first argument.');
    process.exit(1);
}

const method = imagePath ? 'sendPhoto' : 'sendMessage';
const body = new FormData();
body.append('chat_id', chatId);
if (imagePath) {
    body.append('photo', new Blob([readFileSync(imagePath)]), path.basename(imagePath));
    body.append('caption', text);
} else {
    body.append('text', text);
    body.append('disable_web_page_preview', 'true');
}

const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', body });
const result = await response.json();
if (!result.ok) {
    console.error('Telegram error:', result.description);
    process.exit(1);
}
console.log('Posted, message id', result.result.message_id);
