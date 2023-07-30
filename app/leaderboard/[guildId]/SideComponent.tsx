"use client";
import Link from "next/link";
import { FunctionComponent } from "react";
import { HiViewGridAdd } from "react-icons/hi";

import { webStore } from "@/common/webstore";
import Badge from "@/components/badge";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import { ApiV1GuildsGetResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

const SideComponent: FunctionComponent<{ guild: ApiV1GuildsGetResponse }> = ({ guild }) => {
    const web = webStore((w) => w);

    return (
        <div className="flex flex-col gap-3">

            <CopyToClipboardButton text={getCanonicalUrl("leaderboard", guild.id)} />

            <div className="dark:text-neutral-300 text-neutral-700 py-2 px-4 rounded-md">
                <span className="text-xl font-medium dark:text-neutral-100 text-neutral-900">How this works</span>
                <hr className="my-2 dark:border-wamellow-light border-wamellow-100-light" />

                <span className="text-sm">Users are sorted from most to least active for each category, updates once per minute.</span>

            </div>

            {web.devToolsEnabled &&
                <div className="dark:text-neutral-300 text-neutral-700 py-2 px-4 rounded-md">
                    <span className="flex items-center gap-2">
                        <span className="text-xl font-medium dark:text-neutral-100 text-neutral-900">Admin Tools</span>
                        <Badge text="Developer" />
                    </span>
                    <hr className="mt-2 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

                    <Link href={getCanonicalUrl("dashboard", guild.id)} className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 w-full">
                        <HiViewGridAdd className="relative top-1" />
                        <span className="ml-2">Dashboard</span>
                    </Link>

                </div>
            }

        </div>
    );

};

export default SideComponent;