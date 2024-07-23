import { Metadata } from "next";
import React from "react";

import BeautifyMarkdown from "@/components/markdown";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Terms of Service";
    const description = "Read about Wamellow's Terms of Service.";
    const url = getCanonicalUrl("terms");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/waya-v3.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.webp`
        }
    };
};

export default async function Home() {
    const res = await fetch("https://gist.githubusercontent.com/Luna-devv/12eaa667250165ba17d3319634923da8/raw/8edfb7746b00a59c064d3f85e50ce49e222531cd/terms.md", { next: { revalidate: 60 * 60 } });
    const markdown = (await res.text())
        .replaceAll(/waya\.one/gi, "wamellow.com")
        .replaceAll(/waya#0325/gi, "Wamellow#1138")
        .replaceAll(/waya/gi, "wamellow")
        .replaceAll("/config command", "web dashboard (wamellow.com/dashboard)")
        .replaceAll("@wamellow.com", "@waya.one");

    return (
        <div>

            <div className="flex gap-2 mb-5 text-sm">
                <CopyToClipboardButton text={getCanonicalUrl("terms")} />
            </div>

            <BeautifyMarkdown markdown={markdown} />

        </div>
    );
}