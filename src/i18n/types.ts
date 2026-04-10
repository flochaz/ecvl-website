export interface Translations {
  site: {
    name: string;
    fullName: string;
    tagline: string;
    description: string;
  };
  nav: {
    home: string;
    repairCafe: string;
    garden: string;
    donate: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    learnMore: string;
  };
  events: {
    title: string;
    subtitle: string;
    noEvents: string;
    register: string;
    viewAll: string;
    on: string;
    at: string;
  };
  activities: {
    title: string;
    repairCafe: { title: string; short: string; cta: string };
    garden: { title: string; short: string; cta: string };
    fruitPicking: { title: string; short: string };
  };
  donate: {
    title: string;
    subtitle: string;
    cta: string;
    taxInfo: string;
  };
  facebook: {
    title: string;
    subtitle: string;
    consentText: string;
    loadButton: string;
    viewPage: string;
  };
  footer: {
    rights: string;
    legal: string;
    association: string;
    followUs: string;
  };
  repairCafe: {
    title: string;
    subtitle: string;
    intro: string;
    howItWorks: { title: string; steps: string[] };
    whatWeRepair: { title: string; items: string[] };
    ifixitBot: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
      url: string;
    };
    selfRepair: {
      title: string;
      ifixit: string;
      ifixitUrl: string;
      repairCafeIntl: string;
      repairCafeIntlUrl: string;
    };
    repairMonitor: { title: string; subtitle: string; noData: string; fakeDataBadge: string; fakeDataNote: string };
    nextSessions: string;
    register: string;
  };
  garden: {
    title: string;
    subtitle: string;
    intro: string;
    whatWeGrow: { title: string; items: string[] };
    participate: { title: string; steps: string[] };
    principles: { title: string; items: string[] };
    fruitPicking: { title: string; description: string };
    nextEvents: string;
  };
}
