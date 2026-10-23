import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const artifact = new URL('./dist/warden-review.html', import.meta.url);
const host = process.env.PIXELOVEN_REVIEW_HOST || '127.0.0.1';
const port = Number(process.env.PIXELOVEN_REVIEW_PORT || 4179);
createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
  }
  const path = new URL(request.url, 'http://localhost').pathname;
  if (path === '/favicon.ico') { response.writeHead(204); response.end(); return; }
  if (!['/', '/warden', '/warden/', '/warden-review.html'].includes(path)) {
    response.writeHead(404); response.end('Not found'); return;
  }
  try {
    const html = await readFile(artifact);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : html);
  } catch {
    response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Review unavailable. Build the portable review artifact first.');
  }
}).listen(port, host, () => console.log(`Warden review: http://${host}:${port}/warden/`));
