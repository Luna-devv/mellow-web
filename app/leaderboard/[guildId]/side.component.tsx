"use client";

import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiAnnotation, HiLink, HiShare, HiTrash, HiViewGridAdd, HiVolumeUp } from "react-icons/hi";

import { webStore } from "@/common/webstore";
import Ad from "@/components/ad";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import ErrorBanner from "@/components/Error";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesLeaderboardGetResponse, ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

export default function Side({
    guildId,
    design,
    pagination,
    currentCircular
}: {
    guildId: string;
    design: ApiV1GuildsModulesLeaderboardGetResponse;
    pagination: ApiV1GuildsTopmembersPaginationGetResponse;
    currentCircular: "next" | "server" | undefined;
}) {
    const web = webStore((w) => w);
    const router = useRouter();

    const [modal, setModal] = useState(false);
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    return (
        <div className="flex flex-col gap-3">
            {!!design}

            <CopyToClipboardButton
                className="w-full !justify-start"
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
                        classNames={{ content: "mb-2" }}
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
                            className="w-full !justify-start mt-2"
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
                    <br />
                    <br />
                    The percentage {currentCircular !== "server" ? "indicates the gap in messages needed to surpass the next user" : "reflects the contribution of server activity from that user"}.
                </AccordionItem>

                <AccordionItem
                    key="3"
                    aria-label="server activity"
                    title="Server activity"
                    classNames={{ content: "mb-2" }}
                >
                    <div className="flex items-center gap-1">
                        <HiAnnotation className="mr-1" />
                        <span className="font-semibold">{intl.format(pagination.messages.total)}</span> messages
                    </div>
                    <div className="flex items-center gap-1">
                        <HiVolumeUp className="mr-1" />
                        <span className="font-semibold">{pagination.voiceminutes.total}</span> in voice
                    </div>
                    <div className="flex items-center gap-1">
                        <HiLink className="mr-1" />
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