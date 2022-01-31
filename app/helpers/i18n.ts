import { pick } from "accept-language-parser";
import i18nData from "~/data/i18n.json";

const FALLBACK_LANGUAGE = "en";
const FALLBACK_COUNTRY = "ch";

/**
 * All available locales per country in the following format:
 * { [country code]: { [language code]: name } }
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
  const languageCode = locale?.split("-")[0] ?? FALLBACK_LANGUAGE;
  const result: Record<string, string> = {};
  keys.forEach(
    (key) =>
      (result[key] =
        _i18n[languageCode][key] ?? _i18n[FALLBACK_LANGUAGE][key] ?? key)
  );
  return result;
};

/**
 * Get the IP address from an incoming Request, based
 * on https://github.com/pbojinov/request-ip
 * @param headers - Request headers
 * @returns IP address with a fallback value
 */
const getIpAddressFromRequest = (headers: Headers): string => {
  for (const header in [
    "x-client-ip",
    "x-forwarded-for",
    "cf-connecting-ip",
    "fastly-client-ip",
    "true-client-ip",
    "x-real-ip",
    "x-cluster-client-ip",
    "x-forwarded",
    "forwarded-for",
    "forwarded",
  ]) {
    const value = headers
      .get(header)
      ?.split(",")
      .map((value) => {
        value = value.trim();
        if (value.includes(":")) {
          const splitted = value.split(":");
          if (splitted.length === 2) return splitted[0];
        }
        return value;
      })[0];
    if (value) return value;
  }
  return "1.1.1.1";
};

/**
 * Get the recommended locale for a request using its `Accept-Language` header and IP address
 * @param headers - Request headers
 * @param currentLocale - Currently active locale
 * @returns Locale, e.g., "en-ch"
 */
export const getRecommendedLocale = async (
  request: Request,
  currentLocale?: string
): Promise<string> => {
  const { headers } = request;
  const locale = pick(
    _computedLanguageCodes,
    headers.get("accept-language") ?? ""
  );
  let recommendedCountryCode =
    currentLocale?.split?.("-")?.[1] ?? FALLBACK_COUNTRY;
  if (!currentLocale)
    try {
      const ipAddress = getIpAddressFromRequest(headers);
      const response = await fetch(`https://api.country.is/${ipAddress}`);
      const data = await response.json();
      const { country } = data as { country: string; ip: string };
      const lowercased = country.toLowerCase();
      if (Object.keys(locales).includes(lowercased))
        recommendedCountryCode = lowercased;
    } catch (error) {
      console.error(error);
    }
  return `${locale ?? FALLBACK_LANGUAGE}-${recommendedCountryCode}`;
};
