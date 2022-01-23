import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { loadTranslations } from "~/helpers/i18n";

type I18nKeys = "hello";
const i18nKeys: I18nKeys[] = ["hello"];

type LoaderData = {
	i18n: Record<"hello", string>;
	products: { name: string }[];
};

export let loader: LoaderFunction = (args): LoaderData => {
	return {
		i18n: loadTranslations<I18nKeys>(args.params.locale, i18nKeys),
		products: [{ name: "Pants" }, { name: "Jacket" }],
	};
};

export default function Index() {
	const { products, i18n } = useLoaderData<LoaderData>();

	return (
		<div>
			<h1>{i18n.hello}</h1>
			<ul>
				{products.map((product) => (
					<li key={product.name}>{product.name}</li>
				))}
			</ul>
		</div>
	);
}
