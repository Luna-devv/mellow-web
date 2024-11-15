"use client";

import { Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import DumbTextInput from "@/components/inputs/dumb-text-input";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import TutorialPic from "@/public/docs-assets/notifications-get-handle.webp";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

const URL_CHANNEL_REGEX = /^https:\/\/(www\.)?youtube\.com\/channel\/UC([a-zA-Z0-9_-]{16,32})$/;
const URL_HANDLE_REGEX = /^https:\/\/(www\.)?youtube\.com\/@([a-zA-Z0-9._-]{3,30})$/;
const CHANNEL_ID = /^UC[a-zA-Z0-9_-]{16,32}$/;
const CHANNE_HANDLE = /^@?[a-zA-Z0-9._-]{3,30}$/;

export const Style = {
    Compact: 1,
    Big: 2
} as const;

interface Props {
    style: typeof Style[keyof typeof Style];
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;
}

export default function CreateNotification({
    style,
    add,
    set
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const channels = guildStore((g) => g?.channels);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [channelId, setChannelId] = useState<string | null>(null);

    function validateAccount(input: string) {
        if (URL_CHANNEL_REGEX.exec(input)) return input.split("/channel/")[1];
        if (URL_HANDLE_REGEX.exec(input)) return input.split("/@")[1];

        if (CHANNEL_ID.exec(input)) return input;
        if (CHANNE_HANDLE.exec(input)) return input.replace("@", "");

        return null;
    }

    return (<>
        {style === Style.Compact
            ?
            <Chip
                as={Button}
                className="default"
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
            isOpen={open}
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
                        type: 0,
                        channelId,
                        creatorHandle: isId ? undefined : validated,
                        creatorId: isId ? validated : undefined
                    })
                });
            }}
            onSuccess={(tag) => {
                add(tag);
                set(tag.id);

                setName("");
                setChannelId(null);
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
                items={createSelectableItems(channels)}
                description="Select a channel where notifications should be send into."
                onSave={(o) => {
                    setChannelId(o.value as string);
                }}
            />

            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">How to get a channel&apos;s @handle or Id</span>
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
    </>);
}