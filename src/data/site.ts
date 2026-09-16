/**
 * Single source of truth for business facts, navigation and service copy.
 * Every phone number, address and paragraph here comes from the approved
 * design handoff / the existing okplumbing.co.uk site. Nothing is invented.
 *
 * NOTE: no prices appear anywhere on this site. The client quotes on survey only.
 */

export const SITE_URL = 'https://okplumbing.co.uk';

export const BUSINESS = {
  name: 'OK Plumbing and Heating',
  shortName: 'OK Plumbing',
  established: 2010,
  yearsLabel: '15+',
  /** Main mobile. */
  mobile: { display: '07444 419144', tel: '+447444419144' },
  landline: { display: '020 8811 2551', tel: '+442088112551' },
  email: 'info@okplumbing.co.uk',
  /**
   * No street address by deliberate choice — this is a service-area business.
   * Engineers travel to the customer, the registered address is residential, and
   * publishing it invites post and doorstep callers rather than bookings.
   *
   * The structured data in `Base.astro` follows the same shape: locality, region
   * and country only, with `areaServed` carrying the real information. That is
   * Google's documented pattern for a business that serves customers at their
   * premises, and it stays valid without a `streetAddress` or `geo`.
   */
  address: {
    locality: 'London',
    region: 'England',
    country: 'GB',
  },
  hours: {
    weekday: 'Mon–Fri 8am–6pm',
    saturday: 'Sat 9am–2pm',
    closed: 'Closed Sundays and bank holidays',
  },
  // TODO: set the real Gas Safe registration number before launch. Sam can read it
  // off the Gas Safe business portal dashboard, or Gas Safe will confirm it by email
  // (register@gassaferegister.co.uk).
  //
  // Deliberately null, not a placeholder: the handoff's `512345` is not this
  // business's number, and a registration number is the thing customers are told to
  // check before letting anyone touch their gas. Every place that shows it degrades
  // to a plain "Gas Safe registered" while this is null, so nothing false ships.
  // Set it here and the number reappears in the top bar, trust strip, mobile
  // drawer, footer and terms page at once.
  gasSafeNumber: null as string | null,
  // Read off the live Google Business Profile ("Ok Plumbing and Heating",
  // on 16 September 2026: 5.0 from 37 reviews.
  // Re-check before launch — the count moves, and aggregateRating structured data
  // is only emitted while a real count is set here.
  rating: { value: '5.0', count: 37 as number | null, source: 'Google' },
  coverage: 'All 32 London boroughs',
} as const;

export const CONTACT_ROUTE = '/contact/';

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Boilers', href: '/services/boiler-installation-repairs/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export type IconName =
  | 'boiler'
  | 'heating'
  | 'plumbing'
  | 'maintenance'
  | 'bathroom'
  | 'aircon';

/**
 * One job we do. `note` is for anything a customer should know before calling —
 * used sparingly, because a list of caveats reads as hedging.
 */
export interface ServiceItem {
  name: string;
  /**
   * Optional sub-heading, e.g. 'Installation' / 'Repairs'. These are the labels
   * people actually search and click ("plumbing repairs", "air conditioning
   * maintenance"), so a long list is grouped under them rather than run flat.
   * Groups render in first-appearance order; ungrouped items render first.
   */
  group?: string;
  note?: string;
}

/**
 * A service category. Each renders a card on the home page and its own page at
 * `href`, which lists the work split domestic / commercial, plus any specialised
 * jobs that people search for by name.
 */
export interface ServiceCategory {
  number: string;
  name: string;
  /** Short name for nav and breadcrumbs. */
  shortName: string;
  icon: IconName;
  href: string;
  /** Home page card copy. */
  cardBody: string;
  /** Category page lede. */
  intro: string;
  /** SEO title and description for the category page. */
  title: string;
  description: string;
  domestic: ServiceItem[];
  commercial: ServiceItem[];
  /** Named jobs people search for directly. */
  specialised?: ServiceItem[];
  photoCaption: string;
  /** Slug for the drop-in photo under src/assets/photos. */
  photoSlug: string;
  /** Alt text describing what the photo actually shows. */
  photoAlt: string;
}

/*
 * TODO — three items below need a certificate confirmed before launch. They are
 * marked with `note` so nothing silently over-claims:
 *   1. AC servicing, repairs and refrigerant work  -> F-Gas (C&G 2079 or equiv.)
 *   2. Commercial gas and catering appliances      -> CODNCO1 / COMCAT
 *   3. Unvented hot water cylinders                -> G3
 * Confirm, then delete the note. If any is not held, delete the item instead.
 */

