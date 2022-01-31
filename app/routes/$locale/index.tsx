import type { LoaderFunction, MetaFunction } from "remix";
import { generateMetaTags } from "~/helpers/seo";
import type { ExtendLoaderData } from "~/helpers/loader";

export const meta: MetaFunction = generateMetaTags;
type LoaderData = ExtendLoaderData<string, {}>;

export let loader: LoaderFunction = (): LoaderData => {
  return {
    i18n: {},
    meta: { title: "Pabio" },
  };
};

export default function Homepage() {
  return <p>Hello</p>;
}
