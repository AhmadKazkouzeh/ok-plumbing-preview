import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4321';
const PAGES = ['/', '/services/', '/services/boiler-installation-repairs/', '/about/', '/contact/', '/privacy/', '/terms/'];
const findings = [];
const note = (sev, area, msg) => findings.push({ sev, area, msg });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

/* ---------------- responsive ---------------- */
const WIDTHS = [320, 360, 390, 430, 600, 768, 860, 861, 1024, 1280, 1440, 1920];
{
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        const overflow = de.scrollWidth - de.clientWidth;
        // which elements stick out past the viewport?
        const culprits = [];
        if (overflow > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const b = el.getBoundingClientRect();
            if (b.right > de.clientWidth + 1 && b.width > 0)
              culprits.push(el.tagName + '.' + (el.className.toString().split(' ')[0] || '') + ' right=' + Math.round(b.right));
          }
        }
        // tap targets
        const small = [];
        for (const el of document.querySelectorAll('a[href], button, input[type=radio] + span, summary')) {
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height) continue;
          const isInline = getComputedStyle(el).display === 'inline' && el.tagName === 'A';
          if (!isInline && (b.height < 24 || b.width < 24))
            small.push((el.textContent || '').trim().slice(0, 24) + ` ${Math.round(b.width)}x${Math.round(b.height)}`);
        }
        // text overflowing its box
        const clipped = [];
        for (const el of document.querySelectorAll('h1,h2,h3,p,span,a,li')) {
          if (el.children.length) continue;
          if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
            clipped.push((el.textContent || '').trim().slice(0, 30));
        }
        return { overflow, culprits: [...new Set(culprits)].slice(0, 4), small: [...new Set(small)].slice(0, 4), clipped: clipped.slice(0, 3) };
      });
      if (r.overflow > 1) note('BUG', 'responsive', `${w}px ${path} — horizontal overflow ${r.overflow}px. Culprits: ${r.culprits.join(' | ')}`);
      for (const s of r.small) note('MINOR', 'responsive', `${w}px ${path} — small tap target: ${s}`);
      for (const c of r.clipped) note('BUG', 'responsive', `${w}px ${path} — clipped text: "${c}"`);
    }
    await ctx.close();
  }
}

/* ---------------- images ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { const s = innerHeight; for (let y = 0; y < document.body.scrollHeight; y += s) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } });
    await page.waitForLoadState('networkidle');
    const imgs = await page.evaluate(() =>
      [...document.querySelectorAll('img')].map((i) => ({
        src: i.currentSrc || i.src, alt: i.getAttribute('alt'), loading: i.getAttribute('loading'),
        w: i.getAttribute('width'), h: i.getAttribute('height'),
        natural: i.naturalWidth + 'x' + i.naturalHeight, broken: i.complete && i.naturalWidth === 0,
        displayed: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height),
      }))
    );
    for (const i of imgs) {
      if (i.broken) note('BUG', 'images', `${path} — broken image ${i.src}`);
      if (i.alt === null) note('BUG', 'a11y', `${path} — <img> with no alt attribute: ${i.src}`);
      if (!i.w || !i.h) note('MINOR', 'perf', `${path} — <img> without width/height (layout shift risk): ${i.src}`);
    }
  }
  await ctx.close();
}

/* ---------------- SEO + structured data ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const titles = new Map(), descs = new Map();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const m = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name=description]')?.content,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      og: {
        title: document.querySelector('meta[property="og:title"]')?.content,
        desc: document.querySelector('meta[property="og:description"]')?.content,
        url: document.querySelector('meta[property="og:url"]')?.content,
        image: document.querySelector('meta[property="og:image"]')?.content,
      },
      robots: document.querySelector('meta[name=robots]')?.content,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
    }));
    if (!m.title) note('BUG', 'seo', `${path} has no <title>`);
    else if (m.title.length > 60) note('MINOR', 'seo', `${path} title is ${m.title.length} chars (Google truncates around 60): "${m.title}"`);
    if (!m.desc) note('BUG', 'seo', `${path} has no meta description`);
    else if (m.desc.length > 160) note('MINOR', 'seo', `${path} meta description is ${m.desc.length} chars (truncated around 160)`);
    if (titles.has(m.title)) note('BUG', 'seo', `duplicate <title> on ${path} and ${titles.get(m.title)}`);
    titles.set(m.title, path);
    if (descs.has(m.desc)) note('BUG', 'seo', `duplicate meta description on ${path} and ${descs.get(m.desc)}`);
    descs.set(m.desc, path);
    if (!m.canonical) note('BUG', 'seo', `${path} has no canonical`);
    else if (new URL(m.canonical).pathname !== path) note('BUG', 'seo', `${path} canonical points at ${new URL(m.canonical).pathname}`);
    if (!m.og.image) note('MINOR', 'seo', `${path} has no og:image — link previews on WhatsApp/Facebook will be blank`);
    for (const raw of m.ld) {
      try {
        const j = JSON.parse(raw);
        if (!j['@context'] || !j['@type']) note('BUG', 'seo', `${path} JSON-LD missing @context/@type`);
      } catch (e) { note('BUG', 'seo', `${path} has invalid JSON-LD: ${e.message}`); }
    }
  }

  // sitemap + robots
  const sm = await (await page.goto(BASE + '/sitemap-0.xml')).text();
  const locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  for (const p of PAGES) if (!locs.includes(p)) note('BUG', 'seo', `${p} missing from sitemap`);
  if (locs.includes('/404/')) note('MINOR', 'seo', '404 page is listed in the sitemap');
  const robots = await (await page.goto(BASE + '/robots.txt')).text();
  if (!robots.includes('Sitemap:')) note('BUG', 'seo', 'robots.txt has no Sitemap line');
  console.log('sitemap entries:', locs.join(' '));
  await ctx.close();
}

console.log(JSON.stringify(findings, null, 1));
await browser.close();
