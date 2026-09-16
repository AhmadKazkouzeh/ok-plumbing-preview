# Service gap against jenningsph.com

Read on **16 September 2026** from jenningsph.com. Emergency call-out is excluded
throughout, as agreed. Their electrical, drainage, carpentry, roofing and
plastering trades are out of scope.

### What was actually checked

Their `page-sitemap.xml` lists **175 pages**, of which **138** sit under
plumbing / heating / gas / air-con / leak-detection. Every one was enumerated,
and they fall into two kinds:

- **20 distinct service pages** — all read in full:
  `/plumbing/`, `/heating/`, `/gas/`, `/commercial-gas/`, `/air-con/`,
  `/leak-detection/`, `/heating/central-heating/`,
  `/heating/boiler-installation-london/`, `/heating/boiler-repair-london/`,
  `/heating/central-heating-survey/`, `/heating/thermostats/`,
  `/heating/underfloor-heating/`, `/heating/powerflushing/`,
  `/gas/gas-safety-check/`, `/gas/cp12-gas-certification/`,
  `/gas/gas-detector-installation/`, `/gas/local-gas-plumbers/`,
  `/plumbing/insinkerator/`, `/plumbing/hot-water-and-filtered-taps/`,
  `/plumbing/aquabion/`.
- **118 location landing pages** — `plumber-fulham`, `boilers-chelsea`,
  `gas-safety-certificate-mayfair` and so on. Sampled several; they carry **no
  new services**, only the same trust block with an area name swapped in. They
  matter as strategy, not as scope — see section 5.

So the service list below is complete. The two pages read after the first pass
(`/heating/central-heating/` and `/gas/cp12-gas-certification/`) repeated lists
already captured and added nothing new.

Our current offer is the six services in `SERVICES` in `src/data/site.ts`.

---

## 1. Plumbing

### Already covered (different wording, no change needed)

| They say | We say |
| --- | --- |
| Leak locating and repairs | "Leaks traced without taking a wall apart where we can" |
| Tap and toilet repairs | "dripping taps… toilets and overflows" |
| Drainage and water flow issues | "blocked sinks and drains" |
| Planned and reactive maintenance | Planned maintenance contracts (service 04) |
| Bathroom plumbing installations | Bathroom Installations (service 05) |

### Gaps — domestic

- **Kitchen plumbing installations.** We name bathrooms only. Kitchens are a
  whole second room type and a high-value job.
- **Appliance installation** — washing machines, dishwashers, plumbed fridges.
- **Pump installation and replacement** — shower and mains boosting pumps.
- **Fitting taps, sinks, toilets and showers.** We cover *repairing* these but
  never say we *fit* them. That is a large volume of small jobs we are invisible for.
- **Shower system repairs and installations**, including valve cartridges. They
  give shower valves their own section on the plumbing page.
- **Water softeners and filtration.**
- **Water meter installation and repair.**
- **Homebuyer plumbing surveys.** A pre-purchase survey product.
- **Unblocking main drains and sewer lines.** We only claim sinks and internal drains.

### Gaps — specialised products (each has its own page on their site)

- **Leak detection as a named service.** This is the biggest single gap. They run
  a whole `/leak-detection/` page: thermal imaging, acoustic testing (Aquaphone
  A200), tracer gas, moisture mapping, pressure testing, underground pipe leaks,
  non-invasive investigation, damp assessments. We have one clause inside
  "Plumbing Repairs". Insurance-backed leak detection is a well-paid, high-intent
  search term.
- **Water conditioning / limescale treatment** (they sell AquaBion) — non-salt
  conditioners as an alternative to traditional softeners. London is hard-water,
  so this converts.
- **Hot water and filtered taps** — boiling, chilled and filtered tap installation.
- **Food waste disposal units** (they are an InSinkErator installer).

### Gaps — commercial

We say "domestic and commercial work across London" in one line and then describe
only domestic jobs. They have a full commercial plumbing block:

