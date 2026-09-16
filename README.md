# OK Plumbing and Heating — website

Static marketing site for OK Plumbing and Heating, built with **Astro**,
**TypeScript** and **Tailwind CSS v4** from the approved design handoff. Replaces
the existing WordPress site at okplumbing.co.uk.

Five real routes, server-rendered at build time, no client-side page switching:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services` | Services |
| `/services/boiler-installation-repairs` | Boilers |
| `/about` | About |
| `/contact` | Contact |

Plus `/privacy`, `/terms` and a `404`.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built output
```

Node 20+ (built and tested on 22).

## Deploying to Namecheap

The build is plain static files — no Node on the server, nothing to install.

1. `npm run build`
2. Upload **the contents of `dist/`** (not the folder itself) into `public_html`
   via cPanel File Manager or FTP.
3. Remove the old WordPress install from `public_html` first, or move it aside.
   Keep a backup until the new site is confirmed live.
4. `.htaccess` is included in `dist/` and does the work Apache needs: serves the
   custom 404 page, forces HTTPS, redirects `www` to the bare domain, adds the
   trailing slash to directory URLs, turns on gzip, and sets cache headers
   (immutable for hashed assets, no-cache for HTML). Make sure your upload
   includes dotfiles — FTP clients often hide them.
   No redirects are needed from the old site: every old path was an anchor on a
   single page (`/`, `#our-services`, `#our-team`, `#contact-us`).

Anything that changes the copy, phone numbers, services or team lives in
`src/data/site.ts` — edit there and rebuild, not in the page files.

## Forms

Both the contact form and the boiler-survey form post to one endpoint, set once:

```bash
cp .env.example .env
# then set PUBLIC_FORM_ENDPOINT
```

Until it is set, both forms validate normally and then tell the visitor to call
instead — they never silently swallow an enquiry. Options that suit this host:

- **Formspree** / **Web3Forms** — free tier, no server code, reliable delivery.
- **A PHP handler on Namecheap** — works out of the box, but shared-host mail
  often lands in spam. Use an SMTP-backed mailer if you go this way.

Both forms already do: real `<label>`s, real radio groups, required Name/Phone/
Postcode, lenient UK phone and postcode validation, a honeypot field, inline
errors and a success state. They also submit natively without JavaScript.

## Temporary preview on GitHub Pages

For sharing work-in-progress before launch. Publishes to
`https://<owner>.github.io/<repo>/`.

```bash
npm run build:preview     # build + rewrite for the sub-path, locally
```

Pushing to `main` runs `.github/workflows/preview.yml`, which does the same build
and deploys it. Turn it on once, in the repo: **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

`scripts/make-preview.mjs` runs after the normal build and:

- prefixes every root-relative URL in the HTML and CSS with the base path, taken
  from the repo name, so a project-page sub-path works;
- adds `noindex, nofollow` to every page and a disallow-all `robots.txt` — an
  unfinished site for a real business must not be indexed, or compete with
  okplumbing.co.uk as duplicate content;
- drops the canonical, `og:url` and sitemap, which all point at the live domain;
- writes `.nojekyll`. Without it GitHub Pages runs Jekyll, which silently skips
  directories starting with an underscore — the whole of `_astro/` (every
  stylesheet, font and image) would 404;
- removes `.htaccess`, which is Apache-only and does nothing on Pages.

**It is a post-build step on purpose.** Nothing in `src/` knows about the
preview, so the Namecheap build is byte-identical to what it would be otherwise.
When the preview is retired, delete the script, the workflow and the
`build:preview` entry in `package.json` — nothing else has to be unpicked.

Two things to know about a Pages preview: the site is **publicly reachable by
anyone with the link** even if the repo is private (private Pages needs
Enterprise), and the forms still have no endpoint, so testers will be told to
call rather than having a message delivered.

## Testing

```bash
npm run build && npm run preview   # one terminal
npm test                           # another
```

Browser tests cover routes and links, both forms, the mobile drawer and call bar,
accessibility (axe-core at two viewports), contrast, 12 viewport widths, SEO and
structured data, plus a crawl through real Apache with the `.htaccess` active.
See `tests/README.md`, including the two known false positives.

## Structure

```
brand/                  logo source files and exports (not published)
public/
  ok-logo.svg           one-line lockup — header and footer
  ok-logo-stacked.svg   two-line lockup — header below 861px
  favicon.svg
src/
  data/site.ts          all business facts and copy — the one place to edit content
  layouts/Base.astro    <head>, SEO, LocalBusiness schema, global chrome
  components/
    Icon.astro          the six service icons + phone, inline SVG, final
    Photo.astro         photo slot: real image if present, captioned placeholder if not
    GasSafeMark.astro   Gas Safe logo slot
    TopBar.astro        slim bar above the header: hours, Gas Safe, rating
    Map.astro           Google Maps embed, pinned on central London
    Header.astro        sticky header + mobile drawer
    FormShell.astro     endpoint, honeypot, status + success states
  scripts/forms.ts      validation and submit handling
  styles/global.css     design tokens mapped into Tailwind's theme
  assets/photos/        drop-in photography (see CREDITS.md)
  pages/                the five routes
tests/                  browser test suite (see tests/README.md)
```

## What is still a placeholder

