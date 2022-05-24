import { pick } from "accept-language-parser";
import i18nData from "~/data/i18n.json";

const FALLBACK_LOCALE = "en-ch";

/** * All available locales */
export const locales: { slug: string; label: string }[] = [
  { slug: "en-de", label: "English (Germany)" },
  { slug: "de-de", label: "Deutsche (Deutschland)" },
  { slug: "en-ch", label: "English (Switzerland)" },
  { slug: "fr-ch", label: "Français (Suisse)" },
  { slug: "de-ch", label: "Deutsche (Schweiz)" },
];

// Properly types i18n object
const _i18n: Record<string, Record<string, string>> = i18nData;
// If list of locales is not like ["en", "de"] but like ["en-ch", "de-ch"], i.e., has country code
const _localeSlugs: string[] = locales.map((locale) => locale.slug);
const _localeHasCountries = _localeSlugs.every((slug) =>
  /[a-z]{2,3}-[a-zA-Z]{2}/.test(slug)
);
// In case of locales with countries, language part of the fallback locale
const _fallbackLocaleLanguage = FALLBACK_LOCALE.split("-")[0];
// In case of locales with countries, country part of the fallback locale
const _fallbackLocaleCountry = FALLBACK_LOCALE.split("-")[1];

/**
 * Get localized keys for a given locale
 * @param locale - Locale code, e.g., "en-ch" or "en"
 * @param keys - Keys required
 * @returns Object containing localized terms
 */
export const loadTranslations = <T extends string>(
  locale: string | undefined,
  keys: readonly string[]
): Record<T, string> => {
  const languageCode = (locale ?? FALLBACK_LOCALE).split("-")[0];
  const result: Record<string, string> = {};
  keys.forEach(
    (key) =>
      (result[key] =
        _i18n[languageCode][key] ?? _i18n[_fallbackLocaleLanguage][key] ?? key)
  );
  return result;
};

/**
 * Get the IP address from an incoming Request, based
 * on https://github.com/pbojinov/request-ip
 * @param headers - Request headers
 * @returns IP address with a fallback value
 */
const getIpAddressFromRequest = (headers: Headers): string | undefined => {
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
};

/**
 * Get the recommended locale for a request using its `Accept-Language` header and IP address
 * @param request - HTTP request
 * @param currentLocale - Currently active locale
 * @returns Locale, e.g., "en-ch" or "en"
 */
export const getRecommendedLocale = async (
  request: Request,
  currentLocale?: string
): Promise<string> => {
  const { headers } = request;
  // Find your preferred language from our list of supported languages
  const locale = pick(_localeSlugs, headers.get("accept-language") ?? "");
  if (!_localeHasCountries) return locale ?? FALLBACK_LOCALE;

  const language = locale?.split?.("-")?.[0];
  let recommendedCountryCode =
    currentLocale?.split?.("-")?.[1] ?? _fallbackLocaleCountry;
  if (currentLocale)
    return `${language ?? _fallbackLocaleLanguage}-${recommendedCountryCode}`;

  if (!currentLocale)
    try {
      const ipAddress = getIpAddressFromRequest(headers);
      if (!ipAddress)
        return `${
          language ?? _fallbackLocaleLanguage
        }-${recommendedCountryCode}`;

      const response = await fetch(`https://api.country.is/${ipAddress}`);
      const data = await response.json();
      const { country } = data as { country: string; ip: string };
      const lowerCase = country.toLowerCase();
      if (Object.keys(locales).includes(lowerCase))
        recommendedCountryCode = lowerCase;
    } catch (error) {
      console.error(error);
    }
  return `${language ?? _fallbackLocaleLanguage}-${recommendedCountryCode}`;
};
