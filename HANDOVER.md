# OK Plumbing and Heating — project handover

Everything another person (or another AI agent) needs to pick this up cold.
Last updated: **25 October 2026**, the day the new site went live.

---

## 1. What this project is

A rebuild of the website for **OK Plumbing and Heating**, a Gas Safe registered
plumbing and heating firm covering all 32 London boroughs. The old site was
WordPress on Namecheap shared hosting. The new one is a static Astro site on the
same hosting. The business email was also moved from cPanel mailboxes to Zoho
Mail on the same day.

The client is **Osama Kazkouzeh** (the Namecheap and Gas Safe account holder).
Ahmad built the site.

---

## 2. Where everything lives

| Thing | Where |
| --- | --- |
| Source code | `~/Documents/Projects/ok-plumbing-heating-site` on Ahmad's Mac |
| Git remote | `https://github.com/ahmadkazkouzeh/ok-plumbing-preview.git` (branch `main`) |
| Live site | `https://okplumbing.co.uk` — Namecheap shared hosting, cPanel account `okplitid`, server `server219.web-hosting.com` |
| Web root | `/home/okplitid/public_html` |
| Preview site | `https://ahmadkazkouzeh.github.io/ok-plumbing-preview/` — GitHub Pages, noindex, built by `.github/workflows/preview.yml` |
| Email | Zoho Mail (EU data centre), `info@okplumbing.co.uk` |
| Form submissions | Web3Forms, free plan, 250/month |

**Important:** the repo is named `ok-plumbing-preview` because it started as a
preview deployment. It is the real repo for the site.

---

## 3. The stack, and why

- **Astro 7.3.2**, `output: 'static'`, `trailingSlash: 'always'`,
  `build.format: 'directory'`. No server runtime — it is plain files on Apache.
- **Tailwind CSS v4** through `@tailwindcss/vite`, with design tokens in
  `src/styles/global.css` under `@theme`.
- **One breakpoint only**, at 861px (`--breakpoint-nav`). Everything else is
  fluid — `auto-fit` grids and `clamp()`. Below 861px: hamburger drawer plus a
  fixed bottom call bar.
- **TypeScript strict.** `npx astro check` must stay at 0 errors.
- Fonts are self-hosted (`@fontsource-variable/manrope`). Nothing is fetched
  from Google Fonts.

### Single source of truth

`src/data/site.ts` holds **every business fact** — phone numbers, email, hours,
Gas Safe number, the six service categories and their 122 job lines, the 13
Google reviews, the recent-work photo captions. Pages read from it.

If a fact appears in two places, that is a bug. Change it there, not in a page.

---

## 4. Build and test

```bash
npm install
npm run build          # -> dist/
npx astro check        # must be 0 errors
npm test               # Playwright suite, needs a preview server running
```

The test suite (`tests/`) covers routes and links, form behaviour, keyboard and
focus, axe accessibility, colour contrast, responsive and SEO, and an Apache
crawl. Start `npx astro preview --port 4321` first. The Apache test additionally
needs Apache serving `dist/` on port 8080.

**Known test findings that are not bugs:**
- `01-routes` reports 404s for URLs without trailing slashes. That is the Astro
  preview server, which has no `.htaccess`. Under real Apache they 301 correctly.
- `03b-focus` reports "tab reaches invisible elements: INPUT need, INPUT when".
  Those are the visually-hidden radio inputs behind custom controls; focus is
  visibly rendered on the label. `03c-radio` verifies this.

---

## 5. Deployment

The site is **static files uploaded to `public_html`**. There is no CI deploy to
production — the GitHub Actions workflow only builds the GitHub Pages preview.

### How it was deployed on 25 October 2026

1. `npm run build`, then zip the **contents** of `dist/` (not the folder).
2. cPanel → File Manager → `public_html` → Upload → Extract.
3. **Fix permissions.** This bit matters: the extract produced several files as
   `0600`, which Apache cannot read, so every asset returned **403** while the
   HTML still worked. Everything must be `0644` for files, `0755` for
   directories. 101 files needed fixing.
4. Delete the zip from `public_html` afterwards.

### Rollback

The previous WordPress site was **moved, not deleted**:

- `public_html/_old-site-2026-10-25/` — 28 items, the complete old site
- `/home/okplitid/wordpress-backup-2026-10-25.zip` — 99.3 MB archive, outside
  the web root so it is not publicly downloadable
