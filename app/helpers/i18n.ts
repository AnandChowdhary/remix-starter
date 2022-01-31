import { pick } from "accept-language-parser";
import i18nData from "~/data/i18n.json";

/**
 * All available locales per recommendedCountryCode in the following format:
 * { [recommendedCountryCode code]: { [language code]: name } }
 */
export const locales: Record<string, Record<string, string>> = {
  de: { en: "English (Germany)", de: "Deutsche (Deutschland)" },
  ch: {
    en: "English (Switzerland)",
    fr: "Français (Suisse)",
    de: "Deutsche (Schweiz)",
  },
};

const _i18n: Record<string, Record<string, string>> = i18nData;
const _defaultFallbackLanguage = "en";
const _computedLanguageCodes = Array.from(
  new Set<string>(
    Object.values(locales)
      .map((languages) => Object.keys(languages))
      .flat()
  )
);

/**
 * Get localized keys for a given locale
 * @param locale - Locale code, e.g., "en-ch"
 * @param keys - Keys required
 * @returns Object containing localized terms
 */
export const loadTranslations = <T extends string>(
  locale: string | undefined,
  keys: readonly string[]
): Record<T, string> => {
  const languageCode = locale?.split("-")[0] ?? _defaultFallbackLanguage;
  const result: Record<string, string> = {};
  keys.forEach(
    (key) =>
      (result[key] =
        _i18n[languageCode][key] ?? _i18n[_defaultFallbackLanguage][key] ?? key)
  );
  return result;
};

/**
 * Get the recommended locale for a request using its `Accept-Language` header and IP address
 * @param headers - Request headers
 * @returns Locale, e.g., "en-ch"
 */
export const getRecommendedLocale = (headers: Headers): string => {
  const locale = pick(
    _computedLanguageCodes,
    headers.get("accept-language") ?? ""
  );
  const recommendedCountryCode = "ch";
  return `${locale ?? _defaultFallbackLanguage}-${recommendedCountryCode}`;
};
