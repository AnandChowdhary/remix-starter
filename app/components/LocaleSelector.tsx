import { useMatches } from "remix";
import type { Locale } from "~/helpers/i18n";
import { localeHasCountries, locales } from "~/helpers/i18n";

/**
 * Language & region selector
 * @returns A form with a list of languages
 */
export const LocaleSelector: React.FC<{
  i18n: { change_language: string; submit: string };
}> = ({ i18n }) => {
  const matches = useMatches();
  const currentLocale = matches[matches.length - 1]?.params.locale ?? "";
  const currentPathname = matches[matches.length - 1]?.pathname ?? "";
  const countries:
    | { countryCode: string; countryLabel?: string; locales: Locale[] }[]
    | undefined = localeHasCountries ? [] : undefined;
  if (countries) {
    const countryCodes = new Set<string>(
      locales.map((locale) => locale.slug.split("-")[1])
    );
    for (const countryCode of countryCodes)
      countries.push({
        countryCode,
        countryLabel: locales.find(
          (locale) => locale.slug.split("-")[1] === countryCode
        )?.countryLabel,
        locales: locales.filter(
          (locale) => locale.slug.split("-")[1] === countryCode
        ),
      });
  }

  return (
    <form
      action="/change-language"
      method="post"
      style={{ backgroundColor: "#eee", padding: "1.5rem" }}
    >
      <div>
        <label htmlFor="locale">{i18n.change_language}</label>
      </div>
      <select id="locale" name="locale" defaultValue={currentLocale}>
        {countries
          ? countries.map(({ countryCode, countryLabel, locales }) => (
              <optgroup key={countryCode} label={countryLabel ?? countryCode}>
                {locales.map((locale) => (
                  <option key={locale.slug} value={locale.slug}>
                    {`${locale.label} (${locale.countryLabel})`}
                  </option>
                ))}
              </optgroup>
            ))
          : locales.map((locale) => (
              <option key={locale.slug} value={locale.slug}>
                {locale.label}
              </option>
            ))}
      </select>
      <input
        type="hidden"
        name="returnTo"
        value={`/${currentPathname.split("/").slice(2).join("/")}`}
      />
      <button type="submit">{i18n.submit}</button>
    </form>
  );
};