- Commercial kitchen plumbing installations
- Backflow prevention testing and installation
- Grease trap installation and maintenance
- Industrial sinks and basins
- Commercial-grade toilets
- Water pressure testing and balancing
- Leak detection and repair in large systems
- Commercial and domestic fit-outs

---

## 2. Heating

### Already covered

| They say | We say |
| --- | --- |
| Boiler installation and replacement | Service 01 |
| Boiler and heating breakdown repairs | Service 01 |
| Central heating system upgrades | Service 02 |
| Radiator installation and additions | Service 02 |
| Power flushing | Service 02 |
| Thermostats and smart heating controls | "smart control fitting", service 02 |
| Central heating servicing | Service 04 |
| System diagnostics and troubleshooting | "we test the system first" |

### Gaps

- **Underfloor heating installation.** Entirely absent from our site. They give it
  its own page. High-value, and it pairs with bathroom and kitchen work we already do.
- **Hot water cylinder installation.** We mention "failed cylinders" as a repair
  under plumbing, but never fitting one. Note: unvented cylinders need a **G3**
  qualification — confirm before publishing.
- **Towel rails.** Small, but it is what people search for.
- **Radiator balancing** as a named job, not just installation.
- **Central heating survey.** Their strongest lead product: a standalone survey
  for homebuyers and owners, sold on the basis that a standard homebuyer survey
  does not assess the heating system. Nothing equivalent on our site.

### Gaps — commercial heating

- Commercial boiler installation and replacement
- Pipework installation for large premises
- Heating system pressure testing and balancing
- Commercial hot water cylinders and tanks
- Servicing gas-fired heating appliances
- Commercial heating controls and thermostats

---

## 3. Gas

### Already covered

- CP12 landlord gas safety certificates
- Annual gas safety inspections

### Gaps

- **Gas appliance installation** — cookers, hobs, gas fires. We register as Gas
  Safe engineers but never say we fit gas appliances.
- **Gas detector and carbon monoxide alarm installation.** Their own page.
- **Gas meter box replacement** — worn or damaged boxes.
- **A gas safety section at all.** Gas is buried inside "System Maintenance" for
  us; they treat Gas Safety as a top-level category with its own page and
  supporting statistics.

### Gaps — commercial gas

- High-output commercial boiler servicing and repair
- Gas appliance installation and safety testing in professional kitchens
- Annual commercial gas certification

> **Check first.** Commercial gas work needs commercial tickets (CODNCO1 and
> related) on top of domestic ACS, and catering appliances need COMCAT. Confirm
> what is on the Gas Safe registration before any of this is published.

---

## 4. Air conditioning

### Already covered

- New installations, split and multi-split
- Ducted systems
- Free site survey

### Gaps

- **AC servicing and maintenance** — routine servicing, planned preventative
  maintenance contracts.
- **AC repairs and fault diagnosis** — cooling and airflow faults.
- **Refrigerant and operational checks.**
- **Airflow cleaning and efficiency optimisation.**
- **Smart thermostat and climate control integration** for AC specifically.
- **Multi-zone and commercial AC**, including larger buildings.
- **Energy-efficient system upgrades** as a named reason to call.

> **Check first.** This is the one category where our site currently makes a
> deliberate *negative* claim. `README.md` records the decision: "Air conditioning
> is install-only — split/multi-split and ducted. No servicing, regas, heat pumps
> or F-Gas claims." Anything touching refrigerant — servicing, regas, repairs —
> requires **F-Gas certification** (City & Guilds 2079 or equivalent). Confirm
> that certification exists before adding servicing and repair copy, and I will
> update the README decision at the same time.

---

## 5. Not services, but worth copying

Things their site does structurally that ours does not:

- **A Domestic / Commercial split inside every category.** Every service page
  divides into the two. Ours implies commercial in one sentence and then shows
  only domestic work.
