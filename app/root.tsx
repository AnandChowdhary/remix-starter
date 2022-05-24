import { useEffect, useState } from "react";
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from "remix";
import {
  getRecommendedLocale,
  loadTranslations,
  localeHasCountries,
  locales,
  routesWithoutLocales,
  t,
} from "~/helpers/i18n";
import type { Locale } from "~/helpers/i18n";
import { ExtendLoaderData } from "~/helpers/loader";
import { LocaleSelector } from "~/components/LocaleSelector";

export const meta: MetaFunction = () => {
  return { title: "Pabio" };
};

const i18nKeys = ["change_language", "submit"] as const;
type I18nKeys = typeof i18nKeys[number];
type LoaderData = ExtendLoaderData<
  I18nKeys,
  {
    showLocaleRecommendation: boolean;
    recommendedLocale: Locale;
    recommendedLocaleUrl: string;
  }
>;
export const loader: LoaderFunction = async (args): Promise<LoaderData> => {
  const recommendedLocaleSlug = await getRecommendedLocale(
    args.request,
    args.params.locale
  );
  const recommendedLocale = locales.find(
    (locale) => locale.slug === recommendedLocaleSlug
  );
  if (!recommendedLocale) throw new Error("Recommend locale not found");

  const url = new URL(args.request.url);
  return {
    meta: { title: "Pabio" },
    i18n: loadTranslations<I18nKeys>(args.params.locale, i18nKeys),
    showLocaleRecommendation: args.params.locale
      ? recommendedLocale.slug !== args.params.locale
      : false,
    recommendedLocale,
    recommendedLocaleUrl: url.pathname.replace(
      args.params.locale ?? "",
      recommendedLocale.slug
    ),
  };
};

const BaseTemplate: React.FC = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
      <style
        dangerouslySetInnerHTML={{
          __html: `
body {
	font-family: system-ui, sans-serif;
	line-height: 1.4;
	margin: 0 auto;
	max-width: 720px;
}
a { color: blue; }
				`,
        }}
      />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      {process.env.NODE_ENV === "development" && <LiveReload />}
    </body>
  </html>
);

export default function App() {
  const {
    i18n,
    showLocaleRecommendation,
    recommendedLocale,
    recommendedLocaleUrl,
  } = useLoaderData<LoaderData>();
  const [showLocale, setShowLocale] = useState<boolean>(false);
  const matches = useMatches();
  const currentLocale = matches[matches.length - 1]?.params.locale ?? "";
  const currentPathname = matches[matches.length - 1]?.pathname ?? "";

  useEffect(() => {
    if (!window.sessionStorage.getItem("locale-recommendation-hidden"))
      setShowLocale(true);
  }, [setShowLocale]);

  return (
    <BaseTemplate>
      {showLocaleRecommendation && (
        <div
          style={{
            backgroundColor: "#eee",
            padding: "0.75rem",
            display: showLocale ? "flex" : "none",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: 0 }}>
            <span style={{ marginRight: "0.5rem" }}>
              {t(recommendedLocale.languageRecommendationI18n.body, {
                language: recommendedLocale.label,
              })}
            </span>
            <a href={recommendedLocaleUrl}>{`${t(
              recommendedLocale.languageRecommendationI18n.cta,
              {
                language:
                  localeHasCountries &&
                  recommendedLocale.slug.split("-")[0] ===
                    currentLocale.split("-")[0]
                    ? // If language is the same, but country is different
                      recommendedLocale.countryLabel ?? recommendedLocale.label
                    : recommendedLocale.label,
              }
            )} →`}</a>
          </p>
          <button
            style={{ border: 0, padding: 0 }}
            aria-label="Hide"
            onClick={() => {
              setShowLocale(false);
              window.sessionStorage.setItem(
                "locale-recommendation-hidden",
                "1"
              );
            }}
          >
            <svg
              style={{ height: "0.75rem" }}
              viewBox="0 0 138 137"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="125.922"
                y="0.264648"
                width="16"
                height="177"
                transform="rotate(45 125.922 0.264648)"
                fill="black"
              />
              <rect
                x="137.236"
                y="125.422"
                width="16"
                height="177"
                transform="rotate(135 137.236 125.422)"
                fill="black"
              />
            </svg>
          </button>
        </div>
      )}
      <Outlet />
      <footer>
        {!routesWithoutLocales.includes(currentPathname) && (
          <LocaleSelector
            i18n={{
              change_language: i18n.change_language,
              submit: i18n.submit,
            }}
          />
        )}
        <details style={{ marginTop: "1rem" }}>
          <summary>Your computed locale</summary>
          <ul>
            <li>Current locale: {currentLocale}</li>
            <li>Recommended locale: {recommendedLocale.slug}</li>
          </ul>
        </details>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </BaseTemplate>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return <BaseTemplate>{error}</BaseTemplate>;
};
