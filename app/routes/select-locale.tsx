import { LoaderFunction, MetaFunction, redirect } from "remix";
import { localeCookie } from "~/helpers/cookies";
import {
  loadTranslations,
  locales,
  localesWithCountries,
} from "~/helpers/i18n";
import type { ExtendLoaderData } from "~/helpers/loader";
import { generateMetaTags } from "~/helpers/seo";

export const meta: MetaFunction = generateMetaTags;
type LoaderData = ExtendLoaderData<I18nKeys>;

const i18nKeys = [] as const;
type I18nKeys = typeof i18nKeys[number];
export let loader: LoaderFunction = async ({
  request,
  params,
}): Promise<Response | LoaderData> => {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale");
  const returnTo = url.searchParams.get("returnTo");

  if (locale) {
    console.log(locale);
    if (!locales.find((i) => i.slug === locale))
      throw new Error(
        `Locale "${locale}" is not supported, please select one of ${locales
          .map((i) => `"${i.slug}"`)
          .join(", ")}`
      );
    return redirect(
      `/${locale}${typeof returnTo === "string" ? returnTo : "/"}`,
      { headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
    );
  }

  const i18n = loadTranslations<I18nKeys>(params.locale, i18nKeys);
  return {
    i18n,
    meta: { title: "Select language & region" },
  };
};

export default function ChangeLanguage() {
  return (
    <div>
      <h1>Select language &amp; region</h1>
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {localesWithCountries
          ? localesWithCountries.map(
              ({ countryCode, countryLabel, locales }) => (
                <div key={countryCode}>
                  <h2>{countryLabel}</h2>
                  {locales.map((locale) => (
                    <div key={locale.slug} style={{ marginTop: "1rem" }}>
                      <a href={`/${locale.slug}/`}>
                        {`${locale.label} (${locale.countryLabel})`}
                      </a>
                    </div>
                  ))}
                </div>
              )
            )
          : locales.map((locale) => (
              <a href={`/${locale.slug}/`} key={locale.slug}>
                {locale.label}
              </a>
            ))}
      </nav>
    </div>
  );
}
