# Photography credits and replacement notes

Every photograph on the site is **the client's own**, supplied by Ahmad on
1 October 2026 from OK Plumbing and Heating's own jobs. No stock photography is
used anywhere. The previous Unsplash stand-ins have all been deleted from the
repository.

Processing applied to each one: a crop to the slot's aspect ratio, a mild
auto-levels pass (two of them were badly backlit), a small saturation and
contrast lift and an unsharp mask, then export to WebP at quality 86. Originals
are the client's; nothing was retouched beyond exposure, and nothing was added to
or removed from any frame.

Replacing one is a single step: drop a new file over the matching name in
`src/assets/photos/` and rebuild. Nothing else changes.

| File in `src/assets/photos/` | Used on | What the photograph shows |
| --- | --- | --- |
| `hero-engineer.webp` | Home hero (1:1) | Engineer beside a gas boiler with the case off, during a strip-out |
| `team-van.webp` | Home — "Why us" (1:1) | The OK Plumbing and Heating van, livery and phone number legible |
| `service-boiler.webp` | Boilers & Heating card and page | Unvented cylinder, zone valves and copper manifold in a finished plant cupboard |
| `service-plumbing.webp` | Plumbing card and page | Engineer fitting a close-coupled toilet |
| `service-leak-detection.webp` | Leak Detection card and page | Replaced underground drain run in an excavated trench |
| `service-maintenance.webp` | Gas Safety card and page | Engineer at the controls inside a gas boiler |
| `service-bathroom.webp` | Bathrooms & Kitchens card and page | Engineer fitting the waste and tap connections under a pedestal basin |
| `service-aircon.webp` | Air Conditioning card and page | Condenser unit mounted on an exterior brick wall |
| `boiler-hero.webp` | Boilers page hero (4:3) | Vaillant combi with new copper pipework on a brick wall |
| `about-team.webp` | About — "How we work" (4:3) | Engineer draining and refitting a radiator |

Alt text describes what is actually in each frame, not what the slot wishes were
there.

## Still to come

The client supplied 40 photographs; 10 are in use. The rest — more plant rooms,
cylinders, van shots and radiator work — are good enough to carry a "recent work"
gallery if one is added later.

**Faces.** Several photographs show the same engineer working. They are used in
the service and hero slots, where the alt text says only "an engineer". None is
captioned with a name, and no page names the people who work here: the team
section was removed on 18 October 2026 at the client's request, along with the
initials avatars that stood in for portraits and the ones beside the Google
reviewers. There is nothing left on the site that needs a face.

**Still empty, showing the captioned placeholder:**

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

`BUSINESS.gasSafeNumber` is **598577**, supplied by the client on 18 October 2026.

It was checked against the public register the same day, through the "Check a
business" search at gassaferegister.co.uk: the number resolves to a registered
business with status **Registered**. The design handoff's `512345` was a
placeholder and never shipped.

**One thing to know before launch.** The register lists this registration under
the owner's own name as a sole trader, not under the trading name "OK Plumbing
and Heating". That is why the September searches for the trading name came back
"we cannot find a Business with a name of…" — the business was registered the
whole time, under a different name. A customer who follows the "verify on the
register" link and searches 598577 will therefore see a name that does not match
the one on the website. Worth deciding whether the site should say so in a line
of small print; nothing on the site claims otherwise today, but the mismatch is
the kind of thing a cautious customer notices.

The register entry also carries the owner's home address and personal contact
details, as sole-trader entries do. None of that is published on this site, and
it should stay that way: the site is deliberately a service-area business with no
street address anywhere.
