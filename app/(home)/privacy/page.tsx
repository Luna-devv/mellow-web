import { readFile } from "fs/promises";
import { Metadata } from "next";

import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import BeautifyMarkdown from "@/components/markdown";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const revalidate = false;

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

const PATH = `${process.cwd()}/public/legal/privacy.md` as const;

export default async function Home() {
    const privacy = await readFile(PATH, { encoding: "utf-8" });

    return (
        <div>

            <div className="flex gap-2 mb-5 text-sm">
                <CopyToClipboardButton text={getCanonicalUrl("privacy")} />
            </div>

            <BeautifyMarkdown markdown={privacy} />

        </div>
    );
}