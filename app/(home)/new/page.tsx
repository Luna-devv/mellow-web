import React from "react";
import { HiHome } from "react-icons/hi";

import BeautifyMarkdown from "@/components/BeautifyMarkdown";
import OverviewLinkComponent from "@/components/OverviewLinkComponent";
import { getCanonicalUrl } from "@/utils/urls";

export default async function Home() {
    const res = await fetch(getCanonicalUrl("new.md"), { next: { revalidate: 60 * 60 } });
    const markdown = await res.text();

    return (
        <div>

            <OverviewLinkComponent
                title="View Homepage"
                message="Start your exciting journey with wamellow here in just a few seconds."
                url="/"
                icon={<HiHome />}
            />

            <BeautifyMarkdown markdown={markdown} />

        </div>
    );
}