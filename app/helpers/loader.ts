/** Base type for loader data */
export type ExtendLoaderData<
  I18nKeys extends string,
  Data extends Record<string, any>
> = {
  i18n: Record<I18nKeys, string>;
  meta: { title?: string };
} & Data;
