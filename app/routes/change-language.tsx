import { LoaderFunction, ActionFunction, MetaFunction, redirect } from "remix";
import { loadTranslations, locales } from "~/helpers/i18n";
import type { ExtendLoaderData } from "~/helpers/loader";
import { generateMetaTags } from "~/helpers/seo";
import { LocaleSelector } from "~/components/LocaleSelector";
import { localeCookie } from "~/helpers/cookies";

export const meta: MetaFunction = generateMetaTags;
type LoaderData = ExtendLoaderData<I18nKeys>;

export let action: ActionFunction = async ({ request }): Promise<Response> => {
  const body = await request.formData();
  const locale = body.get("locale");
  const returnTo = body.get("returnTo");

  // Make sure locale locale is provided
  if (!locale) throw new Error("Locale not provided");

  // Make sure it's a supported language
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
};

const i18nKeys = [] as const;
type I18nKeys = typeof i18nKeys[number];
export let loader: LoaderFunction = ({ params }): LoaderData => {
  const i18n = loadTranslations<I18nKeys>(params.locale, i18nKeys);
  return {
    i18n,
    meta: { title: "Change language & region" },
  };
};

export default function Index() {
  return (
    <div>
      <h1>Change language &amp; region</h1>
      <LocaleSelector i18n={{ change_language: "Locale", submit: "Submit" }} />
    </div>
  );
}