- The MySQL database `okplitid_wp85` was exported to Ahmad's Downloads folder

To roll back: move the contents of `_old-site-2026-10-25/` back up one level.

`.well-known/` and `cgi-bin/` were deliberately left in place — `.well-known` is
used for SSL certificate validation and moving it can break AutoSSL renewal.

### A useful trick

cPanel's File Manager selection is unreliable under browser automation. The
file operations were done through cPanel's own API from the browser console
instead:

```js
const base = location.pathname.split('/frontend/')[0];
// op = move | copy | chmod | extract | compress
fetch(`${base}/json-api/cpanel?cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop` +
      `&cpanel_jsonapi_apiversion=2&op=move&sourcefiles=${encodeURIComponent(src)}` +
      `&destfiles=${encodeURIComponent(dest)}&doubledot=0`, { credentials: 'same-origin' });
```

`sourcefiles` accepts a comma-separated list. For `chmod`, pass `metadata=0644`.
Listing: `${base}/execute/Fileman/list_files?dir=...&types=file|dir|link&show_hidden=1`.

---

## 6. Email migration (completed 25 October 2026)

Moved from cPanel mailboxes to **Zoho Mail Free**, EU data centre.

| Record | Value |
| --- | --- |
| MX | `mx.zoho.eu` (10), `mx2.zoho.eu` (20), `mx3.zoho.eu` (50) |
| SPF | `v=spf1 include:zohomail.eu +a +mx +ip4:198.54.114.99 +ip4:198.54.116.227 +ip4:198.54.116.99 include:spf.web-hosting.com ~all` |
| DKIM | selector `zmail`, at `zmail._domainkey` |
| DMARC | `v=DMARC1; p=none; rua=mailto:info@okplumbing.co.uk; fo=1` |
| Verification | `zoho-verification=zb99988208.zmverify.zoho.eu` |

**DNS is edited in cPanel → Zone Editor**, not in Namecheap's own DNS panel —
the nameservers are `dns1/dns2.namecheaphosting.com`, which points DNS at the
hosting account.

A full pre-migration snapshot of the DNS zone is at
`~/Documents/Projects/okplumbing-dns-backup-2026-10-25.txt`.

### Things that caught us out, in order

1. **cPanel keeps delivering mail locally** even after the MX records change.
   cPanel → Email Routing must be set to **Remote Mail Exchanger**.
2. **Zoho will not accept mail until you press Verify.** The domain sat at
   "Yet to point MX Records" and silently rejected everything. Admin console →
   Domains → the domain → MX → Verify.
3. **Namecheap's DNS was slow to drop the deleted MX record.** The new SPF
   propagated within minutes while the old `0 mail.okplumbing.co.uk` MX was
   still being served for over an hour. During that window mail bounced.
4. **Zoho files machine-generated mail under "Notifications", not Inbox.** We
   nearly concluded delivery was broken when it was just sorted elsewhere.
5. **Zoho Free allows one domain per organisation.** Each domain needs its own
   Zoho account. Ahmad also has `kmdc.co.uk` and `boxedandbuilt.co.uk` on
   separate free accounts.
6. **Zoho Free has no IMAP/POP.** Webmail and the Zoho app only. If anyone wants
   Apple Mail or Outlook, that needs the paid Mail Lite plan.

The old cPanel mailbox still exists as a fallback. **Leave it until late
November 2026**, then delete.

---

## 7. Contact form

Posts to **Web3Forms**. Configured by two environment variables in `.env`
(gitignored — so a fresh clone needs them re-created from `.env.example`):

```
PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
PUBLIC_FORM_ACCESS_KEY=b48f42a9-9c33-4365-ad16-2b4382c115c7
```

The access key is **public by design** — it identifies the form and authorises
nothing. It appears in the page source.

- Web3Forms account is under `okazkouzeh@gmail.com`.
- Submissions are delivered to `info@okplumbing.co.uk` (verified linked email).
- Sender name is set to "OK Plumbing website" — the default was "Notifications",
  which is what made Zoho file the first mail under its Notifications tab.
- Free plan cap: **250 submissions a month**.

If the form is ever pointed back at Formspree, rename the hidden `subject` field
in `FormShell.astro` to `_subject`, which is Formspree's convention.

---

