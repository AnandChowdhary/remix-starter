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
  locales,
} from "~/helpers/i18n";

export const meta: MetaFunction = () => {
  return { title: "Pabio" };
};

type LoaderData = {
  i18n: Record<string, string>;
  recommendedLocale?: string;
  recommendedLocaleUrl: string;
};

export const loader: LoaderFunction = async (args): Promise<LoaderData> => {
  const recommendedLocale = await getRecommendedLocale(
    args.request,
    args.params.locale
  );
  const url = new URL(args.request.url);
  return {
    i18n: loadTranslations(
      args.params.locale,
      Object.keys(locales).map((countryCode) => `country_${countryCode}`)
    ),
    recommendedLocale:
      args.params.locale === recommendedLocale ? undefined : recommendedLocale,
    recommendedLocaleUrl: url.pathname.replace(
      args.params.locale ?? "",
      recommendedLocale
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
  const { i18n, recommendedLocale, recommendedLocaleUrl } =
    useLoaderData<LoaderData>();
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
      {recommendedLocale && (
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
              {`This site is also available in ${
                locales[recommendedLocale.split("-")[1]][
                  recommendedLocale.split("-")[0]
                ]
              }.`}
            </span>
            <a href={recommendedLocaleUrl}>{`Switch to ${
              recommendedLocale.split("-")[0] === currentLocale.split("-")[0]
                ? locales[recommendedLocale.split("-")[1]][
                    recommendedLocale.split("-")[0]
                  ]
                    .split("(")[1]
                    .split(")")[0]
                    .trim()
                : recommendedLocale.split("-")[1] ===
                  currentLocale.split("-")[1]
                ? locales[recommendedLocale.split("-")[1]][
                    recommendedLocale.split("-")[0]
                  ]
                    .split("(")[0]
                    .trim()
                : locales[recommendedLocale.split("-")[1]][
                    recommendedLocale.split("-")[0]
                  ]
            } →`}</a>
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
        <nav style={{ backgroundColor: "#eee", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "100%", margin: 0 }}>
            {"Change language & region"}
          </h2>
          {Object.entries(locales).map(([countryCode, languages]) => (
            <div key={countryCode}>
              <h3 style={{ fontSize: "100%" }}>
                {i18n[`country_${countryCode}`]}
              </h3>
              {Object.entries(languages).map(([languageCode, name]) => {
                const locale = `${languageCode}-${countryCode}`;
                const active = currentLocale === locale;
                const href = currentPathname.replace(
                  `/${currentLocale}`,
                  `/${locale}`
                );
                return (
                  <a
                    style={{
                      marginRight: "1rem",
                      fontWeight: active ? "bold" : "inherit",
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      window.sessionStorage.setItem(
                        "locale-recommendation-hidden",
                        "1"
                      );
                      window.location.href = href;
                    }}
                    key={locale}
                    href={href}
                    aria-current={active ? "page" : "false"}
                  >
                    {name}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </BaseTemplate>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return <BaseTemplate>{error}</BaseTemplate>;
};
