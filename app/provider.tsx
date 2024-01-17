"use client";
import { NextUIProvider } from "@nextui-org/react";
import { createContext, useContext, useState } from "react";

import { LanguageLocale, translationsConfig } from "@/common/languages";

interface Props {
    children: React.ReactNode;
}

export function Provider({ children }: Props) {
    return (
        <NextUIProvider style={{ minHeight: "85%" }}>
            <main className="dark:text-neutral-400 text-neutral-700 flex flex-col items-center justify-between md:p-5 p-3 w-6xl max-w-full mt-2 md:mt-10">
                {children}
            </main>
        </NextUIProvider>
    );
}

// Translation

interface TranslationContext {
    t: (key: string) => string;
    setLanguage: (language: LanguageLocale) => void;
    locale: string;
}

const TranslationContext = createContext<TranslationContext>({
    locale: "en",
    setLanguage: () => "en",
    t: (key: string) => key
});

export function TranslationProvider({ children, file: serverFile, cookieLocale }: Props & { file: Record<string, string>, cookieLocale: LanguageLocale }) {
    const [locale, setLocale] = useState<LanguageLocale>(cookieLocale);
    const [file, setFile] = useState(serverFile);

    function t(key: string) {
        return file[key] || key;
    }

    function setLanguage(language: LanguageLocale) {
        setLocale(language);
        document.cookie = `${translationsConfig.localeCookieName}=${language}; path=/;`;
        fetch(`/locales/${language}.json`).then((res) => res.json()).then(setFile);
    }

    return (
        <TranslationContext.Provider value={{
            locale,
            setLanguage,
            t
        }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    return useContext(TranslationContext);
}

// in case you have server component, just use this component inside, otherwise use hook: `const { t } = useTranslation();`
export function Translation({ t }: { t: string }) { // cannot do `key`, cause it's reserved react thing lol
    const { t: tFunc } = useTranslation();

    return <>{tFunc(t)}</>;
}