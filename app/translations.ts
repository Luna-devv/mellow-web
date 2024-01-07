"use server";

import { translationsConfig } from "@/common/languages";

export async function loadFile(locale: string) {
    console.log("Loading locale", locale);

    return await import(`../public/locales/${locale}.json`)
        .then((res) => res.default).catch(async (err) => {
            console.error(`Locale ${locale} not found!`, err);
            return await import(`../public/locales/${translationsConfig.defaultLocale}.json`).then((res) => res.default); // load default locale, if not found
        });

}