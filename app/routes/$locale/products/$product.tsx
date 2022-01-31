import { LoaderFunction, MetaFunction, useParams } from "remix";
import { useLoaderData } from "remix";
import { loadTranslations } from "~/helpers/i18n";
import { generateMetaTags } from "~/helpers/seo";
import type { ExtendLoaderData } from "~/helpers/loader";

const i18nKeys = ["hello"] as const;
type I18nKeys = typeof i18nKeys[number];

export const meta: MetaFunction = generateMetaTags;
type LoaderData = ExtendLoaderData<I18nKeys, {}>;

export let loader: LoaderFunction = (args): LoaderData => {
  const i18n = loadTranslations<I18nKeys>(args.params.locale, i18nKeys);
  return {
    i18n,
    meta: { title: args.params.product },
  };
};

export default function Index() {
  const { i18n } = useLoaderData<LoaderData>();
  const { product } = useParams();

  return (
    <div>
      <h1>{i18n.hello}</h1>
      <p>This is product {product}</p>
    </div>
  );
}
