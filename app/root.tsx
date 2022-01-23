import {
	Links,
	LiveReload,
	LoaderFunction,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import { getLanguage } from "./helpers/i18n";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
	return { title: "New Remix App" };
};

type LoaderData = { recommendedLocale?: string; recommendedLocaleUrl: string };

export let loader: LoaderFunction = (args): LoaderData => {
	const recommendedLocale = getLanguage(args.request.headers) + "-ch";
	return {
		recommendedLocale:
			args.params.locale === recommendedLocale ? undefined : recommendedLocale,
		recommendedLocaleUrl: args.request.url.replace(
			args.params.locale ?? "",
			recommendedLocale
		),
	};
};

export default function App() {
	const { recommendedLocale, recommendedLocaleUrl } =
		useLoaderData<LoaderData>();
	const [showLocale, setShowLocale] = useState<boolean>(false);

	useEffect(() => {
		if (!window.sessionStorage.getItem("locale-recommendation-hidden"))
			setShowLocale(true);
	}, [setShowLocale]);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body
				style={{
					fontFamily: "system-ui, sans-serif",
					lineHeight: "1.4",
					margin: 0,
				}}
			>
				{recommendedLocale && (
					<div
						style={{
							backgroundColor: "#eee",
							padding: "0.75rem",
							display: showLocale ? "flex" : "none",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<p style={{ margin: 0 }}>
							<span style={{ marginRight: "0.5rem" }}>
								This site is also available in {recommendedLocale}.
							</span>
							<a href={recommendedLocaleUrl}>
								View in {recommendedLocale} &rarr;
							</a>
						</p>
						<button
							style={{ border: 0, padding: 0 }}
							aria-label="Hide"
							onClick={() => {
								setShowLocale(false);
								window.sessionStorage.setItem(
									"locale-recommendation-hidden",
									"1"
								);
							}}
						>
							<svg
								style={{ height: "0.75rem" }}
								viewBox="0 0 138 137"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect
									x="125.922"
									y="0.264648"
									width="16"
									height="177"
									transform="rotate(45 125.922 0.264648)"
									fill="black"
								/>
								<rect
									x="137.236"
									y="125.422"
									width="16"
									height="177"
									transform="rotate(135 137.236 125.422)"
									fill="black"
								/>
							</svg>
						</button>
					</div>
				)}
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === "development" && <LiveReload />}
			</body>
		</html>
	);
}
