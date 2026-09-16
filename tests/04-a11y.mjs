import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = 'http://127.0.0.1:4321';
const PAGES = ['/', '/services/', '/services/boiler-installation-repairs/', '/about/', '/contact/', '/privacy/', '/terms/'];
const findings = [];
const note = (sev, area, msg) => findings.push({ sev, area, msg });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

/* ---------------- axe-core, desktop + mobile ---------------- */
for (const [w, label] of [[1440, 'desktop'], [390, 'mobile']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 1000 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    for (const v of violations) {
      const where = v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' ; ');
      note(v.impact === 'critical' || v.impact === 'serious' ? 'BUG' : 'MINOR', 'axe',
        `${label} ${path} — ${v.id} (${v.impact}, ${v.nodes.length}x): ${v.help}. e.g. ${where}`);
    }
  }
  await ctx.close();
}

/* ---------------- heading order + landmarks ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const info = await page.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({ lvl: +h.tagName[1], text: h.textContent.trim().slice(0, 40) }));
      return {
        h1: hs.filter((h) => h.lvl === 1).length,
        skips: hs.map((h, i) => (i && h.lvl - hs[i - 1].lvl > 1 ? `${hs[i - 1].lvl}->${h.lvl} at "${h.text}"` : null)).filter(Boolean),
        main: document.querySelectorAll('main').length,
        nav: document.querySelectorAll('nav').length,
        navNoLabel: [...document.querySelectorAll('nav')].filter((n) => !n.getAttribute('aria-label')).length,
        lang: document.documentElement.lang,
      };
    });
    if (info.h1 !== 1) note('BUG', 'a11y', `${path} has ${info.h1} <h1> elements, expected exactly 1`);
    for (const s of info.skips) note('MINOR', 'a11y', `${path} heading level skip: ${s}`);
    if (info.main !== 1) note('BUG', 'a11y', `${path} has ${info.main} <main> landmarks`);
    if (info.navNoLabel) note('MINOR', 'a11y', `${path} has ${info.navNoLabel} <nav> without aria-label`);
    if (!info.lang) note('BUG', 'a11y', `${path} has no lang attribute on <html>`);
  }
  await ctx.close();
}

/* ---------------- contrast: use axe, which resolves oklab/alpha properly ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const seen = new Set();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    for (const v of violations)
      for (const n of v.nodes) {
        const d = n.any[0]?.data || {};
        const key = `${d.fgColor}|${d.bgColor}|${d.fontSize}`;
        if (seen.has(key)) continue;
        seen.add(key);
        note('BUG', 'contrast', `${path} — ${d.contrastRatio}:1 (needs ${d.expectedContrastRatio}) ${d.fgColor} on ${d.bgColor} at ${d.fontSize} — ${n.html.replace(/\s+/g, ' ').slice(0, 70)}`);
      }
  }
  await ctx.close();
}

console.log(JSON.stringify(findings, null, 1));
await browser.close();
