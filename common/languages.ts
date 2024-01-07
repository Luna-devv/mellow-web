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
    defaultLocale: "en"
};

export type LanguageLocale = typeof languages[number]["locale"];

interface TranslationConfig {
    languages: typeof languages;
    localeCookieName: string;
    defaultLocale: LanguageLocale
}