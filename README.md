# 💿 Remix Starter

A Remix starter with intuitive defaults, like support for internationalization and localized URLs. Coming soon: Authentication and authorization, component documentation, and more!

> I built this in literally like 30 minutes to try out Remix. The amazing thing is that today, in 2022, Next.js still doesn't support localized URLs, and it took me a handful of minutes to set this up!

## Features

- 📕 Localized URLs by default
- 🌎 Dependency-free typed translation
- ...more coming soon!

### Localized URLs by default

Instead of going to `/` and `/about`, your users will always go to `/en-ch/` and `/en-ch/about` (in this example, the language is "English - Switzerland, or en-ch). This is an SEO and i18n best practice, so you have unique URLs based on the language of your content.

#### Redirection

Users will automatically by redirected to their language of choice. We parse the Accept-Language header and figure out the best language for the user.

#### Language selection

Users can manually select their preferred language. We remember this in a cookie.

<img width="754" alt="CleanShot 2022-01-27 at 16 56 33@2x" src="https://user-images.githubusercontent.com/2841780/151350017-c4c571d0-8633-4c5b-b3a5-04ee8be69b39.png">

#### Language recommendation

If your users have followed a link (say, on a search result) and have reached your site's version that we don't think is their preferred language, we show them a recommendation.

<img width="918" alt="CleanShot 2022-01-27 at 16 57 28@2x" src="https://user-images.githubusercontent.com/2841780/151350156-458631a0-cf13-4b2e-8d5d-2e7ee9e6e9ad.png">


### Dependency-free typed translation

The [`app/data/i18n.json`](./app/data/i18n.json) contains all your translations. Don't worry, we never bundle the entire file; not even entire scopes — only the translations you actually use on a page are included, so your pages are always fast. You can generate this file using any i18n pipeline.

<details>
  <summary>Screenshot of i18n.json file</summary>
  <img width="365" alt="CleanShot 2022-01-27 at 16 47 17@2x" src="https://user-images.githubusercontent.com/2841780/151348610-69cf2445-6688-4cff-a80d-1e1c1f57f29d.png">
</details>

First, list the keys you require on a route:

```ts
const i18nKeys = ["hello", "world"] as const;
```

Then, the `loader` function will fetch the translations in the current language:

```ts
const i18nKeys = ["hello", "world"] as const;
type I18nKeys = typeof i18nKeys[number];

type LoaderData = {
  i18n: Record<I18nKeys, string>;
  products: { name: string }[];
};

export let loader: LoaderFunction = (args): LoaderData => {
  return {
    i18n: loadTranslations<I18nKeys>(args.params.locale, i18nKeys),
    products: [{ name: "Pants" }, { name: "Jacket" }],
  };
};
```

Now consume the translations with full type support:

```ts
const { products, i18n } = useLoaderData<LoaderData>();
```

<img width="478" alt="CleanShot 2022-01-27 at 16 50 50@2x" src="https://user-images.githubusercontent.com/2841780/151349124-45e4f814-fde7-495b-9f16-e05554c330af.png">


## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
