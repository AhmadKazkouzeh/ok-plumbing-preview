# Photography credits and replacement notes

All photographs currently on the site are **stand-ins** sourced from
[Unsplash](https://unsplash.com) under the
[Unsplash License](https://unsplash.com/license) — free for commercial use, no
attribution required, no licence to clear. They are here so the site does not
launch full of grey boxes; they are not photographs of OK Plumbing and Heating.

Replacing one is a single step: drop a new file over the matching name in
`src/assets/photos/` and rebuild. Nothing else changes.

| File in `src/assets/photos/` | Used on | Unsplash photo ID |
| --- | --- | --- |
| `hero-engineer.webp` | Home hero (4:5) | `photo-1620653713380-7a34b773fef8` |
| `team-van.webp` | Home — "Why us" (1:1) | `photo-1591706515036-cb0f48dc5e62` |
| `service-boiler.webp` | Services row 01 (16:10) | `photo-1676210134190-3f2c0d5cf58d` |
| `service-heating.webp` | Services row 02 (16:10) | `photo-1669725341213-7379ff6c90d5` |
| `service-plumbing.webp` | Services row 03 (16:10) | `photo-1676210133055-eab6ef033ce3` |
| `service-maintenance.webp` | Services row 04 (16:10) | `photo-1700727448575-6f1680cd7d75` |
| `service-bathroom.webp` | Services row 05 (16:10) | `photo-1584622650111-993a426fbf0a` |
| `service-aircon.webp` | Services row 06 (16:10) | `photo-1761330440311-16e160cad236` — re-cropped 16 Sept 2026; the first crop cut the top off the wall unit |
| `boiler-hero.webp` | Boilers page hero (4:3) | `photo-1749532125405-70950966b0e5` |
| `about-team.webp` | About — "How we work" (4:3) | `photo-1787672358313-4534ed75f53e` |

Any ID above resolves at `https://unsplash.com/photos/<id>` (strip the leading
`photo-`, or search the ID) and the file itself at
`https://images.unsplash.com/<id>`.

## Replace these before launch

**Priority — these imply things that are not true:**

1. `about-team.webp` and `team-van.webp` sit in slots that describe *OK Plumbing's
   own team and van*. The stock people and vehicle in them are not yours. Swap in
   real photographs, or the page is telling customers something untrue about who
   turns up.
2. `hero-engineer.webp` — replaced on 16 September 2026. The original stand-in
   showed a man in a hard hat with folded arms, which read as a construction site
   rather than a plumber. It is now a close-up of a plumber's hands tightening a
   valve on the pipework above a hot-water cylinder — unmistakably plumbing and
   heating work, and deliberately faceless so it does not imply "this is your
   engineer". A real photo of one of your own engineers at a boiler would still
   convert better.
   Photo by Marian Florinel Condruz (@gottapics),
   <https://unsplash.com/photos/C-oYJoIfgCs>.

**Still empty, showing the captioned placeholder:**

- Three team portraits — Sam, Yaz, Monica (`team-sam`, `team-yaz`, `team-monica`).
  These now show **initials avatars**, not the hatched placeholder, so the page
  looks finished. Still no stock faces: putting a stranger's photograph next to a
  real named person misrepresents who turns up. Drop a real photo into
  `src/assets/photos/team-sam.webp` (or .jpg) and it takes over automatically.
- Testimonial avatars — done, initials on a brand colour. These sit beside real
  Google reviewers' names, so a stock face would be worse here than anywhere:
  leave them as initials.
- ~~Coverage map and contact map~~ — done. Both slots now use `Map.astro`, a
  Google Maps embed pinned on central London (see README).
- ~~The official **Gas Safe Register** logo~~ — done, see "The Gas Safe Register
  mark" below. Still worth replacing with the licensed pack from the client's Gas
  Safe business portal before launch.

## Logo

The logo has been rebuilt as vector and extended to read **OK Plumbing and
Heating**. Everything lives in `brand/`; the two files the site actually serves
are copied into `public/`.

| File | What it is |
| --- | --- |
| `ok-logo.svg` | One-line lockup. Header (desktop) and footer. |
| `ok-logo-stacked.svg` | Two-line lockup. Header below 861px. |
| `ok-mark.svg` | The OK mark on its own. |
| `ok-icon.svg` | Square version — favicon, app icon, social avatar. |
| `ok-logo-*px.png`, `ok-icon-*.png` | Raster exports for email signatures, invoices, socials. |
| `ok-logo-original-supplied.png` | The client's original file, kept as the record. |

How it was made, so the decisions are auditable:

- **The mark is traced from the client's own artwork**, upscaled first so the
  curves are smooth rather than following the 404px file's stair-stepping. It
  matches the original shape to **99.4%** by pixel overlap.
- **Brand colours read off the original file**: cyan `#00AEEF`, orange `#EE6924`.
  (The site's UI palette uses `#12AEEF` / `#F2701D` from the design handoff —
  near-identical, and left as the handoff specified.)
- **"Plumbing and Heating" is set type, not traced.** The original wordmark was
  identified by rendering 33 candidate typefaces and scoring each against the
  original pixels; **Nunito Sans Regular** won. It is condensed to 91.1% so
  "Plumbing" lands on the same width the original occupies, and the wordmark is
  set **30% larger than the original**, at the client's direction, because the
  original was too small to read at header size.
- **Text is converted to outlines**, so the files render identically everywhere
  with no font to install.
- **No white background**, so the same file works on the dark footer — the old
  keyed-out PNG variant is gone.

### The one caveat

The words "and Heating" are a typeface match, not the original letters — the
supplied file is 404px wide, which is not enough resolution to identify the font
with certainty. It is very close, but it is not the same glyphs.

The filename on the live site is
`cropped-PHOTO-2018-10-11-21-59-22-removebg-preview.png`, which says the current
logo is a background-removal *preview* export of a 2018 photo. If the client can
find the designer's original vector file, or even the un-cropped upload (likely
still in the WordPress media library without the `cropped-` prefix), hand it over
and the wordmark can be matched exactly rather than approximated.


## Google reviews

The testimonials on the home page are real reviews from the Google Business
Profile for "Ok Plumbing and Heating" (Flat 2, 29 Richmond Way, London W14 0AS),
read on 16 September 2026. The profile showed **5.0 stars from 37 reviews**, and
every review on it was 5 stars.

Thirteen are stored verbatim in `REVIEWS` in `src/data/site.ts` — reviewer name,
the job type described in the review, and how long ago Google said it was posted.
The home page shows the first three, so reordering that list changes which appear.

Two things to know:

- **The text is verbatim, typos included.** Tidying a customer's wording would
  misrepresent them. If a review reads awkwardly, drop it rather than edit it.
- **No reviewer locations are shown.** The design called for "Borough · Job type",
  but Google does not publish which borough a reviewer is in, so only the job type
  appears. Nothing here is invented.

The `aggregateRating` in the structured data is driven by `BUSINESS.rating` and
only emits while a real count is set. Google's own listing carries the note
"Reviews aren't verified", which is standard for Business Profiles.


## The Gas Safe Register mark

`public/gas-safe.svg` is a vector trace of the official Gas Safe Register logo.

- **Source raster:** `https://sa-chat-assets.s3.eu-west-2.amazonaws.com/prod/capitaccm/gassafe/gassafe-logo.png`
  — 1086 × 1219, served from Gas Safe Register's own asset host and linked from
  gassaferegister.co.uk. A copy is kept at `brand/gas-safe-source.jpg`.
- **How it was made:** `brand/trace-gas-safe.py` — two potrace passes (a
  silhouette pass filled `#FEF200`, the yellow sampled from the artwork itself,
  and an ink pass for the keyline and lettering), composited with the ink on top
  so there is no hairline seam. Rendered side by side against the source at 500px
  it is indistinguishable. 13 KB, transparent background, so it scales to any
  size and needs no keyed-out variant.
- **Nothing was redrawn.** The proportions, the keyline radius, the ® and the
  letterforms are all the official artwork's own outlines.

**Before launch, replace it with the licensed artwork.** Gas Safe issues its
registered businesses a logo pack through the business portal, and the licence to
use the mark comes with registration. Drop that file in as
`src/assets/gas-safe.(svg|png|jpg)` and `GasSafeMark.astro` picks it up
automatically — no code change.

The mark is black on yellow and must not be recoloured, so on the dark footer it
sits on a white panel (`<GasSafeMark tone="dark" />`), which is what Gas Safe's
own brand guidance asks for.

### The registration number

`BUSINESS.gasSafeNumber` is deliberately `null`, not a number.

The design handoff carried `512345`. That is not this business's number. On
16 September 2026 the public register was searched three ways — "OK Plumbing and
Heating" and "OK Plumbing" by name, both returning "we cannot find a Business
with a name of…", and by postcode W14 0AS for domestic work, which returned the
50 nearest registered businesses (0.14 to 0.87 miles) with no entry at Richmond
Way. That is **not** evidence of non-registration: the register lists the
*registered* trading name and address, which for a sole trader is often the
engineer's own name and home address, and the postcode search was filtered to
domestic work.

The definitive routes are the Gas Safe business portal dashboard, or
register@gassaferegister.co.uk, who confirm a business's status on request.

While `gasSafeNumber` is `null` every place that would print it degrades to a
plain "Gas Safe registered" — top bar, trust strip, mobile drawer, footer
and terms page. Set the real number in `src/data/site.ts` and all five come back
at once.