export const SERVICES: ServiceCategory[] = [
  {
    number: '01',
    name: 'Boilers & Heating',
    shortName: 'Heating',
    icon: 'boiler',
    href: '/services/heating/',
    cardBody:
      'Boilers fitted, repaired and serviced, full central heating systems, underfloor heating and smart controls.',
    intro:
      'From a boiler that will not fire to a whole system designed from scratch. Every gas job is done by a Gas Safe registered engineer, quoted in writing first.',
    title: 'Boiler & Central Heating Engineers in London | OK Plumbing',
    description:
      'Gas Safe boiler installation, repair and servicing across London. Central heating systems, radiators, underfloor heating, power flushing and smart controls.',
    domestic: [
      { name: 'Boiler installation and replacement', group: 'Installation' },
      { name: 'Combi, system, conventional and open-vent boilers', group: 'Installation' },
      { name: 'Condensing and high-efficiency boiler upgrades', group: 'Installation' },
      { name: 'Boiler breakdown repairs', group: 'Repairs' },
      { name: 'Annual boiler servicing, any make', group: 'Servicing & maintenance' },
      { name: 'Central heating system design and installation', group: 'Installation' },
      { name: 'Central heating servicing and repairs', group: 'Servicing & maintenance' },
      { name: 'Radiator installation, replacement and additions', group: 'Installation' },
      { name: 'Radiator balancing', group: 'Servicing & maintenance' },
      { name: 'Heated towel rails', group: 'Installation' },
      { name: 'Underfloor heating installation', group: 'Installation' },
      { name: 'Thermostats and smart heating controls', group: 'Installation' },
      { name: 'Thermostatic radiator valves', group: 'Installation' },
      { name: 'Power flushing', group: 'Servicing & maintenance' },
      { name: 'Heating pipework repairs', group: 'Repairs' },
      { name: 'Hot water cylinder installation and repair', group: 'Installation', note: 'unvented cylinders — G3 to confirm' },
      { name: 'Pressure and circulation fault diagnosis', group: 'Repairs' },
      { name: 'Heating system diagnostics and troubleshooting', group: 'Repairs' },
      { name: 'Heating performance and efficiency optimisation', group: 'Servicing & maintenance' },
      { name: 'Radiator and pipework inspection', group: 'Servicing & maintenance' },
    ],
    commercial: [
      { name: 'Commercial boiler installation and replacement', note: 'commercial gas tickets to confirm' },
      { name: 'Commercial boiler servicing and repair', note: 'commercial gas tickets to confirm' },
      { name: 'Heating pipework for larger premises' },
      { name: 'System pressure testing and balancing' },
      { name: 'Commercial hot water cylinders and tanks' },
      { name: 'Heating controls and thermostats' },
      { name: 'Planned maintenance contracts' },
    ],
    specialised: [
      {
        name: 'Central heating survey',
        note: 'a standard homebuyer survey does not assess the heating system — this one does',
      },
      { name: 'Power flush' },
      { name: 'Underfloor heating' },
    ],
    photoCaption: 'photo — new combi installed',
    photoSlug: 'service-boiler',
    photoAlt: 'A heating engineer working on pipework in a home',
  },
  {
    number: '02',
    name: 'Plumbing',
    shortName: 'Plumbing',
    icon: 'plumbing',
    href: '/services/plumbing/',
    cardBody:
      'Leaks, burst pipes and blockages fixed, and taps, showers, toilets, pumps and appliances fitted properly first time.',
    intro:
      'The everyday work, done properly. Most jobs are diagnosed and fixed on the first visit and tested with you before we pack up.',
    title: 'Plumbers in London | Repairs & Installation | OK Plumbing',
    description:
      'London plumbers for leaks, burst pipes, blockages and repairs, plus taps, showers, toilets, pumps, water softeners and appliance installation. Fixed written quotes.',
    domestic: [
      { name: 'Leaks traced and repaired', group: 'Repairs' },
      { name: 'Burst pipes', group: 'Repairs' },
      { name: 'Blocked sinks, basins and internal drains', group: 'Repairs' },
      { name: 'Main drain and sewer line clearance', group: 'Repairs' },
      { name: 'Dripping taps and worn washers', group: 'Repairs' },
      { name: 'Toilet repairs and flush mechanisms', group: 'Repairs' },
      { name: 'Overflows', group: 'Repairs' },
      { name: 'Fitting taps, sinks, basins and toilets', group: 'Installation' },
      { name: 'Shower installation and repairs', group: 'Installation' },
      { name: 'Shower valve and cartridge replacement', group: 'Repairs' },
      { name: 'Shower and mains boosting pumps', group: 'Installation' },
      { name: 'Appliance installation — washing machines, dishwashers, plumbed fridges', group: 'Installation' },
      { name: 'Water softeners and filtration', group: 'Installation' },
      { name: 'Water meter installation and repair', group: 'Installation' },
      { name: 'Stopcock and isolation valve replacement', group: 'Installation' },
      { name: 'Homebuyer plumbing survey', group: 'Surveys & maintenance' },
      { name: 'Planned and reactive maintenance', group: 'Surveys & maintenance' },
    ],
    commercial: [
      { name: 'Commercial kitchen plumbing installation' },
      { name: 'Grease trap installation and maintenance' },
      { name: 'Backflow prevention testing and installation' },
      { name: 'Industrial sinks and basins' },
      { name: 'Commercial-grade toilets and washrooms' },
      { name: 'Water pressure testing and balancing' },
      { name: 'Main drain and sewer clearance' },
      { name: 'Commercial and domestic fit-outs' },
      { name: 'Planned maintenance contracts' },
    ],
    specialised: [
      { name: 'Water conditioning and limescale treatment' },
      { name: 'Boiling, chilled and filtered taps' },
      { name: 'Food waste disposal units' },
    ],
    photoCaption: 'photo — pipework repair under sink',
    photoSlug: 'service-plumbing',
    photoAlt: 'A plumber repairing pipework under a basin',
  },
  {
    number: '03',
    name: 'Leak Detection',
    shortName: 'Leak detection',
    icon: 'heating',
    href: '/services/leak-detection/',
    cardBody:
      'Hidden leaks found without taking the house apart — thermal imaging, acoustic tracing and tracer gas, then the repair.',
    intro:
      'A leak you cannot see is the expensive kind. We locate it first and open up only where we have to, then repair it and tell you what caused it.',
    title: 'Leak Detection in London | Non-Invasive | OK Plumbing',
    description:
      'Non-invasive leak detection across London — thermal imaging, acoustic tracing and tracer gas for water, gas and drain leaks. Located, repaired and reported.',
    domestic: [
      { name: 'Water leak detection', group: 'Detection' },
      { name: 'Gas leak detection', group: 'Detection' },
      { name: 'Drain and sewer leak detection', group: 'Detection' },
      { name: 'Hidden leaks in walls, floors and ceilings', group: 'Detection' },
      { name: 'Underground pipe leaks', group: 'Detection' },
      { name: 'Central heating leak detection', group: 'Detection' },
      { name: 'Moisture and damp assessment', group: 'Detection' },
      { name: 'Non-invasive leak investigation', group: 'Detection' },
      { name: 'Preventative leak inspections', group: 'Repair & prevention' },
      { name: 'Pressure testing and diagnostics', group: 'Detection' },
      { name: 'Targeted repair with minimal disruption', group: 'Repair & prevention' },
      { name: 'Written findings and recommendations', group: 'Repair & prevention' },
      { name: 'Damage prevention and drying advice', group: 'Repair & prevention' },
    ],
    commercial: [
      { name: 'Concealed leaks in commercial buildings' },
      { name: 'Leak detection in large plumbing and heating systems' },
      { name: 'Underground pipe leak detection' },
      { name: 'Moisture mapping and damp investigation' },
      { name: 'System pressure testing and diagnostics' },
      { name: 'Preventative inspections' },
    ],
    specialised: [
      { name: 'Thermal imaging' },
      { name: 'Acoustic leak tracing' },
      { name: 'Tracer gas' },
    ],
    photoCaption: 'photo — engineer tracing a leak, thermal camera or acoustic kit',
    photoSlug: 'service-leak-detection',
    photoAlt: 'An engineer locating a concealed leak',
  },
  {
    number: '04',
    name: 'Gas Safety',
    shortName: 'Gas safety',
    icon: 'maintenance',
    href: '/services/gas-safety/',
    cardBody:
      'Landlord CP12 certificates, annual safety checks, gas appliance installation and carbon monoxide alarms.',
    intro:
      'Gas is the part of this job where paperwork and competence matter most. Certificates are issued on the day and emailed the same evening.',
    title: 'Gas Safety Checks & CP12 Certificates in London | OK Plumbing',
    description:
      'Gas Safe registered engineers in London for CP12 landlord certificates, annual gas safety checks, gas appliance installation and carbon monoxide alarms.',
    domestic: [
      { name: 'CP12 landlord gas safety certificates', group: 'Certification' },
      { name: 'Annual gas safety checks', group: 'Certification' },
      { name: 'Gas appliance installation — cookers, hobs and fires', group: 'Installation' },
      { name: 'Gas appliance servicing and repair', group: 'Servicing & repair' },
      { name: 'Gas detector and carbon monoxide alarm installation', group: 'Installation' },
      { name: 'Gas meter box replacement', group: 'Installation' },
      { name: 'Safe connection and commissioning of gas systems', group: 'Installation' },
      { name: 'Gas pipework installation and alteration', group: 'Installation' },
    ],
    commercial: [
      { name: 'Commercial gas safety certification', note: 'commercial gas tickets to confirm' },
      { name: 'Commercial gas appliance installation and testing', note: 'COMCAT to confirm' },
      { name: 'Catering appliance installation and safety testing', note: 'COMCAT to confirm' },
      { name: 'Planned maintenance contracts for landlords and agents' },
      { name: 'Portfolio CP12 renewals on one invoice' },
    ],
    photoCaption: 'photo — service check & paperwork',
    photoSlug: 'service-maintenance',
    photoAlt: 'An engineer completing a checklist on a clipboard',
  },
  {
    number: '05',
    name: 'Bathrooms & Kitchens',
    shortName: 'Bathrooms',
    icon: 'bathroom',
    href: '/services/bathrooms-kitchens/',
    cardBody:
      'Full bathroom and kitchen fit-outs, wet rooms and cloakrooms — first fix to final seal, one team accountable.',
    intro:
      'We handle the whole room rather than the plumbing alone, and coordinate tiling and electrics so there is one team answerable for the finish.',
    title: 'Bathroom & Kitchen Installation in London | OK Plumbing',
    description:
      'Full bathroom and kitchen installations across London — wet rooms, en-suites and cloakrooms, first fix to final seal, with tiling and electrics coordinated.',
    domestic: [
      { name: 'Full bathroom installation' },
      { name: 'Wet rooms' },
      { name: 'En-suites and cloakrooms' },
      { name: 'Kitchen plumbing installation' },
      { name: 'Kitchen appliance plumbing' },
      { name: 'Sanitaryware and brassware fitting' },
      { name: 'Shower enclosures and trays' },
      { name: 'First fix to final seal' },
      { name: 'Tiling and electrics coordinated' },
    ],
    commercial: [
      { name: 'Washroom installation and refurbishment' },
      { name: 'Commercial kitchen fit-outs' },
      { name: 'Multi-unit and portfolio refurbishment' },
    ],
    photoCaption: 'photo — finished bathroom',
    photoSlug: 'service-bathroom',
    photoAlt: 'A finished modern bathroom with a walk-in shower',
  },
  {
    number: '06',
    name: 'Air Conditioning',
    shortName: 'Air conditioning',
    icon: 'aircon',
    href: '/services/air-conditioning/',
    cardBody:
      'Split, multi-split and ducted systems installed, serviced and repaired for homes and offices. Free survey first.',
    intro:
      'We survey the property free of charge, size the units properly and quote a fixed price — then keep the system running afterwards.',
    title: 'Air Conditioning Installation & Servicing in London | OK Plumbing',
    description:
      'Air conditioning across London — split, multi-split and ducted installation for homes and offices, plus servicing, repairs and efficiency checks. Free survey.',
    domestic: [
      { name: 'Split and multi-split installation', group: 'Installation' },
      { name: 'Ducted system installation', group: 'Installation' },
      { name: 'System replacement and upgrades', group: 'Installation' },
      { name: 'Servicing and planned maintenance', group: 'Servicing & maintenance', note: 'F-Gas certification to confirm' },
      { name: 'Fault diagnosis and repair', group: 'Repairs', note: 'F-Gas certification to confirm' },
      { name: 'Refrigerant and operational checks', group: 'Servicing & maintenance', note: 'F-Gas certification to confirm' },
      { name: 'Cooling and airflow fault diagnosis', group: 'Repairs' },
      { name: 'Airflow cleaning and efficiency optimisation', group: 'Servicing & maintenance' },
      { name: 'Smart thermostat and climate control integration', group: 'Installation' },
      { name: 'Free site survey and fixed quote', group: 'Installation' },
    ],
    commercial: [
      { name: 'Office and retail installation' },
      { name: 'Multi-zone systems for larger buildings' },
      { name: 'Planned preventative maintenance' },
      { name: 'Fault diagnosis and repair', group: 'Repairs', note: 'F-Gas certification to confirm' },
      { name: 'Energy-efficiency upgrades' },
      { name: 'Climate control and smart system integration' },
    ],
    photoCaption: 'photo — wall unit install, living room',
    photoSlug: 'service-aircon',
    photoAlt: 'A wall-mounted air conditioning unit in a home',
  },
];

