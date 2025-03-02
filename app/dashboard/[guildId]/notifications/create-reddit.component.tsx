"use client";

import { useState } from "react";

import { guildStore } from "@/common/guilds";
import DumbTextInput from "@/components/inputs/dumb-text-input";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

const URL_CHANNEL_REGEX = /^https?:\/\/((www|m|old|oauth)\.)?reddit\.com\/r\/(?=.{3,21}$)[A-Za-z][A-Za-z0-9_]*\/?$/;
const CHANNE_HANDLE = /^((\/)?r\/)?(?=.{3,21}$)[A-Za-z][A-Za-z0-9_]*$/;

function validateAccount(input: string) {
    if (URL_CHANNEL_REGEX.exec(input)) return input.split("/r/")[1].replace(/\/$/, "");
    if (CHANNE_HANDLE.exec(input)) return input.replace(/^(\/)?r\//, "");
    return null;
}

interface Props {
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;

    isOpen: boolean;
    onClose: () => void;
}

export function RedditNotificationModal({
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
                if (!validated && name.startsWith("https://")) return new Error("Invalid subreddit url");
                if (!validated) return new Error("Invalid subreddit name");

                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: NotificationType.Reddit,
                        channelId,
                        creatorHandle: validated
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
                name="Subreddit"
                placeholder="r/wamellow"
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

            <div className="mt-4">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">How to get a subreddits&apos; name</span>
                <br />

                The subreddit name is the string with the leading <code className="break-all">r/</code>, such as <code>r/wamellow</code>.
                <br />
                <br />

                Though, you can also use the link of the subreddit.
            </div>

        </Modal>
    </>);
}