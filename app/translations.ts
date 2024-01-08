"use server";

import { LanguageLocale, translationsConfig } from "@/common/languages";

export async function loadFile(locale: LanguageLocale) {
    console.log("Fetching locale", locale);

    return await fetch((() => translationsConfig.fetchUrl(locale))()).then((res) => res.json()).catch(async (err) => {
        console.error("Failed to fetch locale", locale, err);
        return await fetch((() => translationsConfig.fetchUrl(translationsConfig.defaultLocale))()).then((res) => res.json());
    });
}