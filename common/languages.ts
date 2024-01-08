const languages = [
    {
        name: "English",
        locale: "en-EN"
    },
    {
        name: "German",
        locale: "de-DE"
    },
    {
        name: "Polish",
        locale: "pl-PL"
    }
] as const;

export const translationsConfig: TranslationConfig = {
    languages,
    localeCookieName: "locale",
    defaultLocale: "en-EN",
    fetchUrl: (locale) => process.env.NEXT_PUBLIC_LANG_API + `/${locale}/web/global/index.json`
};

export type LanguageLocale = typeof languages[number]["locale"];

interface TranslationConfig {
    languages: typeof languages;
    localeCookieName: string;
    defaultLocale: LanguageLocale
    fetchUrl: (locale: LanguageLocale) => string;
}