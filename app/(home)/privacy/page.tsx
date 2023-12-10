import { Metadata } from "next";
import React from "react";

import BeautifyMarkdown from "@/components/BeautifyMarkdown";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Privacy";
    const description = "We take your privacy seriously. Read about Wamellow's Privacy Policy to learn how.";
    const url = getCanonicalUrl("privacy");

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
            images: `${getBaseUrl()}/pronouns-bot.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/pronouns-bot.webp`
        }
    };
};

export default async function Home() {
    const res = await fetch("https://gist.githubusercontent.com/Luna-devv/c79375ba9e1834e87bcc88be8694113a/raw/9210c928b7b16aa52d37d145f628d971ea8447a7/privacy.md", { next: { revalidate: 60 * 60 } });
    const markdown = (await res.text())
        .replaceAll(/waya\.one/gi, "wamellow.com")
        .replaceAll(/waya#0325/gi, "Wamellow#1138")
        .replaceAll(/waya/gi, "wamellow")
        .replaceAll("/config command", "web dashboard (wamellow.com/dashboard)")
        .replaceAll("@wamellow.com", "@waya.one")
        .replaceAll("If you wish to export server data, you may do so by navigating to the `/config` menu and selecting the ‘Export Data’ option.", "");

    return (
        <div>

            <div className="flex gap-2 mb-5 text-sm">
                <CopyToClipboardButton text={getCanonicalUrl("privacy")} />
            </div>

            <BeautifyMarkdown markdown={markdown} />

        </div>
    );
}