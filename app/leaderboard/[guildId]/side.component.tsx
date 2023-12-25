"use client";

import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiShare, HiTrash, HiViewGridAdd } from "react-icons/hi";

import { webStore } from "@/common/webstore";
import Ad from "@/components/ad";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import ErrorBanner from "@/components/Error";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesLeaderboardGetResponse, ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";
import cn from "@/utils/cn";
import { getCanonicalUrl } from "@/utils/urls";

export default function Side({
    guildId,
    design,
    pagination
}: {
    guildId: string;
    design: ApiV1GuildsModulesLeaderboardGetResponse;
    pagination: ApiV1GuildsTopmembersPaginationGetResponse;
}) {
    const web = webStore((w) => w);
    const router = useRouter();

    const [modal, setModal] = useState(false);
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    return (
        <div className="flex flex-col gap-3">

            <CopyToClipboardButton
                className={cn("w-full !justify-start", design?.backgroundColor && "dark:bg-wamellow/60 bg-wamellow-100/60 dark:hover:bg-wamellow-light/70 hover:bg-wamellow-100-light/70")}
                text={getCanonicalUrl("leaderboard", guildId)}
                icon={<HiShare />}
            />

            <Ad />

            <Accordion
                selectionMode="multiple"
                defaultExpandedKeys={["1", "2", "3"]}
                disableAnimation={web.reduceMotions}
            >

                {web.devToolsEnabled ?
                    <AccordionItem
                        key="1"
                        aria-label="admin tools"
                        title="Admin tools"
                        classNames={{ content: "flex flex-col gap-2 mb-2" }}
                    >
                        <Button
                            className="w-full !justify-start"
                            onClick={() => setModal(true)}
                            startContent={<HiTrash />}
                        >
                            Reset member stats
                        </Button>
                        <Button
                            as={Link}
                            className="w-full !justify-start"
                            href={getCanonicalUrl("dashboard", guildId)}
                            startContent={<HiViewGridAdd />}
                        >
                            Dashboard
                        </Button>
                    </AccordionItem>
                    :
                    undefined as unknown as JSX.Element
                }

                <AccordionItem
                    key="2"
                    aria-label="how this works"
                    title="How this works"
                    classNames={{ content: "mb-2" }}
                >
                    Users are sorted from most to least active for each category, updates once per minute.
                </AccordionItem>

                <AccordionItem
                    key="3"
                    aria-label="server activity"
                    title="Server activity"
                    classNames={{ content: "mb-2" }}
                >
                    <div>
                        <span className="font-semibold">{intl.format(pagination.messages.total)}</span> messages
                    </div>
                    <div>
                        <span className="font-semibold">{pagination.voiceminutes.total}</span> in voice
                    </div>
                    <div>
                        <span className="font-semibold"> {intl.format(pagination.invites.total)}</span> invites
                    </div>
                </AccordionItem>

            </Accordion>

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
                Are you sure you want to delete the leaderboard? It will be gone forever, probably, who knows.
            </Modal>

        </div>
    );

}