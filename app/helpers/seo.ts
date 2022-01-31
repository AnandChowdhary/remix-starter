import type { MetaFunction } from "remix";
import type { ExtendLoaderData } from "~/helpers/loader";

/**
 * Generates the <meta> tags for a route
 * @param args - Remix's `MetaFunction` arggs
 * @returns Object for `HtmlMetaDescriptor`
 */
export const generateMetaTags: MetaFunction = ({ data, parentsData }) => {
  // console.log({ parentsData: JSON.stringify(parentsData) });
  const { meta }: ExtendLoaderData<string, Record<string, any>> = data;
  return {
    title: [meta.title].filter((i) => i != null).join(" · "),
  };
};
