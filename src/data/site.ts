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

export interface Service {
  /** 01–07, as printed on the cards and service rows. */
  number: string;
  name: string;
  icon: IconName;
  /** Short copy used on the home page card grid. */
  cardBody: string;
  /** Long copy used on the /services rows. */
  rowBody: string;
  href: string;
  linkLabel: string;
  photoCaption: string;
  /** Slug for the drop-in photo under src/assets/photos. */
  photoSlug: string;
  /** Alt text describing what the photo actually shows. */
  photoAlt: string;
}

export const SERVICES: Service[] = [
  {
    number: '01',
    name: 'Boiler Installation & Repairs',
    icon: 'boiler',
    cardBody:
      'Combi, system and conventional boilers supplied, swapped and serviced. Up to 10-year manufacturer warranty on new installs.',
    rowBody:
      'Combi, system and conventional boilers from Worcester Bosch, Vaillant, Ideal, Baxi and Glow-worm. Full replacements, breakdown repairs, annual services and landlord certificates. Most swaps are finished in a day with up to 10 years of manufacturer warranty registered before we leave.',
    href: '/services/boiler-installation-repairs/',
    linkLabel: 'See boiler services',
    photoCaption: 'photo — new combi installed',
    photoSlug: 'service-boiler',
    photoAlt: 'A heating engineer working on pipework in a home',
  },
  {
    number: '02',
    name: 'Central Heating Systems',
    icon: 'heating',
    cardBody:
      'Full system design and installation, radiator upgrades, powerflushing and smart controls for cold rooms and high bills.',
    rowBody:
      'New system design and installation, radiator replacement and additions, thermostatic valves, powerflushing and smart control fitting. If rooms are cold or bills have crept up, we test the system first and tell you what will actually change it.',
    href: '/services/',
    linkLabel: 'More detail',
    photoCaption: 'photo — radiator & smart thermostat',
    photoSlug: 'service-heating',
    photoAlt: 'A panel radiator fitted beneath a window',
  },
  {
    number: '03',
    name: 'Plumbing Repairs',
    icon: 'plumbing',
    cardBody:
      'Leaks, burst pipes, blockages, dripping taps, failed cylinders and toilet repairs — traced, fixed and tested the same visit.',
    rowBody:
      'Leaks traced without taking a wall apart where we can, burst pipes, blocked sinks and drains, dripping taps, failed cylinders, toilets and overflows. Most jobs are diagnosed and fixed on the first visit and tested with you before we pack up.',
    href: '/services/',
    linkLabel: 'More detail',
    photoCaption: 'photo — pipework repair under sink',
    photoSlug: 'service-plumbing',
    photoAlt: 'A plumber repairing pipework under a basin',
  },
  {
    number: '04',
    name: 'System Maintenance',
    icon: 'maintenance',
    cardBody:
      'Annual boiler services, landlord gas safety certificates and planned maintenance contracts that keep warranties valid.',
    rowBody:
      'Annual boiler services on any make, CP12 landlord gas safety certificates issued on the day, and planned maintenance contracts for landlords and agents with scheduled renewals and one consolidated invoice.',
    href: '/services/',
    linkLabel: 'More detail',
    photoCaption: 'photo — service check & paperwork',
    photoSlug: 'service-maintenance',
    photoAlt: 'An engineer completing a checklist on a clipboard',
  },
  {
    number: '05',
    name: 'Bathroom Installations',
    icon: 'bathroom',
    cardBody:
      'Full bathroom fit-outs, wet rooms and cloakrooms — first fix to final seal, coordinated with tiling and electrics.',
    rowBody:
      'Full bathroom fit-outs, wet rooms, en-suites and cloakrooms. We handle first fix to final seal and coordinate tiling and electrics, so one team is accountable for the whole room.',
    href: '/services/',
    linkLabel: 'More detail',
    photoCaption: 'photo — finished bathroom',
    photoSlug: 'service-bathroom',
    photoAlt: 'A finished modern bathroom with a walk-in shower',
  },
  {
    number: '06',
    name: 'Air Conditioning Installation',
    icon: 'aircon',
    cardBody:
      'Split and multi-split systems for homes and offices, plus ducted installations. Free site survey before we quote.',
    rowBody:
      'Split and multi-split systems for homes and offices, plus ducted installations where the layout suits it. We survey the property free of charge, size the units properly and quote a fixed price for the install.',
    href: '/services/',
    linkLabel: 'More detail',
    photoCaption: 'photo — wall unit install, living room',
    photoSlug: 'service-aircon',
    photoAlt: 'A wall-mounted air conditioning unit in a home',
  },
];

/** Air conditioning scope — split/multi-split and ducted only. No servicing, regas or heat pumps. */
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

export const FOOTER_SERVICE_LINKS = [
  { label: 'Boiler installation', href: '/services/boiler-installation-repairs/' },
  { label: 'Central heating', href: '/services/' },
  { label: 'Plumbing repairs', href: '/services/' },
  { label: 'Servicing', href: '/services/' },
  { label: 'Bathrooms', href: '/services/' },
  { label: 'Air conditioning', href: '/services/' },
] as const;

export const FOOTER_COMPANY_LINKS = [
  { label: 'About us', href: '/about/' },
  { label: 'Our team', href: '/about/#team' },
  { label: 'Areas covered', href: '/#coverage' },
  { label: 'Contact', href: '/contact/' },
] as const;
