"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { guildStore } from "@/common/guilds";
import Highlight from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import MultiSelectMenu from "@/components/inputs/MultiSelectMenu";
import NumberInput from "@/components/inputs/NumberInput";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import { ScreenMessage } from "@/components/screen-message";
import { getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesStarboardGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/starboard` as const;

    const [data, setData] = useState<ApiV1GuildsModulesStarboardGetResponse | RouteErrorResponse>();

    const { isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesStarboardGetResponse>(url),
        {
            enabled: !!params.guildId,
            onSuccess: (d) => setData(d)
        }
    );

    const handleSwitchToggle = (enabled: boolean) => {
        if (!data) return;
        const updatedLocalData = { ...data, enabled };
        setData(updatedLocalData);
    };

    const [example, setExample] = useState({
        avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
        username: "@spacewolf.",
        color: 0,
        emoji: ""
    });

    const handleUserStyle = (value: number) => {
        switch (value) {
            case 0:
                setExample((e) => {
                    return {
                        ...e,
                        avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
                        username: "@spacewolf."
                    };
                });
                break;
            case 1:
                setExample((e) => {
                    return {
                        ...e,
                        avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
                        username: "Space Wolf"
                    };
                });
                break;
            case 2:
                setExample((e) => {
                    return {
                        ...e,
                        avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
                        username: "Luna’s Grandpa <3"
                    };
                });
                break;
            case 3:
                setExample((e) => {
                    return {
                        ...e,
                        avatar: "https://cdn.waya.one/r/a_3a2fa421f079827d31f4fd1b7a9971ba.gif",
                        username: "Luna’s Grandpa <3"
                    };
                });
                break;
        }
    };

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

    return (
        <>

            <Switch
                name="Starboard module enabled"
                url={url}
                dataName="enabled"
                defaultState={data.enabled || false}
                disabled={false}
                onSave={handleSwitchToggle}
            />

            <Switch
                name="Allow bots and webhooks"
                url={url}
                dataName="allowBots"
                defaultState={data.allowBots || false}
                disabled={!data.enabled}
            />

            <Switch
                name="Allow NSFW channels"
                url={url}
                dataName="allowNSFW"
                defaultState={data.allowNSFW || false}
                disabled={!data.enabled}
            />

            <Switch
                name="Allow message edits"
                description="If a message is being edited, update it in the data."
                url={url}
                dataName="allowEdits"
                defaultState={data.allowEdits || false}
                disabled={!data.enabled}
            />

            <Switch
                name="Allow author reaction"
                description="Lets the message author star their own messages."
                url={url}
                dataName="allowSelfReact"
                defaultState={data.allowSelfReact || false}
                disabled={!data.enabled}
            />

            <Switch
                name="Display stared message reference"
                description="Repost the message reply in the data."
                url={url}
                dataName="displayReference"
                defaultState={data.displayReference || false}
                disabled={!data.enabled}
            />

            <Switch
                name="Delete message from starboard upon losing reactions"
                description="If a message in the starboard looses the required reactions, it gets deleted."
                url={url}
                dataName="delete"
                defaultState={data.delete || false}
                disabled={!data.enabled}
            />

            <NumberInput
                name="Number of reactions required"
                description="Sets the number of reactions needed to get a message onto the data."
                url={url}
                dataName="requiredEmojis"
                defaultState={data.requiredEmojis ?? 0}
                disabled={!data.enabled}
                min={1}
            />

            <SelectMenu
                name="Channel"
                url={url}
                dataName="channelId"
                items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                description="Select the channel where the starboard messages should be send into."
                defaultState={data.channelId}
                disabled={!data.enabled}
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
                            ...guild?.emojis?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => {
                                return { icon: <Image src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`} className="rounded-md h-6 w-6" alt={c.name} height={64} width={64} />, name: c.name.replace(/-|_/g, " "), value: c.id };
                            }) || []
                        ]}
                        description="Select the emoji that needs to be reacted with."
                        defaultState={data.emoji}
                        onSave={(options) => {
                            setExample({
                                ...example,
                                emoji: options.value as string
                            });
                        }}
                        disabled={!data.enabled}
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
                                value: 0
                            },
                            {
                                name: "Global Nickname",
                                value: 1
                            },
                            {
                                name: "Nickname",
                                value: 2
                            },
                            {
                                name: "Nickname & Per-guild Avatar",
                                value: 3
                            }
                        ]}
                        description="The style members profile gets displayed."
                        defaultState={data.style}
                        onSave={(options) => handleUserStyle(options.value as number)}
                        disabled={!data.enabled}
                    />
                </div>
            </div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Blacklisted roles"
                        url={url}
                        dataName="blacklistRoleIds"
                        items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, color: r.color }))}
                        description="Select roles which should not be able to data."
                        defaultState={data.blacklistRoleIds || []}
                        max={500}
                        disabled={!data.enabled}
                    />
                </div>

                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Blacklisted channels"
                        url={url}
                        dataName="blacklistChannelIds"
                        items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id }; })}
                        description="Select channels which should not be able to be in the data."
                        defaultState={data.blacklistChannelIds || []}
                        max={500}
                        disabled={!data.enabled}
                    />
                </div>
            </div>

            <div className="py-3 px-4 rounded-md mt-4" style={{ backgroundColor: "rgb(49, 51, 56)" }}>
                <DiscordMessage
                    mode={"DARK"}
                    user={{
                        username: "Wamellow",
                        avatar: "/waya-v3-small.webp",
                        bot: true
                    }}
                >
                    <Highlight
                        mode={"DARK"}
                        text={""}
                    />

                    <DiscordMessageEmbed
                        author={{
                            icon_url: example.avatar,
                            text: example.username
                        }}
                        mode={"DARK"}
                        color={data.embedColor}
                    >
                        <div> I can imagine it now, a lunch break at Discord headquarters and a bunch of T&S staff talking to each other</div>
                        <div><strong>Staff 1:</strong> Hey did you get another ticket from that 2Lost4Discоrd guy?</div>
                        <div><strong>Staff 2:</strong> Yeah that guy really likes talking to us at this point, how about you did you get any of that Lunish one?</div>
                        <div><strong>Staff 1:</strong> Yeah I honestly gotten used to it at this point, we might need to issue a more detailed guide on using support when absolutely needed cause its getting ridiculous with those two.</div>
                        <div><strong>Staff 2:</strong> Tell me about it its like a routine on the shift.</div>

                        <br />

                        <span className="font-bold">{example.emoji} 9</span> | <span className="text-blue-500 hover:underline cursor-pointer">#・lounge</span>
                    </DiscordMessageEmbed>

                </DiscordMessage>
            </div>

        </ >
    );
}