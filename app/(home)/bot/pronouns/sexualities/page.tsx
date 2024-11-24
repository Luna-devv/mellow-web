import type { Metadata } from "next";

import type { PronounsResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

import List from "../list.component";

export const generateMetadata = (): Metadata => {
    const url = getCanonicalUrl("bot", "pronouns", "sexualities");

    return {
        alternates: {
            canonical: url
        }
    };
};

export default async function Home() {
    const sexualities = await fetch("https://prns-api.waya.one/sexualities", { next: { revalidate: 60 * 60 } }).then((res) => res.json()) as PronounsResponse;

    return <List res={sexualities} type="Sexualities" />;
}