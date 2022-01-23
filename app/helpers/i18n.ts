import { pick } from "accept-language-parser";

type LanguageCode = "en" | "fr" | "de";
const languages: LanguageCode[] = ["en", "fr", "de"];

export const locales: string[] = languages
	.map((language) => `${language}-ch`)
	.flat();

const i18n: Record<LanguageCode, Record<string, string>> = {
	en: { hello: "hello", world: "world" },
	de: { hello: "hallo", world: "world" },
	fr: { hello: "bonjour", world: "world" },
};

/**
 * Get localized keys for a given language
 * @param language - ISO 639‑1 language code
 * @param keys - Keys required
 */
export const getTranslations = <T extends string>(
	language: string | undefined,
	keys: string[]
): Record<T, string> => {
	const result: Record<string, string> = {};
	keys.forEach(
		(key) =>
			(result[key] =
				i18n[language?.split("-")?.[0] as LanguageCode][key] ?? key)
	);
	return result;
};

export const getLanguage = (headers: Headers): string => {
	const locale = pick(languages, headers.get("accept-language") ?? "");
	return locale ?? languages[0];
};
