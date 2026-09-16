# Test suite

Browser tests that run against the built site. Start the preview server first:

```bash
npm run build
npm run preview          # http://127.0.0.1:4321
npm test                 # in another terminal
```

| File | What it checks |
| --- | --- |
| `01-routes.mjs` | Crawls every internal link. Status codes, broken links, dead anchors, `tel:`/`mailto:` formats, console errors, failed requests, the 404 route. |
| `02-forms.mjs` | Both forms: required fields, UK phone and postcode rules against known-good and known-bad values, radio groups and defaults, keyboard selection, the honeypot, error and success states, and the no-JavaScript fallback. |
| `03-chrome.mjs` | Mobile drawer (open, Escape, focus trap, close on navigate, reset on resize), fixed call bar, sticky header, FAQ, skip link. |
| `03b-focus.mjs` | Walks the page with real Tab presses and checks every stop has a visible focus ring. |
| `03c-radio.mjs` | Confirms the styled chip shows the focus ring for its visually-hidden radio. |
| `04-a11y.mjs` | axe-core on every page at desktop and mobile, plus heading order, landmarks and colour contrast. |
| `04b-contrast.mjs` | Contrast failures grouped by colour pair, with the exact ratios. |
| `05-responsive-seo.mjs` | 12 viewport widths from 320 to 1920: overflow, tap targets, clipped text. Then titles, descriptions, canonicals, Open Graph, sitemap, robots, JSON-LD. |
| `06-apache.mjs` | Crawls the site through real Apache with `.htaccess` active — the closest thing to the Namecheap environment. |

## Known false positives

Two checks flag things that are correct by design:

- **`sr-only` elements** ("Skip to content", the hamburger's "Menu") report as 1×1 and "clipped". That is the screen-reader-only pattern working.
- **The chip and pick radio inputs** are visually hidden, so a focus-ring check on the input itself finds nothing. The ring is on the adjacent `<span>` — `03c-radio.mjs` verifies it.