export const AIRCON_CHIPS = [
  'Split & multi-split',
  'Ducted systems',
  'Home & office',
  'Free survey',
] as const;

export const BOROUGH_CHIPS = [
  'Hammersmith & Fulham',
  'Kensington & Chelsea',
  'Ealing',
  'Westminster',
  'Camden',
  'Wandsworth',
  'Brent',
  '+ 25 more',
] as const;

export const STEPS = [
  {
    eyebrow: 'Step one',
    title: 'You call or book online',
    body: 'Tell us what is happening. We book you in for the first slot that suits you, usually within 48 hours.',
  },
  {
    eyebrow: 'Step two',
    title: 'We diagnose and quote',
    body: 'An engineer inspects, explains the options in plain English and gives you a fixed written price.',
  },
  {
    eyebrow: 'Step three',
    title: 'Work done, site left clean',
    body: 'We complete the work, test it with you, hand over certificates and take the mess with us.',
  },
] as const;

export const PROMISES = [
  {
    number: '01',
    title: 'Fixed quotes, given in writing',
    body: 'The price we quote is the price you pay. No hourly creep.',
  },
  {
    number: '02',
    title: 'Gas Safe registered engineers',
    body: 'Registered, fully insured and DBS checked. Certificates issued on the day.',
  },
  {
    number: '03',
    title: '12-month workmanship guarantee',
    body: 'If something we fitted fails, we come back and put it right.',
  },
] as const;

