import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1200 } })).newPage();
await page.goto('http://127.0.0.1:4321/contact/', { waitUntil: 'networkidle' });
// Tab to the first chip radio using real key presses so :focus-visible applies.
for (let i = 0; i < 44; i++) {
  await page.keyboard.press('Tab');
  const hit = await page.evaluate(() => document.activeElement?.name === 'need');
  if (hit) break;
}
const r = await page.evaluate(() => {
  const a = document.activeElement;
  const span = a.nextElementSibling;
  const s = getComputedStyle(span);
  const rect = span.getBoundingClientRect();
  return {
    focusedName: a.name, focusedValue: a.value,
    spanOutline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor,
    spanBox: Math.round(rect.width) + 'x' + Math.round(rect.height),
    matchesFocusVisible: a.matches(':focus-visible'),
  };
});
console.log(JSON.stringify(r, null, 1));
await page.screenshot({ path: 'screenshots/radio-focus.png', clip: { x: 100, y: 660, width: 620, height: 130 } });
await browser.close();
