import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:4321';
const findings = [];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

for (const [w, label] of [[1440, 'desktop'], [390, 'mobile']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });

  // Walk the page with real Tab presses and inspect the focus ring each time.
  const results = [];
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const rect = a.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0 && getComputedStyle(a).visibility !== 'hidden';
      if (!visible) return { hiddenButFocusable: (a.tagName + ' ' + (a.getAttribute('name') || a.textContent || '').trim()).slice(0, 40) };
      const s = getComputedStyle(a);
      const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
      return { tag: a.tagName, label: (a.getAttribute('aria-label') || a.getAttribute('name') || a.textContent || '').trim().slice(0, 32), ring, w: Math.round(rect.width), h: Math.round(rect.height) };
    });
    if (r) results.push(r);
  }
  const hiddenFocusable = results.filter(r => r.hiddenButFocusable);
  const noRing = results.filter(r => r.ring === false);
  const tiny = results.filter(r => r.h && r.h < 24 && r.tag !== 'A');
  if (hiddenFocusable.length) findings.push({ sev: 'BUG', area: 'a11y', msg: `${label}: tab reaches ${hiddenFocusable.length} invisible element(s): ${[...new Set(hiddenFocusable.map(h=>h.hiddenButFocusable))].join(', ')}` });
  if (noRing.length) findings.push({ sev: 'BUG', area: 'a11y', msg: `${label}: no focus ring on ${noRing.map(n => n.tag + ' "' + n.label + '"').join(' | ')}` });
  console.log(label, '— tab stops:', results.length, '| with ring:', results.filter(r=>r.ring===true).length, '| hidden focusable:', hiddenFocusable.length);
  await ctx.close();
}

// Re-check the drawer scroll-lock claim more carefully.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => window.scrollY);
  if (after !== before) findings.push({ sev: 'MINOR', area: 'drawer', msg: `page behind the open drawer scrolls (${before} -> ${after}); the drawer scrolls out of view with it` });
  console.log('drawer scroll test: before', before, 'after', after);
  await ctx.close();
}

console.log(JSON.stringify(findings, null, 1));
await browser.close();