/**
 * Real reviews from the Google Business Profile for "Ok Plumbing and Heating"
 * read on 16 September 2026.
 * Every one is 5 stars. Text is verbatim — do not tidy the spelling, it is the
 * customer's own wording.
 *
 * The home page shows the first three. To change which appear, reorder this list.
 * `meta` is the job type taken from what the review itself describes — no
 * locations are shown, because Google does not publish the reviewer's borough.
 */
export const REVIEWS = [
  {
    quote:
      'Great service from OK Plumbing. They replaced our kitchen tap and fitted a new isolation valve to solve the issue with the old seized stopcock. The work was done professionally and everything is now working perfectly. Very pleased with the job and would definitely use them again. Highly recommended.',
    name: 'Dawei Long',
    meta: 'Tap replacement',
    when: 'a week ago',
  },
  {
    quote:
      'Plumber Sam is absolute lifesaver! Quick response, impeccable service and fair pricing. Fix my plumbing issues several times with ease and even took the time to explain everything. Professional, friendly a highly recommended!',
    name: 'Marija Berni',
    meta: 'Plumbing repairs',
    when: '2 years ago',
  },
  {
    quote:
      'I called in OK Plumbing for a boiler service. They were punctual and prompt to my query. Their prices were very competitive, Usama was friendly and went out of his way to make sure everything is ok before leaving. I had full confidence in their abilities and advice. Will continue to use for any future boiler services or plumbing work.',
    name: 'naiem matar',
    meta: 'Boiler service',
    when: '5 years ago',
  },
  {
    quote:
      'Absolutely amazing service! So helpful and made time for me on such short notice - a lifesaver! Fixed our leaking kitchen sink like an absolute pro and so efficiently! I can highly recommend Ok Plumbing And Heating!',
    name: 'Lauren Smithie',
    meta: 'Leak repair',
    when: '2 years ago',
  },
  {
    quote:
      'Great service, made time to help me out, friendly, and took time to make sure the job was done right, and a very fair price. Highly recommended!',
    name: 'Iain Skelton',
    meta: 'General plumbing',
    when: '2 years ago',
  },
  {
    quote:
      'Sam was polite and professional, he found a slot during a busy day too help me fix my boiler during a cold winter day',
    name: 'dario nanni',
    meta: 'Boiler repair',
    when: '3 years ago',
  },
  {
    quote:
      'Sam came to fix a problem with a nest installation gone wrong, he was very knowledgable and efficient, he came out the same day I called and was very polite and respectful. I would highly recommend his services!',
    name: 'Huda Jawad',
    meta: 'Smart thermostat',
    when: '5 years ago',
  },
  {
    quote:
      'Very trustworthy,polite and knows what he is doing, also did a great job, No more leaks and when he installed the boiler we had it done within a day, so we had the heating and hot water working which was great. Thanks to Sam@okpluming Will be surely using him again.!',
    name: 'Mayur Patel',
    meta: 'Boiler installation',
    when: '5 years ago',
  },
  {
    quote:
      'Professional, well mannered, polite service. Would recommend to family and friends. Great and timely service. Will definitely reach out to this company again. Very aware of current COVID social distancing situation and made me feel comfortable.',
    name: 'Isabella Jee',
    meta: 'General plumbing',
    when: '5 years ago',
  },
  {
    quote:
      'Prompt, polite and knowledgeable work carried out with full explanation and at a reasonable cost. Highly recommended.',
    name: 'Margaret Hancock',
    meta: 'General plumbing',
    when: '5 years ago',
  },
  {
    quote:
      'I have used Ok plumbing and it\u2019s a very good quality work at a reasonable cost I highly recommend it also very polite and on time.',
    name: 'Julie Rabzz',
    meta: 'General plumbing',
    when: '5 years ago',
  },
  {
    quote:
      'Fabulous service from Sammy ..fixed my boiler in a timely manner and provided excellent technical feedback',
    name: 'Heena Amarshi',
    meta: 'Boiler repair',
    when: '5 years ago',
  },
  {
    quote: 'High recommend with ok plumbing , They do his work professionally and is accurate and clean',
    name: 'Ahmed Ghezlan',
    meta: 'General plumbing',
    when: '5 years ago',
  },
] as const;

