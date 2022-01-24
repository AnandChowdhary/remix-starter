import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { loadTranslations } from "~/helpers/i18n";

const i18nKeys = ["hello", "world"] as const;
type I18nKeys = typeof i18nKeys[number];

type LoaderData = {
  i18n: Record<I18nKeys, string>;
  products: { name: string }[];
};

export let loader: LoaderFunction = (args): LoaderData => {
  return {
    i18n: loadTranslations<I18nKeys>(args.params.locale, i18nKeys as any),
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
          <li key={product.name}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
