import Link from "next/link";
import React from "react";
import { HiAcademicCap, HiArchive } from "react-icons/hi";

import BeautifyMarkdown from "@/components/BeautifyMarkdown";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import { getCanonicalUrl } from "@/utils/urls";

export default async function Home() {
    const res = await fetch("https://gist.githubusercontent.com/Luna-devv/c79375ba9e1834e87bcc88be8694113a/raw/9210c928b7b16aa52d37d145f628d971ea8447a7/privacy.md", { next: { revalidate: 60 * 60 } });
    const markdown = (await res.text())
        .replaceAll(/waya\.one/gi, "wamellow.com")
        .replaceAll(/waya#0325/gi, "Wamellow#1138")
        .replaceAll(/waya/gi, "wamellow")
        .replaceAll("/config command", "web dashboard (wamellow.com/dashboard)")
        .replaceAll("@wamellow.com", "@waya.one");

    return (
        <div>

            <div className="flex gap-2 mb-5 text-sm">
                <Link href="/terms" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-3 rounded-md duration-200">
                    <HiAcademicCap className="relative top-1" />
                    <span className="ml-2">Terms of Service</span>
                </Link>
                <Link href="https://gist.github.com/Luna-devv/c79375ba9e1834e87bcc88be8694113a/revisions" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-3 rounded-md duration-200">
                    <HiArchive className="relative top-1" />
                    <span className="ml-2">Revisions</span>
                </Link>
                <CopyToClipboardButton text={getCanonicalUrl("privacy")} />
            </div>

            <BeautifyMarkdown markdown={markdown} />

        </div>
    );
}