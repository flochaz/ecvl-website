import { fr } from './fr';
import { en } from './en';
import type { Translations } from './types';
export type { Translations };

export const languages = { fr, en } as const;
export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in languages) return maybeLang as Lang;
  return 'fr';
}

// Pages whose URL slug differs between locales: [fr path, en path]
const localizedSlugPairs: [string, string][] = [
  ['/jardin-partage', '/shared-garden'],
  ['/don', '/donate'],
];

export function useTranslations(lang: Lang): Translations {
  return languages[lang] ?? fr;
}

export function getLocalePath(lang: Lang, path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const pair = localizedSlugPairs.find(([frPath, enPath]) => path === frPath || path === enPath);
  const localized = pair ? (lang === 'fr' ? pair[0] : pair[1]) : path;
  if (lang === 'fr') return `${base}${localized}`;
  return `${base}/en${localized}`;
}
