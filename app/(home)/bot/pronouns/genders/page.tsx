import type { Metadata } from "next";

import type { PronounsResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

import List from "../list.component";

export const generateMetadata = (): Metadata => {
    const url = getCanonicalUrl("bot", "pronouns", "genders");

    return {
        alternates: {
            canonical: url
        }
    };
};

export default async function Home() {
    const genders = await fetch("https://prns-api.waya.one/genders", { next: { revalidate: 60 * 60 } }).then((res) => res.json()) as PronounsResponse;

    return <List res={genders} type="Genders" />;
}