Everything below is marked with a `TODO` in the source.

- **Gas Safe registration number** — `BUSINESS.gasSafeNumber` is `null`. The
  handoff's `512345` is not this business's number, so it has been taken off the
  site rather than shipped; the register was searched three ways on 16 September
  2026 without a match (see `CREDITS.md`). Every place that would print it now
  reads plain "Gas Safe registered". Set the real number in `src/data/site.ts`
  and it returns to the top bar, trust strip, mobile drawer, footer and
  terms page at once.
- **The Gas Safe mark itself is in and rendering** — `public/gas-safe.svg`, a
  vector trace of the official artwork from Gas Safe Register's own asset host.
  Swap in the licensed pack from the client's Gas Safe business portal by
  dropping it at `src/assets/gas-safe.(svg|png|jpg)`; it takes over with no code
  change. Provenance in `CREDITS.md`.
- **Google reviews — now real.** Read off the live Google Business Profile on
  16 September 2026: **5.0 from 37 reviews**. Thirteen real reviews are in
  `REVIEWS` in `src/data/site.ts`, verbatim; the home page shows the first three,
  so reorder that list to change which appear. `aggregateRating` structured data
  now emits, because there is a genuine count behind it. Re-check the figures
  before launch — the count moves.
- **Team names, roles and bios** — names and roles match the current site
  (Sam, Yaz, Monica); the one-line bios came from the handoff. Confirm all of it.
- **Photography** — see `CREDITS.md`. Two slots currently imply things that are
  not true and should be replaced first.
- **The logo wordmark** — the mark is traced from the client's own artwork, but
  "Plumbing and Heating" is a typeface match, not the original letters. If the
  designer's vector file turns up, the wordmark can be matched exactly. See
  `CREDITS.md`.
- **Privacy and Terms pages** — they state only what is factually true of the site
  as built. A full GDPR privacy notice and terms of business need to come from the
  client or their solicitor.
- **Maps — done.** `Map.astro` embeds Google Maps on the home coverage section
  and the contact page, pinned on central London at zoom 11 (Harrow to Greenwich
  in frame). It loads with the page.
  Set `PUBLIC_GOOGLE_MAPS_KEY` in `.env` to use the official Maps Embed API; with
  no key it falls back to the keyless embed, which works but is not a supported
  Google API, so get a key before launch.
  **Cookie note:** the iframe loads Google on page view and Google sets its own
  cookies. The site has no cookie banner, so this is the one thing a banner would
  need to cover if the client ever adds one.
- **No street address is published.** This is a service-area business, so the
  footer, contact page and structured data carry locality and coverage only — no
  street, postcode or geo point. `BUSINESS.address` in `src/data/site.ts` holds
  just locality/region/country. Two knock-ons worth knowing: the privacy page now
  offers a correspondence address on request rather than printing one (a UK GDPR
  notice normally names one, so check that with the client), and a Google Business
  Profile must be switched to "service area" for the listing to match the site.

## Decisions worth knowing

- **No emergency call-out anywhere on the site.** The business does not offer it,
  so it is not advertised: the seventh service was removed (six remain), the top
  bar now shows opening hours instead of a 24/7 line, the "60 min average
  emergency arrival" stat is gone, the "Are you really available 24/7?" FAQ was
  replaced with an opening-hours one, and the out-of-hours rate clause was taken
  out of Terms. The phone is labelled plainly as "Call us", with the hours beside
  it. The `emergency` service icon and photo were deleted with the service.

- **No prices anywhere.** The client quotes on survey only; the boiler FAQ answers
  the cost question by describing the survey-and-fixed-quote process instead.
- **Air conditioning is install-only** — split/multi-split and ducted. No
  servicing, regas, heat pumps or F-Gas claims.
- **Orange buttons use dark `#0E1621` text, not white.** This is deliberate: it is
  what clears 4.5:1 contrast on `#F2701D`.
- **One breakpoint, at 860px.** Everything else is fluid — `auto-fit` grids and
  `clamp()` type. Below 860px: hamburger drawer and the fixed Call now / Free
  quote bar.
- **Two facts on the site disagree with Google.** Google lists Saturday hours as
  9am–6pm; the site says 9am–2pm (from the handoff). Google also categorises the
  business as "Gas installation service". Worth reconciling — whichever is right,
  the two should match.
- **Manrope is self-hosted** via `@fontsource-variable/manrope`. No Google Fonts
  request at runtime.
- **The logo is vector and has no background**, so one file serves the white
  header and the dark footer. The wordmark is outlined, so no font is needed to
  render it.
- **The service icons are the handoff's own inline SVGs**, extracted into
  `Icon.astro`. No icon library, so nothing to license.

## Accessibility and SEO

- Visible focus rings on everything focusable, a skip link, semantic headings,
  `aria-expanded` on the hamburger, focus trapped in the open drawer, Escape to
  close.
- Unique `<title>` and meta description per page, canonical URLs, `sitemap-index.xml`,
  `robots.txt`, `Plumber`/LocalBusiness structured data with address, phone, hours
  and area served, `BreadcrumbList` on the boilers page and `FAQPage` on the home FAQ.
- `tel:` links carry `data-track="call"` so call tracking can hook them — they are
  the primary conversion on this site.
