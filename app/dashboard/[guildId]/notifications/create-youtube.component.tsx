"use client";

import Image from "next/image";
import { useState } from "react";

import { guildStore } from "@/common/guilds";
import DumbTextInput from "@/components/inputs/dumb-text-input";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { Section } from "@/components/section";
import TutorialPic from "@/public/docs-assets/notifications-channel-urls.webp";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

const URL_CHANNEL_REGEX = /^https?:\/\/((www|m)\.)?youtube\.com\/channel\/UC([a-zA-Z0-9_-]{16,32})$/;
const URL_HANDLE_REGEX = /^https?:\/\/((www|m)\.)?youtube\.com\/@([a-zA-Z0-9._-]{3,30})$/;
const CHANNEL_ID = /^UC[a-zA-Z0-9_-]{16,32}$/;
const CHANNE_HANDLE = /^@?[a-zA-Z0-9._-]{3,30}$/;

function validateAccount(input: string) {
    if (URL_CHANNEL_REGEX.exec(input)) return input.split("/channel/")[1];
    if (URL_HANDLE_REGEX.exec(input)) return input.split("/@")[1];

    if (CHANNEL_ID.exec(input)) return input;
    if (CHANNE_HANDLE.exec(input)) return input.replace("@", "");

    return null;
}

interface Props {
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;

    isOpen: boolean;
    onClose: () => void;
}

export function YoutubeNotificationModal({
    add,
    set,

    isOpen,
    onClose
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const channels = guildStore((g) => g?.channels);

    const [name, setName] = useState("");
    const [channelId, setChannelId] = useState<string | null>(null);

    return (<>
        <Modal<ApiV1GuildsModulesNotificationsGetResponse>
            title="Create new notification"
            isOpen={isOpen}
            onClose={onClose}
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
                        type: NotificationType.YouTube,
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
            isDisabled={!name || !channelId}
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

            <Section tight title="How to get a usersname">
                <Image
                    alt="How to get a Creator's @handle, id or URL"
                    className="rounded-md"
                    src={TutorialPic}
                />
            </Section>
        </Modal>
    </>);
}