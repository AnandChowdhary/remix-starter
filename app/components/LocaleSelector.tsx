import { Form, useMatches } from "remix";
import { locales, localesWithCountries } from "~/helpers/i18n";

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

  return (
    <Form
      // reloadDocument
      action="/select-locale"
      method="get"
      style={{ backgroundColor: "#eee", padding: "1.5rem" }}
    >
      <div>
        <a href="/select-locale/">{i18n.change_language}</a>
      </div>
      <label
        htmlFor="locale"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {i18n.change_language}
      </label>
      <select id="locale" name="locale" defaultValue={currentLocale}>
        {localesWithCountries
          ? localesWithCountries.map(
              ({ countryCode, countryLabel, locales }) => (
                <optgroup key={countryCode} label={countryLabel ?? countryCode}>
                  {locales.map((locale) => (
                    <option key={locale.slug} value={locale.slug}>
                      {`${locale.label} (${locale.countryLabel})`}
                    </option>
                  ))}
                </optgroup>
              )
            )
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
    </Form>
  );
};
