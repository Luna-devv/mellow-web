"use client";

import { guildStore } from "@/common/guilds";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import TextInput from "@/components/inputs/text-input";
import Notice from "@/components/notice";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api/hook";
import { type ApiV1GuildsModulesStarboardGetResponse, GuildFlags, StarboardStyle } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { createSelectableItems } from "@/utils/create-selectable-items";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiExternalLink } from "react-icons/hi";

import { useExample } from "./hooks";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/starboard` as const;
    const { data, isLoading, error, edit } = useApi<ApiV1GuildsModulesStarboardGetResponse>(url);

    const enabled = (guild!.flags & GuildFlags.StarboardEnabled) !== 0;

    const example = useExample(data && !("message" in data)
        ? data.style
        : StarboardStyle.Username
    );

    if (isLoading) return <></>;

    if (!data || error) return (
        <div>
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                asChild
                size="sm"
            >
                <Link
                    href="/docs/starboard"
                    target="_blank"
                >
                    <HiExternalLink />
                    Read docs
                </Link>
            </Button>
        </div>

        <Switch
            label="Enable Starboard"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={enabled}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardEnabled)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardEnabled) })}
        />

        <Switch
            label="Allow bots, apps and webhooks"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.StarboardAllowBots) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardAllowBots)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardAllowBots) })}
        />

        <Switch
            label="Allow NSFW channels"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.StarboardAllowNSFW) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardAllowNSFW)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardAllowNSFW) })}
        />

        <Switch
            label="Allow message edits"
            description="If a message is being edited, update it in the data."
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.StarboardAllowEdits) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardAllowEdits)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardAllowEdits) })}
        />

        <Switch
            label="Allow author reaction"
            description="Lets the message author star their own messages."
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.StarboardAllowSelf) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardAllowSelf)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardAllowSelf) })}
        />

        <Switch
            label="Display stared message reference"
            description="Repost the message reply in the data."
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.StarboardDisplayReference) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardDisplayReference)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardDisplayReference) })}
        />

        <Switch
            label="Delete message from starboard upon losing reactions"
            description="If a message in the starboard looses the required reactions, it gets deleted."
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.StarboardDeleteOnLoss) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.StarboardDeleteOnLoss)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.StarboardDeleteOnLoss) })}
        />

        <NumberInput
            name="Number of reactions required"
            description="Sets the number of reactions needed to get a message onto the data."
            url={url}
            dataName="requiredEmojis"
            defaultState={data.requiredEmojis ?? 0}
            disabled={!enabled}
            min={2}
            onSave={(v) => edit("requiredEmojis", v)}
        />

        <SelectMenu
            name="Channel"
            url={url}
            dataName="channelId"
            items={createSelectableItems(guild?.channels)}
            description="Select the channel where the starboard messages should be send into."
            defaultState={data.channelId}
            disabled={!enabled}
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
                    disabled={!enabled}
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
                    disabled={!enabled}
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
                    disabled={!enabled}
                    onSave={(o) => edit("blacklistChannelIds", o.map(({ value }) => value))}
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
                    disabled={!enabled}
                    onSave={(o) => edit("blacklistChannelIds", o.map(({ value }) => value))}
                />
            </div>
        </div>

        <div className="lg:flex gap-3">
            <div className="w-1/2">
                <TextInput
                    name="Color"
                    url={url}
                    dataName="embedColor"
                    description="Color used for the side of the embed."
                    type="color"
                    defaultState={data.embedColor ?? 0}
                    onSave={(o) => edit("embedColor", o as number)}
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
            className="rounded-sm size-[18px] mr-1"
            src={`https://cdn.discordapp.com/emojis/${emoji}.webp?size=64`}
            height={32}
            width={32}
        />
    );
}