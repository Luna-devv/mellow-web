"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { HiShare, HiTrash, HiViewGridAdd } from "react-icons/hi";

import { webStore } from "@/common/webstore";
import Badge from "@/components/badge";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import ErrorBanner from "@/components/Error";
import Modal from "@/components/Modal";
import { ApiV1GuildsModulesLeaderboardGetResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

const SideComponent: FunctionComponent<{ guildId: string, design: ApiV1GuildsModulesLeaderboardGetResponse }> = ({ guildId, design }) => {
    const web = webStore((w) => w);
    const router = useRouter();

    const [modal, setModal] = useState(false);

    return (
        <div className="flex flex-col gap-3">

            <CopyToClipboardButton
                className={design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60 dark:hover:bg-wamellow-light/70 hover:bg-wamellow-100-light/70" : "dark:bg-wamellow bg-wamellow-100"}
                text={getCanonicalUrl("leaderboard", guildId)}
                icon={<HiShare />}
            />

            {web.devToolsEnabled &&
                <div className="dark:text-neutral-300 text-neutral-700 py-2 rounded-md">
                    <span className="flex items-center gap-2 px-1">
                        <span className="text-xl font-medium dark:text-neutral-100 text-neutral-900">Admin tools</span>
                        <Badge text="Developer" />
                    </span>
                    <hr className="mt-2 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setModal(true)}
                            className={`flex ${design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60 dark:hover:bg-wamellow-light/70 hover:bg-wamellow-100-light/70" : "dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light"} dark:hover:text-white py-2 px-4 rounded-md duration-200 w-full`}
                        >
                            <HiTrash className="relative top-1" />
                            <span className="ml-2">Reset member stats</span>
                        </button>
                        <Link href={getCanonicalUrl("dashboard", guildId)} className={`flex ${design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60 dark:hover:bg-wamellow-light/70 hover:bg-wamellow-100-light/70" : "dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light"} dark:hover:text-white py-2 px-4 rounded-md duration-200 w-full`}>
                            <HiViewGridAdd className="relative top-1" />
                            <span className="ml-2">Dashboard</span>
                        </Link>
                    </div>

                </div>
            }

            <div className="dark:text-neutral-300 text-neutral-700 py-2 rounded-md">
                <span className="text-xl font-medium dark:text-neutral-100 text-neutral-900 px-1">How this works</span>
                <hr className="my-2 dark:border-wamellow-light border-wamellow-100-light" />

                <div className="text-sm px-1">Users are sorted from most to least active for each category, updates once per minute.</div>
            </div>

            <Modal
                title="Reset @everyone's stats"
                buttonName="Reset"
                variant="danger"
                show={modal}
                onClose={() => setModal(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("token") as string
                        }
                    });
                }}
                onSuccess={() => {
                    router.refresh();
                }}
            >
                <ErrorBanner message="Takes a few seconds to apply" type="info" removeButton />
            </Modal>

        </div>
    );

};

export default SideComponent;