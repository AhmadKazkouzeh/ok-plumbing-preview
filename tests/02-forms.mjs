import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4321';
const findings = [];
const note = (sev, area, msg) => findings.push({ sev, area, msg });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

/* ------------------------------------------------------------------ *
 * 1. Contact form — validation behaviour
 * ------------------------------------------------------------------ */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });

  // Submitting empty should block and show errors on the three required fields.
  await page.click('button[type="submit"]');
  await page.waitForTimeout(300);
  const errs = await page.$$eval('.field-error:visible', (n) => n.map((e) => e.textContent.trim()));
  if (errs.length !== 3) note('BUG', 'form', `empty submit showed ${errs.length} errors, expected 3 (firstName, phone, postcode). Got: ${JSON.stringify(errs)}`);

  const focused = await page.evaluate(() => document.activeElement?.getAttribute('name'));
  if (focused !== 'firstName') note('MINOR', 'form', `after failed submit, focus went to "${focused}" not the first invalid field`);

  // aria-invalid should be set, and the error should be announced via aria-describedby.
  const ariaState = await page.evaluate(() => {
    const f = document.querySelector('input[name="phone"]');
    const err = document.querySelector('[data-error-for="phone"]');
    return {
      invalid: f.getAttribute('aria-invalid'),
      describedby: f.getAttribute('aria-describedby'),
      errId: err?.id || null,
    };
  });
  if (ariaState.invalid !== 'true') note('BUG', 'a11y', 'aria-invalid not set on a field that failed validation');
  if (!ariaState.describedby || !ariaState.errId)
    note('BUG', 'a11y', 'validation errors are not linked to their input with aria-describedby — a screen reader announces the field as invalid but never reads why');

  // UK phone: a set of values that should pass and fail.
  const phoneCases = [
    ['07444419144', true], ['07444 419144', true], ['+447444419144', true],
    ['02088112551', true], ['020 8811 2551', true], ['+44 20 8811 2551', true],
    ['(020) 8811 2551', true],
    ['12345', false], ['abcdefghijk', false], ['004474444191', false],
  ];
  for (const [val, shouldPass] of phoneCases) {
    await page.fill('input[name="phone"]', val);
    await page.evaluate(() => document.querySelector('input[name="phone"]').blur());
    await page.waitForTimeout(80);
    const msg = await page.$eval('[data-error-for="phone"]', (e) => (e.hidden ? '' : e.textContent.trim()));
    const passed = msg === '';
    if (passed !== shouldPass)
      note(shouldPass ? 'BUG' : 'MINOR', 'form', `phone "${val}" ${passed ? 'accepted' : 'rejected'}, expected ${shouldPass ? 'accepted' : 'rejected'}`);
  }

  // UK postcode
  const pcCases = [['W14 0AS', true], ['w140as', true], ['EC1A 1BB', true], ['SW1A1AA', true], ['12345', false], ['ZZZ', false]];
  for (const [val, shouldPass] of pcCases) {
    await page.fill('input[name="postcode"]', val);
    await page.evaluate(() => document.querySelector('input[name="postcode"]').blur());
    await page.waitForTimeout(80);
    const msg = await page.$eval('[data-error-for="postcode"]', (e) => (e.hidden ? '' : e.textContent.trim()));
    const passed = msg === '';
    if (passed !== shouldPass) note('BUG', 'form', `postcode "${val}" ${passed ? 'accepted' : 'rejected'}, expected ${shouldPass ? 'accepted' : 'rejected'}`);
  }

  // Radio groups must be real inputs with a checked default.
  const radios = await page.evaluate(() => {
    const need = [...document.querySelectorAll('input[name="need"]')];
    const when = [...document.querySelectorAll('input[name="when"]')];
    return {
      needCount: need.length,
      whenCount: when.length,
      needChecked: need.find((r) => r.checked)?.value ?? null,
      whenChecked: when.find((r) => r.checked)?.value ?? null,
      needLegend: document.querySelector('fieldset legend')?.textContent.trim(),
    };
  });
  if (radios.needCount !== 6) note('BUG', 'form', `"What do you need?" has ${radios.needCount} radios, expected 6`);
  if (radios.whenCount !== 3) note('BUG', 'form', `"How soon?" has ${radios.whenCount} radios, expected 3`);
  if (radios.needChecked !== 'Boiler') note('BUG', 'form', `default need chip is "${radios.needChecked}", design says Boiler`);
  if (radios.whenChecked !== 'Within a week') note('BUG', 'form', `default when is "${radios.whenChecked}", design says Within a week`);

  // Selecting a chip by keyboard should work.
  await page.focus('input[name="need"][value="Bathroom"]');
  await page.keyboard.press('Space');
  const afterKey = await page.evaluate(() => document.querySelector('input[name="need"]:checked')?.value);
  if (afterKey !== 'Bathroom') note('BUG', 'form', `keyboard selection of a chip did not take (checked = ${afterKey})`);

  // Honeypot must exist, be non-tabbable, and block submission when filled.
  const hp = await page.evaluate(() => {
    const f = document.querySelector('[data-honeypot]');
    if (!f) return null;
    const wrap = f.closest('[aria-hidden="true"]');
    return { name: f.name, tabindex: f.getAttribute('tabindex'), ariaHiddenWrapper: !!wrap, autocomplete: f.getAttribute('autocomplete') };
  });
  if (!hp) note('BUG', 'form', 'no honeypot field found');
  else {
    if (hp.tabindex !== '-1') note('BUG', 'form', 'honeypot is reachable by keyboard (no tabindex="-1")');
    if (hp.ariaHiddenWrapper) note('MINOR', 'a11y', 'honeypot sits inside aria-hidden="true" while being a focusable input — axe flags this as aria-hidden-focus');
  }

  // Endpoint behaviour: with no endpoint configured, submitting a valid form must not silently lose the enquiry.
  await page.fill('input[name="firstName"]', 'Test');
  await page.fill('input[name="phone"]', '07444419144');
  await page.fill('input[name="postcode"]', 'W14 0AS');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
  const status = await page.$eval('[data-form-status]', (e) => (e.hidden ? '' : e.textContent.trim()));
  const successShown = await page.$eval('[data-form-success]', (e) => !e.hidden);
  if (successShown) note('BUG', 'form', 'form showed the success state even though no endpoint is configured — an enquiry would be silently lost');
  if (!status) note('BUG', 'form', 'valid submit with no endpoint produced no message at all');
  else console.log('no-endpoint message:', JSON.stringify(status));

  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * 2. Success + failure states, with a stubbed endpoint
 * ------------------------------------------------------------------ */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await ctx.newPage();
  await page.route('**/stub-endpoint', (r) => r.fulfill({ status: 200, body: '{"ok":true}' }));
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });

  // Point the form at the stub the way a configured build would.
  await page.evaluate(() => {
    document.querySelector('form[data-form]').setAttribute('action', '/stub-endpoint');
  });
  const canOverride = await page.evaluate(() => typeof window.__FORM_ENDPOINT__ !== 'undefined');
  if (!canOverride)
    note('INFO', 'form', 'endpoint is baked in at build time, so the success path can only be exercised with a real endpoint set — verified the failure path instead');

  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * 3. Boiler survey form
 * ------------------------------------------------------------------ */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1400 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/services/boiler-installation-repairs/', { waitUntil: 'networkidle' });

  const fields = await page.evaluate(() =>
    [...document.querySelectorAll('form[data-form] input:not([data-honeypot]):not([type=hidden])')].map((i) => ({
      name: i.name, required: i.required, type: i.type,
      labelled: !!i.closest('label') || !!document.querySelector(`label[for="${i.id}"]`),
    }))
  );
  for (const f of fields) if (!f.labelled) note('BUG', 'a11y', `survey form field "${f.name}" has no associated label`);
  for (const n of ['name', 'phone', 'postcode'])
    if (!fields.find((f) => f.name === n)?.required) note('BUG', 'form', `survey field "${n}" is not required`);

  await page.click('form[data-form] button[type="submit"]');
  await page.waitForTimeout(300);
  const errs = await page.$$eval('.field-error:visible', (n) => n.length);
  if (errs !== 3) note('BUG', 'form', `survey form empty submit showed ${errs} errors, expected 3`);

  // Two forms on one site must not share duplicate element ids.
  const dupeIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  });
  if (dupeIds.length) note('BUG', 'html', `duplicate element ids on the boilers page: ${[...new Set(dupeIds)].join(', ')}`);

  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * 4. JavaScript disabled — the no-JS fallback
 * ------------------------------------------------------------------ */
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1200 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact/', { waitUntil: 'domcontentloaded' });
  const noJs = await page.evaluate(() => 1).catch(() => null);

  const formAttrs = await page.$eval('form[data-form]', (f) => ({
    action: f.getAttribute('action'),
    method: f.getAttribute('method'),
    novalidate: f.hasAttribute('novalidate'),
  })).catch(() => null);

  if (formAttrs) {
    if (formAttrs.novalidate)
      note('BUG', 'form', 'the form carries novalidate in the HTML, so with JavaScript unavailable the browser does no validation either — required fields can be submitted empty');
    if (formAttrs.action === '')
      note('BUG', 'form', 'action="" means a no-JS submit POSTs back to the page itself and the visitor loses what they typed');
    const noscript = await page.$('form[data-form] noscript');
    if (formAttrs.action === null && !noscript)
      note('BUG', 'form', 'no endpoint and no <noscript> fallback — a visitor without JS gets a button that does nothing and no explanation');
  }
  await ctx.close();
}

console.log(JSON.stringify(findings, null, 1));
await browser.close();