## 8. Content rules — read before editing copy

These were deliberate decisions, not oversights. Undoing one reintroduces a
problem that was specifically fixed.

- **No emergency call-out anywhere.** The business does not offer it. This was
  removed site-wide, including from the social share image (`public/og.png`),
  where the text is baked into the PNG and no code search will find it.
- **No street address.** Service-area business; engineers travel to customers.
  The structured data carries locality and coverage only.
- **No prices.** The client quotes on survey.
- **Reviews are verbatim, typos included.** Editing a customer's words
  misrepresents them. Drop a review rather than tidy it.
- **No reviewer locations.** Google does not publish them, so the site does not
  claim them.
- **Alt text describes what is actually in the photograph**, not what the slot
  wishes were there.
- **All photography is the client's own.** 40 photographs supplied 1 October
  2026; 18 in use. No stock images anywhere — `index.astro` says so publicly.
- **Heat pumps are claimed nowhere** and must not be without MCS certification.

### Confirmed certifications (25 October 2026)

F-Gas, commercial gas (CODNCO1/COMCAT) and G3 unvented — all confirmed by the
client. If any lapses, the lines to pull are in `SERVICES` in `site.ts`: the AC
servicing/repairs/refrigerant items, the commercial gas items, and the unvented
cylinder lines.

### Gas Safe registration

`598577`, verified against the public register on 18 October 2026 — status
Registered. **It is registered under the owner's own name as a sole trader**,
not under the trading name, which is why searching "OK Plumbing" on the register
returns nothing. A customer who verifies the number will see a different name.

---

## 9. Open items

**Needs the client, not a developer:**

1. **Saturday hours contradict Google.** Site says 9am–2pm; the Google Business
   Profile says 9am–6pm. One is wrong, and the site's version is now also baked
   into `og.png`.
2. **The van photo shows `o.kplumbing1@gmail.com`** in the livery, which is not
   the site's address. Is it monitored? If not, crop or swap the photo.
3. **Four service lines may need qualifications beyond the three confirmed:**
   water meter work (the water company's responsibility), backflow/RPZ testing
   (needs WRAS/RPZ accreditation), bathroom electrics (Part P), commercial
   cylinders (may exceed domestic G3 scope).
4. **"Every engineer is Gas Safe registered"** is plural against a sole-trader
   registration. Consider small print naming the registration holder.
5. **Public liability and DBS claims have no evidence on file**, unlike every
   other credential. Get certificates or drop the claim.
6. **Terms page has no cancellation rights.** Work sold in a consumer's home is
   an off-premises contract with a statutory 14-day cancellation right that must
   be given in writing. Needs the client's solicitor.
7. **Privacy page is not a full UK GDPR notice** — no named controller, lawful
   basis, retention period or ICO complaint route.

**Technical, not urgent:**

8. `PUBLIC_GOOGLE_MAPS_KEY` is unset, so the maps use the keyless embed. Works,
   but is not a supported Google API.
9. The Gas Safe mark is a vector trace of the official artwork. Replace with the
   licensed pack from the client's Gas Safe business portal — drop it at
   `src/assets/gas-safe.(svg|png|jpg)` and it is picked up automatically.
10. **Hosting renews 27 November 2026.** Site and the old mailbox both depend on
    it. The domain itself is fine until July 2027.
11. Dead CSS and a few stale comments remain, listed in the review notes.
    Harmless.

---

## 10. Traps for the unwary

- **`overflow-x: hidden` breaks `position: sticky`.** It makes the element a
  scroll container. The sideways-scroll guard uses `overflow-x: clip` on
  `html`/`body` for exactly this reason. If you change it back, the header stops
  sticking and nothing will fail loudly.
- **Because the root is the scrolling element**, the mobile drawer's scroll lock
  must set `overflow: hidden` on `document.documentElement` as well as `body`.
- **Do not press "Repair" on cPanel's Email Deliverability page.** It will
  "fix" the SPF and MX records back to the hosting defaults and undo the email
  migration.
- **`sizes` without `srcset` does nothing.** `Photo.astro` passes `widths` to
  Astro's `<Image>` to generate the srcset. Remove it and every phone silently
  downloads desktop-sized images again.
- **The 404 page must stay `noindex`.** Apache serves its body for every missing
  URL, so an indexable 404 means unlimited soft-404s in Google's index.
