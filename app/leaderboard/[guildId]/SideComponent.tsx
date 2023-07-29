"use client";
import { FunctionComponent } from "react";

import { CopyToClipboardButton } from "@/components/copyToClipboard";
import { ApiV1GuildsGetResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

const SideComponent: FunctionComponent<{ guild: ApiV1GuildsGetResponse }> = ({ guild }) => {

    return (
        <div className="flex flex-col gap-3">

            <CopyToClipboardButton text={getCanonicalUrl("leaderboard", guild.id)} />

            <div className="dark:bg-wamellow dark:text-neutral-300 text-neutral-700 py-2 px-4 rounded-md">
                <span className="text-xl font-medium dark:text-neutral-100 text-neutral-900">How this works</span>
                <hr className="my-2 dark:border-wamellow-light border-wamellow-100-light" />
                <span className="text-sm">Users are sorted from most active to least active for each category, updates once per hour.</span>
            </div>

        </div>
    );

};

export default SideComponent;