export const FAQS = [
  {
    q: 'What are your hours?',
    a: 'Monday to Friday 8am to 6pm and Saturday 9am to 2pm. Calls in those hours reach an engineer rather than an answering service, so you get a real answer on when we can attend.',
  },
  {
    q: 'How much does a new boiler cost?',
    a: 'It depends on the property and the unit, so we quote after seeing the system. The quote is fixed and includes removal of the old boiler, fitting, commissioning and warranty registration.',
  },
  {
    q: 'Do you charge for callouts?',
    a: 'No. There is no callout charge on work we quote for — the survey and the written quote cost you nothing.',
  },
  {
    q: 'Can you service a boiler you did not fit?',
    a: 'Yes, any make. We service and repair all major brands and can take over annual servicing to keep an existing manufacturer warranty valid.',
  },
] as const;

// TODO: confirm team names, roles and bios with the client.
// Names and roles below match the current okplumbing.co.uk team section;
// the one-line bios come from the design handoff and are illustrative.
export const TEAM = [
  {
    name: 'Sam',
    role: 'Gas engineer · founder',
    bio: 'Boilers and heating systems. Started the business in 2010.',
    photoSlug: 'team-sam',
  },
  {
    name: 'Yaz',
    role: 'Plumber',
    bio: 'Leaks, bathrooms and repairs across West London.',
    photoSlug: 'team-yaz',
  },
  {
    name: 'Monica',
    role: 'Office manager',
    bio: 'Bookings, quotes and landlord certificate schedules.',
    photoSlug: 'team-monica',
  },
] as const;

export const BOILER_JOBS = [
  {
    title: 'Full boiler replacement',
    detail: 'Like-for-like swap or conversion to a combi',
    duration: '1 day',
  },
  {
    title: 'Breakdown repair',
    detail: 'Fault diagnosis, parts fitted where we carry them',
    duration: 'Same day',
  },
  {
    title: 'Annual service',
    detail: 'Any make, keeps the manufacturer warranty valid',
    duration: '45 min',
  },
  {
    title: 'Landlord gas safety certificate',
    detail: 'CP12 issued on the day, portfolios welcome',
    duration: '30 min',
  },
] as const;

export const FOOTER_SERVICE_LINKS = SERVICES.map((s) => ({
  label: s.name,
  href: s.href,
}));

export const FOOTER_COMPANY_LINKS = [
  { label: 'About us', href: '/about/' },
  { label: 'Our team', href: '/about/#team' },
  { label: 'Areas covered', href: '/#coverage' },
  { label: 'Contact', href: '/contact/' },
] as const;
