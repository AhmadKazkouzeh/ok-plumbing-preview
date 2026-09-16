import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
const BASE = 'http://127.0.0.1:4321';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
const seen = new Map();
for (const p of ['/', '/services/', '/services/boiler-installation-repairs/', '/about/', '/contact/']) {
  await page.goto(BASE + p, { waitUntil: 'networkidle' });
  const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  for (const v of violations) for (const n of v.nodes) {
    const d = n.any[0]?.data || {};
    const key = `${d.fgColor}|${d.bgColor}|${d.fontSize}|${d.fontWeight}`;
    if (!seen.has(key)) seen.set(key, { ...d, where: [], sample: n.html.replace(/\s+/g,' ').slice(0, 90) });
    const e = seen.get(key);
    if (!e.where.includes(p)) e.where.push(p);
    e.count = (e.count || 0) + 1;
  }
}
console.log('Distinct contrast failures:\n');
for (const v of [...seen.values()].sort((a,b)=>a.contrastRatio-b.contrastRatio)) {
  console.log(`  ${v.contrastRatio}:1  (needs ${v.expectedContrastRatio})  ${v.fgColor} on ${v.bgColor}  ${v.fontSize} ${v.fontWeight}`);
  console.log(`    ${v.count} instance(s) on ${v.where.join(', ')}`);
  console.log(`    ${v.sample}\n`);
}
await browser.close();
