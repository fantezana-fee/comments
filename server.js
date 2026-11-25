// FEE Comment Assistant - local server. No dependencies; needs Node 18+.
// Run: ANTHROPIC_API_KEY=sk-ant-... node server.js   (or put the key in a .env file)
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- tiny .env loader -------------------------------------------------------
try {
  for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}

const PORT = process.env.PORT || 3000;
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const DB = path.join(__dirname, 'data', 'items.json');
const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

const loadItems = () => { try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch { return []; } };
const saveItems = (items) => fs.writeFileSync(DB, JSON.stringify(items, null, 2));

// --- comment handling -------------------------------------------------------
// A comment that is just a CTA keyword ("Liberty", "liberty!") gets a canned reply, no AI.
function ctaMatch(comment) {
  const clean = comment.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  return config.cta.keywords.some((k) => clean === k.toLowerCase());
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function draft({ caption, comment, note, previous }) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set. Add it to a .env file (see README).');
  const system = read('prompts/fee_voice.md') + '\n\n' + read('prompts/examples.md');
  let user = `Original post caption:\n${caption || '(not provided)'}\n\nInput comment:\n${comment}`;
  if (note) {
    user += `\n\nThe reviewer was not happy with this draft:\n${previous || ''}\n\nReviewer instruction for the new draft: ${note}`;
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.MODEL || config.model,
      max_tokens: 900,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || `API error ${res.status}`);
  const text = (body.content || []).map((b) => b.text || '').join('');
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('Model did not return JSON');
  const j = JSON.parse(m[0]);
  return { best: j.best || '', short: j.short || '', notes: j.notes || '', risk: j.risk || 'ok' };
}

async function createItem({ caption, comment, account }) {
  const item = {
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    account: account || '',
    caption: caption || '',
    comment: comment.trim(),
    status: 'pending', // pending | approved | skipped
    kind: 'ai', // ai | cta
    draft: null,
    final: '',
    error: null,
  };
  if (ctaMatch(item.comment)) {
    item.kind = 'cta';
    item.draft = { best: pick(config.cta.replies), short: '', notes: 'CTA keyword. Canned reply, no AI used.', risk: 'ok' };
  } else {
    try { item.draft = await draft(item); } catch (e) { item.error = e.message; }
  }
  item.final = item.draft?.best || '';
  return item;
}

// --- http -------------------------------------------------------------------
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
const send = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
const readBody = (req) => new Promise((r) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => r(b ? JSON.parse(b) : {})); });

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/items' && req.method === 'GET') return send(res, 200, loadItems());
    if (url.pathname === '/api/items' && req.method === 'POST') {
      const b = await readBody(req);
      if (!b.comment || !b.comment.trim()) return send(res, 400, { error: 'Comment is required' });
      const item = await createItem(b);
      const items = loadItems(); items.unshift(item); saveItems(items);
      return send(res, 200, item);
    }
    const m = url.pathname.match(/^\/api\/items\/([\w-]+)(\/regenerate)?$/);
    if (m) {
      const items = loadItems();
      const item = items.find((i) => i.id === m[1]);
      if (!item) return send(res, 404, { error: 'Not found' });
      if (m[2] && req.method === 'POST') {
        const b = await readBody(req);
        try {
          item.draft = await draft({ ...item, note: b.note, previous: item.final });
          item.error = null;
          item.final = item.draft.best;
        } catch (e) { item.error = e.message; }
        saveItems(items);
        return send(res, 200, item);
      }
      if (req.method === 'PATCH') {
        const b = await readBody(req);
        if (b.status) item.status = b.status;
        if (typeof b.final === 'string') item.final = b.final;
        if (b.status === 'approved') { item.approvedAt = new Date().toISOString(); item.approvedBy = b.reviewer || ''; }
        saveItems(items);
        return send(res, 200, item);
      }
      if (req.method === 'DELETE') { saveItems(items.filter((i) => i.id !== m[1])); return send(res, 200, { ok: true }); }
    }
    // static files
    const file = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, ''));
    if (!file.startsWith(path.join(__dirname, 'public')) || !fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'text/plain' });
    res.end(fs.readFileSync(file));
  } catch (e) { send(res, 500, { error: e.message }); }
}).listen(PORT, '127.0.0.1', () => console.log(`FEE Comment Assistant running at http://localhost:${PORT}`));
