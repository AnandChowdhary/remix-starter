import { renderToString } from "react-dom/server";
import type { EntryContext } from "remix";
import { createCookie, RemixServer } from "remix";
import { getLanguage, locales } from "~/helpers/i18n";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	const url = new URL(request.url);
	if (!locales.some((locale) => url.pathname.startsWith(`/${locale}/`))) {
		const cookie = createCookie("locale");
		const data = await cookie.parse(request.headers.get("Cookie"));
		const language = data ?? getLanguage(request.headers);
		return new Response(`/${language}-ch${url.pathname}`, {
			status: 302,
			headers: {
				Location: `/${language}-ch${url.pathname}`,
				"Set-Cookie": await cookie.serialize(language),
			},
		});
	}

	const markup = renderToString(
		<RemixServer context={remixContext} url={request.url} />
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response("<!DOCTYPE html>" + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}
