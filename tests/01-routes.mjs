import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4321';
const findings = [];
const note = (sev, area, msg) => findings.push({ sev, area, msg });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

const consoleErrors = [];
const failedReqs = [];
const redirects = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(page.url() + ' :: ' + m.text()));
page.on('pageerror', (e) => consoleErrors.push(page.url() + ' :: PAGEERROR ' + e.message));
page.on('requestfailed', (r) => failedReqs.push(page.url() + ' :: ' + r.url() + ' ' + r.failure()?.errorText));
page.on('response', (r) => {
  const s = r.status();
  if (s >= 300 && s < 400) redirects.push(s + ' ' + r.url());
  if (s >= 400) note('BUG', 'http', `${s} on ${r.url()} (from ${page.url()})`);
});

// ---- crawl every internal link ------------------------------------------
const seen = new Set();
const queue = ['/'];
const linkGraph = [];

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) note('BUG', 'route', `${path} returned ${res?.status()}`);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.getAttribute('href'),
      text: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      hasAccessibleName: !!(a.textContent.trim() || a.getAttribute('aria-label') || a.querySelector('img[alt]:not([alt=""])')),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
    }))
  );

  for (const l of links) {
    linkGraph.push({ from: path, ...l });
    if (!l.hasAccessibleName) note('BUG', 'a11y', `link with no accessible name on ${path}: href=${l.href}`);
    if (l.target === '_blank' && !(l.rel || '').includes('noopener'))
      note('MINOR', 'security', `target=_blank without rel=noopener on ${path}: ${l.href}`);
    if (l.href?.startsWith('/') && !l.href.endsWith('.xml') && !seen.has(l.href.split('#')[0]))
      queue.push(l.href.split('#')[0]);
  }
}

// ---- tel: and mailto: sanity --------------------------------------------
const telLinks = linkGraph.filter((l) => l.href?.startsWith('tel:'));
const mailLinks = linkGraph.filter((l) => l.href?.startsWith('mailto:'));
const badTel = telLinks.filter((l) => !/^tel:\+44\d{9,10}$/.test(l.href));
if (badTel.length) note('BUG', 'links', `tel: links not in E.164: ${[...new Set(badTel.map((l) => l.href))].join(', ')}`);
const badMail = mailLinks.filter((l) => !/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(l.href));
if (badMail.length) note('BUG', 'links', `malformed mailto: ${badMail.map((l) => l.href).join(', ')}`);

// ---- in-page anchors actually exist -------------------------------------
const anchors = linkGraph.filter((l) => l.href?.includes('#') && !l.href.startsWith('#'));
for (const a of new Set(anchors.map((x) => x.href))) {
  const [p, frag] = a.split('#');
  if (!frag) continue;
  await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  const exists = await page.evaluate((f) => !!document.getElementById(f), frag);
  if (!exists) note('BUG', 'links', `anchor #${frag} does not exist on ${p}`);
}

// ---- 404 route ------------------------------------------------------------
const r404 = await page.goto(BASE + '/definitely-not-a-page/', { waitUntil: 'domcontentloaded' });
if (r404.status() !== 404) note('MINOR', 'route', `unknown path returned ${r404.status()}, expected 404`);
const has404Heading = await page.evaluate(() => !!document.querySelector('h1'));
if (!has404Heading) note('BUG', 'route', '404 page has no <h1>');

// ---- trailing-slash consistency ------------------------------------------
for (const p of ['/services', '/about', '/contact']) {
  const r = await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  const finalPath = new URL(page.url()).pathname;
  if (r.status() !== 200) note('BUG', 'route', `${p} (no trailing slash) returned ${r.status()}`);
  else if (finalPath !== p + '/') note('MINOR', 'route', `${p} resolved to ${finalPath} without redirecting to ${p}/`);
}

if (consoleErrors.length) for (const e of [...new Set(consoleErrors)]) note('BUG', 'console', e);
if (failedReqs.length) for (const e of [...new Set(failedReqs)]) note('BUG', 'network', e);

console.log('pages crawled:', [...seen].sort().join(' '));
console.log('links checked:', linkGraph.length, '| tel:', telLinks.length, '| mailto:', mailLinks.length);
console.log(JSON.stringify(findings, null, 1));
await browser.close();
