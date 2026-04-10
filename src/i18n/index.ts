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

export function useTranslations(lang: Lang): Translations {
  return languages[lang] ?? fr;
}

export function getLocalePath(lang: Lang, path: string): string {
  if (lang === 'fr') return path;
  return `/en${path}`;
}
