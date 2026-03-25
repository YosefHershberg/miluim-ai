"use client";

import {
  createContext,
  useCallback,
  useContext,
  useInsertionEffect,
  useState,
  type ReactNode,
} from "react";
import type { Locale, TranslationDictionary, TranslationParams } from "./types";
import { localeDirection } from "./types";
import heTranslations from "./locales/he.json";
import enTranslations from "./locales/en.json";

const dictionaries: Record<Locale, TranslationDictionary> = {
  he: heTranslations,
  en: enTranslations,
};

interface LanguageContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "miluim-ai-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "he";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "he" || stored === "en") return stored;
  return "he";
}

/**
 * Provides language context (locale, direction, translation function) to the app.
 * Hebrew is the default language. Persists preference to localStorage.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // Sync HTML dir/lang attributes
  useInsertionEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection[locale];
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = localeDirection[newLocale];
  }, []);

  const dir = localeDirection[locale];

  const t = useCallback(
    (key: string, params?: TranslationParams): string => {
      const dict = dictionaries[locale];
      let value = dict[key] ?? key;

      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          value = value.replace(
            new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"),
            String(paramValue)
          );
        }
      }

      return value;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access the language context: locale, direction, setLocale, and t() function.
 *
 * @example
 * const { t, locale, setLocale, dir } = useTranslation();
 * <h1>{t('myMiluim.title')}</h1>
 */
export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
