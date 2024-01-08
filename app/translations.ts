"use server";


export async function loadFile(locale: string) {
    console.log("Fetching locale", locale);

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/locales/${locale}.json`).then((res) => res.json());
}