- **Location landing pages at scale — this is their whole SEO strategy.** Two
  thirds of their site is `service + area` pages, and it is the single biggest
  structural difference between the two sites:

  | Pattern | Pages |
  | --- | --- |
  | `/plumbing/plumber-<area>/` | 28 |
  | `/gas/gas-safety-certificate-<area>/` | 20 |
  | `/gas/power-flush-<area>/` | 19 |
  | `/heating/boilers-<area>/`, `boiler-repair-<area>` | 12 |
  | `/gas/gas-engineer-<area>/` | 10 |
  | `/leak-detection/leak-detection-<area>/` | 10 |
  | `/drainage/drainage-<area>/` (out of scope) | 10 |
  | `/plumbing/emergency-plumber-<area>/` (excluded) | 22 |
  | **Total** | **131** |

  They are thin — a heading, a couple of paragraphs and the standard trust block.
  But they are what ranks for "plumber in Fulham". We have one coverage section
  and a list of borough chips.

  Worth knowing before copying this: thin, near-duplicate location pages are
  exactly what Google's helpful-content guidance targets, and a hundred of them
  can hurt. The safer version is fewer pages with something genuinely local on
  each — real jobs done in that borough, response times, local landmarks — which
  also needs real content from the client.
- **An "Areas we cover" page**, not just a section on the home page.
- **A published rates page.** They list rates openly. We deliberately publish no
  prices — worth a decision rather than a default.
- **A gallery of completed jobs.** Real photographs of their work, which also
  solves our stock-photo problem.
- Their guarantee block is stronger than ours on paper: 18-month workmanship
  guarantee vs our 12, boiler warranties "up to 18 years" vs our 10, and "no call
  out fee, fixed & free quotations". **Do not copy these numbers** — they are
  Jennings' terms. Only change ours if they are genuinely ours.
- **Two CTAs, not one:** "Make a Booking" and "Request a Callback". We have one
  form plus a phone number.

---

## 6. What this means for the site structure

Six flat service cards will not hold this. The gaps above are roughly **45 new
service items**, and cramming them into six cards would produce unreadable lists.

**Proposed structure**

```
/services/                     overview — four category cards
/services/plumbing/            category page, domestic + commercial + specialised
/services/heating/             category page
/services/gas-safety/          category page
/services/air-conditioning/    category page
```

with dedicated pages only for the items that are genuine search targets and
lead products:

```
/services/heating/boiler-installation/     (exists today)
/services/plumbing/leak-detection/
/services/heating/underfloor-heating/
/services/heating/power-flushing/
/services/heating/central-heating-survey/
/services/plumbing/water-conditioning/
```

**Data model change.** `SERVICES` in `src/data/site.ts` becomes categories, each
with a `domestic[]`, `commercial[]` and optional `specialised[]` list of items.
Everything that reads `SERVICES` today — the home grid, the services page, the
footer links, the mobile drawer count and the `hasOfferCatalog` structured data —
reads from the same shape, so the change is contained to one file plus the two
templates that render it.

**Structured data gets better, not worse.** `hasOfferCatalog` currently lists six
offers. With categories it lists every sub-service, which is exactly what Google
wants from a service-area business.

**Suggested order of work**

1. Confirm the three regulatory questions above (F-Gas, commercial gas, G3).
2. Restructure the data model and the services page into four categories.
3. Write the sub-service lists — the bulk of the copy.
4. Add the six specialised pages, starting with leak detection.
5. Location pages last, once the service copy is settled — and a decision on how
   many, given the thin-content risk above. The obvious first tranche is the
   highest-value service in the boroughs we are strongest in, not 131 pages.

**One caution on copy.** Everything above is a list of what *Jennings* advertises.
Their wording is theirs — the lists here are for deciding scope, not for pasting.
Each item needs confirming as something OK Plumbing actually does, and then
writing in our own voice.
