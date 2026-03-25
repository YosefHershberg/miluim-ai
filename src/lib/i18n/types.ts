/** Supported languages */
export type Locale = "he" | "en";

/** Direction for each locale */
export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  he: "rtl",
  en: "ltr",
};

/**
 * Flat translation dictionary type.
 * All keys are dot-separated paths (e.g., "nav.home").
 */
export type TranslationDictionary = Record<string, string>;

/**
 * Parameters for interpolation in translation strings.
 * e.g., t("myMiluim.totalDays", { count: 30 }) replaces {{count}} with 30.
 */
export type TranslationParams = Record<string, string | number>;
