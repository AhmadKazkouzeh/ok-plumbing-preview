import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4321';
const findings = [];
const note = (sev, area, msg) => findings.push({ sev, area, msg });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

/* ---------------- mobile drawer ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const toggle = 'button[data-menu-toggle]';
  const drawer = '[data-drawer]';

  if ((await page.getAttribute(toggle, 'aria-expanded')) !== 'false')
    note('BUG', 'drawer', 'hamburger does not start with aria-expanded="false"');
  if (!(await page.getAttribute(toggle, 'aria-controls')))
    note('BUG', 'drawer', 'hamburger has no aria-controls');

  // open
  await page.click(toggle);
  await page.waitForTimeout(200);
  if ((await page.getAttribute(toggle, 'aria-expanded')) !== 'true') note('BUG', 'drawer', 'aria-expanded not true after opening');
  if ((await page.getAttribute(drawer, 'hidden')) === null) { /* visible, good */ } else note('BUG', 'drawer', 'drawer still hidden after opening');

  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 20));
  if (firstFocus !== 'Home') note('MINOR', 'drawer', `focus after opening went to "${firstFocus}", expected the first link`);

  // focus trap: tab round the whole drawer and make sure focus never escapes
  const trapOk = await page.evaluate(async () => {
    const drawerEl = document.querySelector('[data-drawer]');
    const toggleEl = document.querySelector('[data-menu-toggle]');
    for (let i = 0; i < 20; i++) {
      const a = document.activeElement;
      if (a !== toggleEl && !drawerEl.contains(a)) return false;
      const items = [toggleEl, ...drawerEl.querySelectorAll('a[href], button:not([disabled])')];
      const idx = items.indexOf(a);
      items[(idx + 1) % items.length].focus();
    }
    return true;
  });
  if (!trapOk) note('BUG', 'drawer', 'focus escaped the open drawer');

  // Escape closes and returns focus
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  if ((await page.getAttribute(drawer, 'hidden')) === null) note('BUG', 'drawer', 'Escape did not close the drawer');
  const afterEsc = await page.evaluate(() => document.activeElement?.dataset?.menuToggle !== undefined);
  if (!afterEsc) note('MINOR', 'drawer', 'focus did not return to the hamburger after Escape');

  // background must not scroll while the drawer is open
  await page.click(toggle);
  await page.waitForTimeout(150);
  const scrollLocked = await page.evaluate(() => {
    const before = window.scrollY;
    window.scrollTo(0, 400);
    const after = window.scrollY;
    window.scrollTo(0, before);
    return after === before;
  });
  if (!scrollLocked)
    note('MINOR', 'drawer', 'the page behind the open drawer still scrolls — on a phone this makes the menu feel broken');

  // navigating closes it
  await page.click('[data-drawer] a[href="/about/"]');
  await page.waitForLoadState('networkidle');
  if (!new URL(page.url()).pathname.startsWith('/about')) note('BUG', 'drawer', 'drawer link did not navigate');
  if ((await page.getAttribute(drawer, 'hidden')) === null) note('BUG', 'drawer', 'drawer was still open after navigating');

  // resizing to desktop must reset it
  await page.click(toggle);
  await page.waitForTimeout(150);
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForTimeout(300);
  const drawerVisibleOnDesktop = await page.evaluate(() => {
    const d = document.querySelector('[data-drawer]');
    return !d.hidden && getComputedStyle(d).display !== 'none';
  });
  if (drawerVisibleOnDesktop) note('BUG', 'drawer', 'drawer stayed open/visible after resizing to desktop');

  await ctx.close();
}

/* ---------------- call bar + sticky header ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const bar = await page.evaluate(() => {
    const b = document.querySelector('.callbar');
    if (!b) return null;
    const r = b.getBoundingClientRect();
    const links = [...b.querySelectorAll('a')].map((a) => ({ href: a.getAttribute('href'), h: Math.round(a.getBoundingClientRect().height) }));
    return { visible: getComputedStyle(b).display !== 'none', bottom: Math.round(r.bottom), vh: innerHeight, links };
  });
  if (!bar?.visible) note('BUG', 'callbar', 'fixed call bar is not visible at 390px');
  else {
    if (bar.bottom !== bar.vh) note('MINOR', 'callbar', `call bar bottom is ${bar.bottom}, viewport is ${bar.vh}`);
    for (const l of bar.links) if (l.h < 44) note('BUG', 'a11y', `call bar tap target only ${l.h}px tall (needs 44px)`);
  }

  // The call bar must not cover the end of the page content.
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const covered = await page.evaluate(() => {
    const bar = document.querySelector('.callbar').getBoundingClientRect();
    const last = [...document.querySelectorAll('footer a, footer span')].pop();
    if (!last) return false;
    const r = last.getBoundingClientRect();
    return r.bottom > bar.top && r.top < bar.bottom;
  });
  if (covered) note('BUG', 'callbar', 'the fixed call bar covers the last of the footer content');

  // Sticky header must stay put and not be hidden behind the call bar.
  await page.evaluate(() => scrollTo(0, 1200));
  await page.waitForTimeout(250);
  const headerTop = await page.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().top));
  if (headerTop > 1) note('BUG', 'header', `sticky header top is ${headerTop} after scrolling, expected 0`);

  await ctx.close();
}

/* ---------------- FAQ ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const faq = await page.evaluate(() => {
    const d = [...document.querySelectorAll('details')];
    return { count: d.length, openFirst: d[0]?.open, openOthers: d.slice(1).filter((x) => x.open).length };
  });
  if (faq.count !== 4) note('BUG', 'faq', `found ${faq.count} FAQ items, expected 4`);
  if (!faq.openFirst) note('BUG', 'faq', 'first FAQ item is not open by default');
  if (faq.openOthers) note('MINOR', 'faq', `${faq.openOthers} other FAQ items are open by default`);

  // keyboard toggle
  await page.focus('details:nth-of-type(2) summary');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const secondOpen = await page.evaluate(() => document.querySelectorAll('details')[1].open);
  if (!secondOpen) note('BUG', 'faq', 'FAQ item does not open with the keyboard');

  // the + must rotate when open
  const rotated = await page.evaluate(() => {
    const p = document.querySelectorAll('details')[1].querySelector('.faq-plus');
    return getComputedStyle(p).transform !== 'none';
  });
  if (!rotated) note('MINOR', 'faq', 'the orange + does not rotate when the item opens');

  await ctx.close();
}

/* ---------------- skip link + keyboard focus ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    return { text: a.textContent.trim(), href: a.getAttribute('href'), visible: r.width > 0 && r.height > 0 && r.top > -50 };
  });
  if (skip.text !== 'Skip to content') note('BUG', 'a11y', `first tab stop is "${skip.text}", expected the skip link`);
  if (!skip.visible) note('BUG', 'a11y', 'skip link does not become visible when focused');

  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const jumped = await page.evaluate(() => location.hash === '#main');
  if (!jumped) note('MINOR', 'a11y', 'skip link did not move to #main');

  // every interactive element must show a focus ring
  const noRing = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('a[href], button, input, textarea, summary')) {
      el.focus();
      const s = getComputedStyle(el);
      const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
      if (!ring) out.push((el.tagName + ' ' + (el.textContent || el.name || '').trim()).slice(0, 45));
    }
    return out;
  });
  if (noRing.length) note('BUG', 'a11y', `${noRing.length} focusable elements show no focus ring: ${noRing.slice(0, 5).join(' | ')}`);

  await ctx.close();
}

console.log(JSON.stringify(findings, null, 1));
await browser.close();
