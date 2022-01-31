import { renderToString } from "react-dom/server";
import type { EntryContext } from "remix";
import { createCookie, RemixServer } from "remix";
import { getRecommendedLocale, locales } from "~/helpers/i18n";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  const cookie = createCookie("pabio_v20220123_locale", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
  });

  if (
    !Object.entries(locales)
      .map(([countryCode, languages]) =>
        Object.keys(languages).map(
          (languageCode) => `${languageCode}-${countryCode}`
        )
      )
      .flat()
      .some((locale) => url.pathname.startsWith(`/${locale}/`))
  ) {
    const data = await cookie.parse(request.headers.get("Cookie"));
    const locale = data ?? (await getRecommendedLocale(request));
    return new Response(`/${locale}${url.pathname}`, {
      status: 302,
      headers: {
        Location: `/${locale}${url.pathname}`,
        "Set-Cookie": await cookie.serialize(locale),
      },
    });
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set(
    "Set-Cookie",
    await cookie.serialize(url.pathname.split("/")[1])
  );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
