"use client";

import { Button, Chip } from "@nextui-org/react";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";

import DumbTextInput from "@/components/inputs/dumb-text-input";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";
import SelectMenu from "@/components/inputs/select-menu";
import { guildStore } from "@/common/guilds";

import TutorialPic from "@/public/docs-assets/notifications-get-handle.webp"
import Image from "next/image";
import Link from "next/link";

const URL_CHANNEL_REGEX = /^https:\/\/(www\.)?youtube\.com\/channel\/UC([a-zA-Z0-9_-]{16,32})$/;
const URL_HANDLE_REGEX = /^https:\/\/(www\.)?youtube\.com\/@([a-zA-Z0-9\._-]{3,30})$/;
const CHANNEL_ID = /^UC[a-zA-Z0-9_-]{16,32}$/;
const CHANNE_HANDLE = /^@?[a-zA-Z0-9\._-]{3,30}$/;

export enum Style {
    Compact = 1,
    Big = 2
}

interface Props {
    guildId: string;
    style: Style;

    addNotification: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    setNotificationId: (id: string) => void;
}

export default function CreateNotification({ guildId, style, addNotification, setNotificationId }: Props) {
    const channels = guildStore((g) => g?.channels);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [channelId, setChannelId] = useState<string>();

    function validateAccount(input: string) {
        if (URL_CHANNEL_REGEX.exec(input)) return input.split("/channel/")[1];
        if (URL_HANDLE_REGEX.exec(input)) return input.split("/@")[1];

        if (CHANNEL_ID.exec(input)) return input;
        if (CHANNE_HANDLE.exec(input)) return input.replace("@", "");

        return null;
    }

    return (
        <>
            {style === Style.Compact
                ?
                <Chip
                    as={Button}
                    className="default"
                    variant="faded"
                    onClick={() => setOpen(true)}
                    startContent={<HiPencil className="relative left-1 ml-1" />}
                >
                    Add Channel
                </Chip>
                :
                <Button
                    color="secondary"
                    onClick={() => setOpen(true)}
                    startContent={<HiPencil />}
                >
                    Add a YouTube channel
                </Button>
            }

            <Modal<ApiV1GuildsModulesNotificationsGetResponse>
                title="Create new notification"
                show={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    const validated = validateAccount(name);
                    if (!validated && name.startsWith("https://")) return new Error("Invalid channel url");
                    if (!validated) return new Error("Invalid channel id or handle");

                    const isId = CHANNEL_ID.exec(validated);

                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            guildId,
                            type: 0,
                            channelId,
                            creatorHandle: isId ? undefined : validated,
                            creatorId: isId ? validated : undefined
                        })
                    });
                }}
                onSuccess={(tag) => {
                    addNotification(tag);
                    setNotificationId(tag.id);
                }}
            >
                <DumbTextInput
                    name="Creator's @handle, id or URL"
                    placeholder="@LinusTechTips"
                    value={name}
                    setValue={setName}
                />

                <SelectMenu
                    name="Channel"
                    dataName="channelId"
                    items={channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }))}
                    description="Select a channel where notifications should be send into."
                    onSave={(o) => {
                        setChannelId(o.value as string);
                    }}
                />

                <div className="flex items-center gap-2">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">How to get a channel's @handle or Id</span>
                </div>

                <Link
                    href="/docs/notifications"
                    target="_blank"
                >
                    <Image
                        alt="How to get a Creator's @handle, id or URL"
                        className="rounded-md"
                        src={TutorialPic}
                    />
                </Link>

            </Modal>
        </>
    );

}