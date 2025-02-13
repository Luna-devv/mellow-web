"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { HiExternalLink, HiViewGridAdd } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { guildStore } from "@/common/guilds";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import { ScreenMessage } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { type ApiV1GuildsModulesStarboardGetResponse, StarboardStyle } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

import { useExample } from "./hooks";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/starboard` as const;
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesStarboardGetResponse>(url),
        {
            enabled: !!params.guildId,
            ...cacheOptions
        }
    );

    const example = useExample(data && !("message" in data)
        ? data.style
        : StarboardStyle.Username
    );

    const edit = useCallback(
        <K extends keyof ApiV1GuildsModulesStarboardGetResponse>(key: K, value: ApiV1GuildsModulesStarboardGetResponse[K]) => {
            if (!data || "message" in data) return;

            queryClient.setQueryData<ApiV1GuildsModulesStarboardGetResponse>(url, () => ({
                ...data,
                [key]: value
            }));
        },
        [data]
    );

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                top="0rem"
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    return (<>
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                className="ml-auto"
                as={Link}
                href="/docs/starboard"
                target="_blank"
                endContent={<HiExternalLink />}
                size="sm"
            >
                Read docs
            </Button>
        </div>

        <Switch
            name="Starboard module enabled"
            url={url}
            dataName="enabled"
            defaultState={data.enabled}
            disabled={false}
            onSave={(v) => edit("enabled", v)}
        />

        <Switch
            name="Allow bots, apps and webhooks"
            url={url}
            dataName="allowBots"
            defaultState={data.allowBots}
            disabled={!data.enabled}
            onSave={(v) => edit("allowBots", v)}
        />

        <Switch
            name="Allow NSFW channels"
            url={url}
            dataName="allowNSFW"
            defaultState={data.allowNSFW}
            disabled={!data.enabled}
            onSave={(v) => edit("allowNSFW", v)}
        />

        <Switch
            name="Allow message edits"
            description="If a message is being edited, update it in the data."
            url={url}
            dataName="allowEdits"
            defaultState={data.allowEdits}
            disabled={!data.enabled}
            onSave={(v) => edit("allowEdits", v)}
        />

        <Switch
            name="Allow author reaction"
            description="Lets the message author star their own messages."
            url={url}
            dataName="allowSelfReact"
            defaultState={data.allowSelfReact}
            disabled={!data.enabled}
            onSave={(v) => edit("allowSelfReact", v)}
        />

        <Switch
            name="Display stared message reference"
            description="Repost the message reply in the data."
            url={url}
            dataName="displayReference"
            defaultState={data.displayReference}
            disabled={!data.enabled}
            onSave={(v) => edit("displayReference", v)}
        />

        <Switch
            name="Delete message from starboard upon losing reactions"
            description="If a message in the starboard looses the required reactions, it gets deleted."
            url={url}
            dataName="delete"
            defaultState={data.delete}
            disabled={!data.enabled}
            onSave={(v) => edit("delete", v)}
        />

        <NumberInput
            name="Number of reactions required"
            description="Sets the number of reactions needed to get a message onto the data."
            url={url}
            dataName="requiredEmojis"
            defaultState={data.requiredEmojis ?? 0}
            disabled={!data.enabled}
            min={1}
            onSave={(v) => edit("requiredEmojis", v)}
        />

        <SelectMenu
            name="Channel"
            url={url}
            dataName="channelId"
            items={createSelectableItems(guild?.channels)}
            description="Select the channel where the starboard messages should be send into."
            defaultState={data.channelId}
            disabled={!data.enabled}
            onSave={(o) => edit("channelId", o.value as string)}
        />

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <SelectMenu
                    name="Emoji"
                    url={url}
                    dataName="emoji"
                    items={[
                        { icon: "⭐", name: "Star", value: "⭐" },
                        { icon: "✨", name: "Sparkles", value: "✨" },
                        ...guild?.emojis?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({
                            icon: (
                                <Image
                                    src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`}
                                    className="rounded-md h-6 w-6"
                                    alt={c.name}
                                    height={64}
                                    width={64}
                                />
                            ),
                            name: c.name.replace(/-|_/g, " "),
                            value: c.id
                        })) || []
                    ]}
                    description="Select the emoji that needs to be reacted with."
                    defaultState={data.emoji}
                    disabled={!data.enabled}
                    onSave={(o) => edit("emoji", o.value as string)}
                />
            </div>

            <div className="lg:w-1/2">
                <SelectMenu
                    name="Profile display style"
                    url={url}
                    dataName="style"
                    items={[
                        {
                            name: "Username",
                            value: StarboardStyle.Username
                        },
                        {
                            name: "Global Nickname",
                            value: StarboardStyle.GlobalName
                        },
                        {
                            name: "Nickname",
                            value: StarboardStyle.Nickname
                        },
                        {
                            name: "Nickname & Per-guild Avatar",
                            value: StarboardStyle.NicknameAndGuildAvatar
                        },
                        {
                            name: "Anonymous (removes the username & avatar)",
                            value: StarboardStyle.Anonymous
                        }
                    ]}
                    description="The style members profile gets displayed."
                    defaultState={data.style}
                    disabled={!data.enabled}
                    onSave={(o) => edit("style", o.value as number)}
                />
            </div>
        </div>

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Blacklisted channels"
                    url={url}
                    dataName="blacklistChannelIds"
                    items={createSelectableItems(guild?.channels)}
                    description="Select channels which should not be able to get into the starboard."
                    defaultState={data.blacklistChannelIds || []}
                    max={500}
                    disabled={!data.enabled}
                    onSave={(o) => edit("blacklistChannelIds", o.map(({ value }) => value as string))}
                />
            </div>
            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Blacklisted roles"
                    url={url}
                    dataName="blacklistRoleIds"
                    items={createSelectableItems(guild?.roles)}
                    description="Select roles which should not be able to star or be starred."
                    defaultState={data.blacklistRoleIds || []}
                    max={500}
                    disabled={!data.enabled}
                    onSave={(o) => edit("blacklistChannelIds", o.map(({ value }) => value as string))}
                />
            </div>
        </div>

        <div className="py-3 px-4 rounded-md mt-4" style={{ backgroundColor: "rgb(49, 51, 56)" }}>
            <DiscordMessage
                mode={"DARK"}
                user={{
                    username: "Wamellow",
                    avatar: "/waya-v3.webp",
                    bot: true
                }}
            >
                <DiscordMarkdown
                    mode={"DARK"}
                    text={""}
                />

                <DiscordMessageEmbed
                    className="max-w-lg"
                    author={example.username
                        ? {
                            icon_url: example.avatar!,
                            text: example.username
                        }
                        : undefined
                    }
                    mode={"DARK"}
                    color={data.embedColor}
                >
                    <div>
                        Hello 112 here, please speak your message right after this ad. 112 is sponsored by... raid shadow legends!
                    </div>

                    <br />

                    <div className="flex items-center gap-1">
                        <span className="font-bold flex items-center">
                            <Emoji emoji={data.emoji} /> 9
                        </span>
                        |
                        <span className="text-blue-500 hover:underline cursor-pointer">
                            #lounge
                        </span>
                    </div>

                </DiscordMessageEmbed>

            </DiscordMessage>
        </div>
    </>);
}

function Emoji({ emoji }: { emoji: string; }) {
    if (!/\d{15,20}/.test(emoji)) {
        return emoji;
    }

    return (
        <Image
            alt=""
            className="rounded size-[18px] mr-1"
            src={`https://cdn.discordapp.com/emojis/${emoji}.webp?size=64`}
            height={32}
            width={32}
        />
    );
}