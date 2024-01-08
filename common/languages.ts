const languages = [
    {
        name: "English",
        locale: "en"
    },
    {
        name: "German",
        locale: "de"
    },
    {
        name: "Polish",
        locale: "pl"
    }
] as const;

export const translationsConfig: TranslationConfig = {
    languages,
    localeCookieName: "locale",
    defaultLocale: "en",
    fetchUrl: (locale) => process.env.NEXT_PUBLIC_BASE_API + `/locales/${locale}.json` // interesting how this env working on client in next
};

export type LanguageLocale = typeof languages[number]["locale"];

interface TranslationConfig {
    languages: typeof languages;
    localeCookieName: string;
    defaultLocale: LanguageLocale
    fetchUrl: (locale: LanguageLocale) => string;
}