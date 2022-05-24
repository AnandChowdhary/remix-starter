import { renderToString } from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";
import {
  getRecommendedLocale,
  locales,
  routesWithoutLocales,
} from "~/helpers/i18n";
import { localeCookie } from "~/helpers/cookies";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  if (
    !routesWithoutLocales.includes(url.pathname) &&
    !locales.some((locale) => url.pathname.startsWith(`/${locale.slug}/`))
  ) {
    const data = await localeCookie.parse(request.headers.get("Cookie"));
    const locale = data ?? (await getRecommendedLocale(request));
    return new Response(`/${locale}${url.pathname}`, {
      status: 302, // 302 Found
      headers: {
        Location: `/${locale}${url.pathname}`,
        "Set-Cookie": await localeCookie.serialize(locale),
      },
    });
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");
  const potentialLocale = url.pathname.split("/")[1];
  if (locales.find((locale) => locale.slug === potentialLocale))
    responseHeaders.set(
      "Set-Cookie",
      await localeCookie.serialize(potentialLocale)
    );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
