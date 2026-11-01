// All site content lives here — edit this file to update the website.

import { formatDuration, formatPeriod, yearsSince } from '@/lib/career';

export const siteUrl = 'https://jakeyabutabella.com';

// Start dates ('YYYY-MM') behind the "N years" figures. Write {yearsInIT}, {yearsInBanking}
// or {yearsAtUOB} in any text below and the current number is filled in when the page renders.
export const milestones = {
  inIT: '2005-01', // TODO: set the real month; chosen so the site keeps saying 21 years
  inBanking: '2009-06', // MUFG
  atUOB: '2015-06',
};

export function getFacts(now: Date) {
  return {
    yearsInIT: yearsSince(milestones.inIT, now),
    yearsInBanking: yearsSince(milestones.inBanking, now),
    yearsAtUOB: yearsSince(milestones.atUOB, now),
  };
}

export const profile = {
  name: 'Jake Abella',
  shortName: 'JAKE',
  title: 'Vice President · Technical & Functional Lead',
  team: 'E-Trading Development, Global Markets',
  company: 'UOB',
  location: 'Singapore',
  linkedin: 'https://www.linkedin.com/in/jake-abella-903b47137',
  taglines: [
    'Building e-trading systems for Global Markets.',
    '{yearsInIT} years shipping software. Still loves to code.',
    'Bridging business, delivery and engineering.',
  ],
  summary: [
    "I'm a technologist with {yearsInIT} years in the IT industry, focused on building and delivering software in Java and .NET. {yearsInBanking} of those years have been in banking, mostly on electronic trading systems.",
    "Today I'm the Technical/Functional Lead and Delivery Manager for Global Markets trading systems at UOB. I work with development, infrastructure and support teams, and with business users, to get things built and shipped, often under real pressure.",
    "Outside work, I'm a tech enthusiast who is passionate about coding and cybersecurity.",
  ],
  stats: [
    { value: '{yearsInIT}', label: 'Years in IT' },
    { value: '{yearsInBanking}', label: 'Years in Banking' },
    { value: '{yearsAtUOB}', label: 'Years at UOB' },
    { value: '3', label: 'Asset Classes' },
  ],
  abilities: [
    'Leading technology projects across FX, Bonds and Equities',
    'System integration and support for Global Markets e-trading',
    'Integration across many systems and platforms',
    'Business analysis: turning business needs into delivery plans',
    'Building REST services and single-page web applications',
    'Engaging dev, infra, support and business stakeholders',
  ],
  topSkills: [
    'Software Development',
    'Solution Architecture',
    'Infrastructure',
    'Business Analysis',
    'Project Management',
    'Team Leadership',
  ],
  inventory: [
    { name: 'Java', tag: 'LANG' },
    { name: 'JavaScript', tag: 'LANG' },
    { name: 'React', tag: 'UI' },
    { name: 'Angular', tag: 'UI' },
    { name: 'REST APIs', tag: 'API' },
    { name: 'FX', tag: 'MKT' },
    { name: 'Bonds', tag: 'MKT' },
    { name: 'Equities', tag: 'MKT' },
    { name: 'Commodities', tag: 'MKT' },
    { name: 'Scrum', tag: 'PM' },
    { name: 'Python', tag: 'LANG' },
    { name: 'ExpressJS', tag: 'LANG' },
    { name: 'NodeJS', tag: 'LANG' },
    { name: 'MSSQL', tag: 'DB' },
    { name: 'NoSQL - Mongodb', tag: 'DB' },
    { name: 'Oracle', tag: 'DB' },
    { name: 'Jboss EAP', tag: 'Middleware' },
    { name: 'Websphere', tag: 'Middleware' },
    { name: 'apache-httpd', tag: 'Middleware' },
  ],
};

export type Stage = {
  world: string;
  org: string;
  role: string;
  location?: string;
  notes: string[];
  current?: boolean;
  color: 'coral' | 'sky' | 'mint' | 'sun' | 'grape' | 'leaf';
} &
  // Dated stages get their period and duration computed; leave out `end` for the current role.
  (| { start: string; end?: string }
    // Or give fixed labels instead.
    | { period: string; duration: string }
  );

export function stagePeriod(stage: Stage) {
  return 'period' in stage
    ? stage.period
    : formatPeriod(stage.start, stage.end);
}

export function stageDuration(stage: Stage, now: Date) {
  return 'duration' in stage
    ? stage.duration
    : formatDuration(stage.start, stage.end, now);
}

// Ordered from start of the journey to the present.
export const journey: Stage[] = [
  {
    world: '0-0',
    org: 'Lyceum of the Philippines – Intramuros',
    role: 'B.Sc. Computer Science',
    period: '2000 – 2004',
    duration: 'Tutorial level',
    location: 'Manila',
    notes: [
      'Learned the fundamentals of computer science and software engineering.',
    ],
    color: 'leaf',
  },
  {
    world: '1-1',
    org: 'Panasonic Singapore',
    role: 'Software Engineer',
    start: '2008-07',
    end: '2009-07',
    location: 'Singapore',
    notes: [
      'Started my career in Singapore as a software engineer. Building inventory systems and cost management tools',
    ],
    color: 'sky',
  },
  {
    world: '2-1',
    org: 'MUFG',
    role: 'Software Engineer',
    start: '2009-07',
    end: '2014-08',
    notes: [
      'Five years of software engineering in banking, Migrated legacy applications to .Net apps using WCF, C# and MVC',
    ],
    color: 'coral',
  },
  {
    world: '3-1',
    org: 'Tangspac Consulting',
    role: 'Business Analyst',
    start: '2014-08',
    end: '2015-06',
    location: 'Singapore',
    notes: [
      'Client: United Overseas Bank (UOB).',
      'Business Analyst for Banknotes project (BLISS)',
      'Supported, managed and delivered apps to multiple regions with the help of business users and various vendors',
    ],
    color: 'grape',
  },
  {
    world: '4-1',
    org: 'UOB',
    role: 'Assistant Vice President',
    start: '2015-06',
    end: '2022-04',
    location: 'Singapore',
    notes: [
      'EDistribution Platform Team Lead / Developer.',
      'Implemented and Developed multiple eTrading apps for Global markets',
    ],
    color: 'mint',
  },
  {
    world: '4-2',
    org: 'UOB',
    role: 'Vice President',
    start: '2022-03',
    location: 'Singapore',
    notes: [
      'Technical/Functional Lead, E-Trading Development Team.',
      'Delivery manager for Global Markets trading systems.',
    ],
    current: true,
    color: 'sun',
  },
];

export const achievements = [
  { title: 'Certified ScrumMaster', issuer: 'CSM', sprite: 'star' as const },
  {
    title: 'Claude Code in Action',
    issuer: 'Anthropic',
    sprite: 'trophy' as const,
  },
  {
    title: 'B.Sc. Computer Science',
    issuer: 'Lyceum of the Philippines',
    sprite: 'coin' as const,
  },
];

// Portfolio: fill these in later. Set `locked: false` and add a `url` to unlock a slot.
export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  url?: string;
  locked: boolean;
};

export const projects: Project[] = [
  {
    title: 'Casahero',
    blurb: 'A property management system for real estate agents and landlords.',
    tags: ['Coming soon'],
    locked: true,
  },
  {
    title: 'Project Slot 02',
    blurb: 'A future project goes here.',
    tags: ['Coming soon'],
    locked: true,
  },
  {
    title: 'Project Slot 03',
    blurb: 'A future project goes here.',
    tags: ['Coming soon'],
    locked: true,
  },
];
