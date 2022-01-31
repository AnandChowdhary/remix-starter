import type { LoaderFunction, MetaFunction } from "remix";
import { useLoaderData } from "remix";
import { LocaleLink } from "~/components/LocaleLink";
import { loadTranslations } from "~/helpers/i18n";
import type { ExtendLoaderData } from "~/helpers/loader";
import { generateMetaTags } from "~/helpers/seo";

const i18nKeys = ["hello", "world", "products"] as const;
type I18nKeys = typeof i18nKeys[number];

export const meta: MetaFunction = generateMetaTags;
type LoaderData = ExtendLoaderData<I18nKeys, { products: { name: string }[] }>;

export let loader: LoaderFunction = (args): LoaderData => {
  const i18n = loadTranslations<I18nKeys>(args.params.locale, i18nKeys);
  return {
    i18n,
    meta: { title: i18n.products },
    products: [{ name: "Pants" }, { name: "Jacket" }],
  };
};

export default function Index() {
  const { products, i18n } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>{i18n.world}</h1>
      <ul>
        {products.map((product) => (
          <li key={product.name}>
            <LocaleLink to={`/products/${product.name}`}>
              {product.name}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
