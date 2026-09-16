// Crawl through real Apache with the .htaccess active, spoofing HTTPS so the
// force-TLS rule is satisfied.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, extraHTTPHeaders: { 'X-Forwarded-Proto': 'https' } });
const page = await ctx.newPage();
const bad = [];
page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
page.on('pageerror', e => bad.push('PAGEERROR ' + e.message));
page.on('console', m => m.type() === 'error' && bad.push('CONSOLE ' + m.text()));
const seen = new Set(); const q = ['/'];
while (q.length) {
  const p = q.shift(); if (seen.has(p)) continue; seen.add(p);
  const r = await page.goto('http://127.0.0.1:8080' + p, { waitUntil: 'networkidle' });
  if (r.status() !== 200) bad.push(r.status() + ' on ' + p);
  for (const h of await page.evaluate(() => [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')))) {
    const t = h.split('#')[0];
    if (t && !t.endsWith('.xml') && !seen.has(t)) q.push(t);
  }
}
console.log('crawled via Apache:', [...seen].sort().join(' '));
console.log('errors:', bad.length ? [...new Set(bad)] : 'none');
await b.close();
