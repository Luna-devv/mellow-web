"use client";

import { Accordion, AccordionItem, Button, Code } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiAnnotation, HiLink, HiTrash, HiViewGridAdd, HiVolumeUp } from "react-icons/hi";

import Ad from "@/components/ad";
import Modal from "@/components/modal";
import Notice, { NoticeType } from "@/components/notice";
import { Share } from "@/components/share";
import type { ApiError, ApiV1GuildsGetResponse, ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";

export default function Side({
    guild,
    pagination
}: {
    guild: ApiV1GuildsGetResponse | ApiError | undefined;
    pagination: ApiV1GuildsTopmembersPaginationGetResponse | ApiError | undefined;
}) {
    const cookies = useCookies();
    const router = useRouter();

    const [modal, setModal] = useState(false);

    return (
        <div className="flex flex-col gap-3">

            {guild && "id" in guild &&
                <Share
                    title="Share leaderboard"
                    url={getCanonicalUrl("leaderboard", guild.id)}
                    text={`Check out the leaderboard for ${guild.name} on #wamellow! ${guild.inviteUrl ? `Join ${guild.inviteUrl.split("://")[1]} and get to be the top #discord member :p` : ""}`}
                />
            }

            {guild && "inviteUrl" in guild && guild.inviteUrl &&
                <Button
                    as={Link}
                    className="w-full !justify-start"
                    color="secondary"
                    href={guild.inviteUrl}
                    target="_blank"
                    startContent={<BsDiscord />}
                >
                    Join {guild.name}
                </Button>
            }

            <Ad />

            <Accordion
                selectionMode="multiple"
                defaultExpandedKeys={["1", "2", "3"]}
                disableAnimation={cookies.get("reduceMotions") === "true"}
            >

                {guild && "id" in guild && cookies.get("devTools") ?
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
                            href={getCanonicalUrl("dashboard", guild.id as string)}
                            startContent={<HiViewGridAdd />}
                        >
                            Dashboard
                        </Button>
                    </AccordionItem>
                    :
                    undefined as unknown as React.JSX.Element
                }

                {pagination && "messages" in pagination ?
                    <AccordionItem
                        key="3"
                        aria-label="about this server"
                        title={`About ${guild && "name" in guild ? guild?.name : "this server"}`}
                        classNames={{ content: "mb-2" }}
                    >
                        {guild && "description" in guild && guild?.description &&
                            <p className="mb-6">
                                {guild.description}
                            </p>
                        }

                        <div className="flex items-center gap-1">
                            <HiAnnotation className="mr-1" />
                            <span className="font-semibold">{intl.format(pagination.messages.total)}</span> messages
                        </div>
                        <div className="flex items-center gap-1">
                            <HiVolumeUp className="mr-1" />
                            <span className="font-semibold">{pagination.voiceminutes.formattedTotal}</span> in voice
                        </div>
                        <div className="flex items-center gap-1">
                            <HiLink className="mr-1" />
                            <span className="font-semibold"> {intl.format(pagination.invites.total)}</span> invites
                        </div>
                    </AccordionItem>
                    : undefined as unknown as React.JSX.Element
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
                    The percentage {
                        cookies.get("lbc") !== "server"
                            ? "indicates the gap in messages needed to surpass the next user"
                            : "reflects the contribution of server activity from that user"
                    }.
                </AccordionItem>

                {guild && "id" in guild && guild?.inviteUrl ?
                    <AccordionItem
                        key="4"
                        aria-label="invite privacy"
                        title="Invite privacy"
                        classNames={{ content: "mb-2" }}
                    >
                        The invite on this sidebar is taken from the widget, if you want to remove the invite from this page, disable the widget in your discord server settings or remove <Code color="secondary">Manage Guild</Code> permission from the bot.
                        <br />
                        <br />
                        <strong>NOTE: </strong> It might take up to an hour for this page to update.
                    </AccordionItem>
                    :
                    undefined as unknown as React.JSX.Element
                }
            </Accordion>

            <Modal
                title="Reset @everyone's stats"
                buttonName="Reset"
                variant="destructive"
                isOpen={modal}
                onClose={() => setModal(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild && "id" in guild ? guild?.id : ""}/top-members`, {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                }}
                onSuccess={() => {
                    router.refresh();
                }}
            >
                <Notice
                    type={NoticeType.Info}
                    message="Takes a few seconds to apply"
                />
                Are you sure you want to delete the leaderboard? It will be gone forever, probably, who knows.
            </Modal>

        </div>
    );

}