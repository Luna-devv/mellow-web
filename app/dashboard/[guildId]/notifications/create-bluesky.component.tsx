"use client";

import { useState } from "react";

import { guildStore } from "@/common/guilds";
import DumbTextInput from "@/components/inputs/dumb-text-input";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

const URL_CHANNEL_REGEX = /^https?:\/\/((www|m)\.)?bsky\.app\/profile\/did:plc:[a-z0-9]{20,30}$/;
const URL_HANDLE_REGEX = /^https?:\/\/((www|m)\.)?bsky\.app\/profile\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
const CHANNEL_ID = /^did:plc:[a-z0-9]{20,30}$/;
const CHANNE_HANDLE = /^@?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

function validateAccount(input: string) {
    if (URL_CHANNEL_REGEX.exec(input)) return input.split("/profile/")[1];
    if (URL_HANDLE_REGEX.exec(input)) return input.split("/profile/")[1];

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

export function BlueskyNotificationModal({
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
                        type: NotificationType.Bluesky,
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
                name="Users's handle or URL"
                placeholder="mwlica.bsky.social"
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

            <div>
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">How to get a user&apos;s handle</span>
                <br />

                Your handle is likely something like <code className="break-all">mwlica.bsky.social</code>, some others may have a handle like <code>lunish.nl</code>.
                <br />
                <br />

                Though, you can also use the link of the user&apos;s profile.
            </div>

        </Modal>
    </>);
}