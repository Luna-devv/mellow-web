"use client";

import { Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import { HiExternalLink, HiPencil, HiTrash } from "react-icons/hi";

import { Guild } from "@/common/guilds";
import SelectInput from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import TextInput from "@/components/inputs/text-input";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesLeaderboardUpdatingPostResponse } from "@/typings";

interface Props {
    guild: Guild;
    lb: ApiV1GuildsModulesLeaderboardUpdatingPostResponse | undefined;
    type: "messages" | "voiceminutes" | "invites";
}

interface Embed {
    title?: string;
    color?: number;
    thumbnail?: string;
    image?: string;
}

enum ModalType {
    CreateAndEdit = 1,
    Delete = 2
}

export default function UpdatingLeaderboardCard({
    guild,
    lb,
    type
}: Props) {
    const cookies = useCookies();

    const [leaderboard, setLeaderboard] = useState(lb);
    const [modal, setModal] = useState<ModalType>();

    const [channelId, setChannelId] = useState(leaderboard?.channelId);
    const [structure, setStructure] = useState(leaderboard?.structure || 1);
    const [emoji, setEmoji] = useState(leaderboard?.emoji);
    const [styles, setStyles] = useState<ApiV1GuildsModulesLeaderboardUpdatingPostResponse["styles"]>(leaderboard?.styles || { useQuotes: false, rank: null, number: null, user: null });
    const [embed, setEmbed] = useState<Embed>({});

    const stylesList = [
        { name: "Bold", value: "**" },
        { name: "Italic", value: "*" },
        { name: "Unerline", value: "__" },
        { name: "Code", value: "`" },
        { name: "None", value: null }
    ];

    const { locale } = Intl.DateTimeFormat().resolvedOptions();
    const time = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return (<div className="md:w-1/3 flex md:items-center flex-col">
        <div>
            <div className="text-sm mb-0.5">Updating {type} {leaderboard?.channelId && "in"}</div>

            {leaderboard?.channelId &&
                <Link
                    target="_blank"
                    href={`https://discord.com/channels/${leaderboard?.guildId}/${leaderboard?.channelId}/${leaderboard?.messageId}`}
                    className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium flex items-center gap-2 group"
                >
                    #{guild?.channels?.find((c) => c.id === leaderboard?.channelId)?.name}
                    <HiExternalLink className="group-hover:opacity-100 opacity-0 dark:text-neutral-300 text-neutral-700 h-5 w-5" />
                </Link>
            }

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setModal(ModalType.CreateAndEdit)}
                    className="flex dark:text-violet-400/60 dark:hover:text-violet-400/90 text-violet-600/60 hover:text-violet-600/90 duration-200"
                >
                    <HiPencil className="h-4 w-4 relative top-1" />
                    <span className="ml-1">
                        {leaderboard?.channelId ? "Edit" : "Create"} leaderboard
                    </span>
                </button>

                {leaderboard?.channelId &&
                    <button
                        onClick={() => setModal(ModalType.Delete)}
                        className="flex dark:text-red-400/60 dark:hover:text-red-400/90 text-red-600/60 hover:text-red-600/90 duration-200"
                    >
                        <HiTrash className="h-5 relative top-0.5" />
                        <span className="ml-1">
                            Delete
                        </span>
                    </button>
                }
            </div>

        </div>

        <Modal
            className="flex flex-col gap-3"
            title={`${type.replace(/^\w/, (match) => match.toUpperCase())} leaderboard`}
            isOpen={modal === ModalType.CreateAndEdit && !!guild}
            isDisabled={!channelId}
            onClose={() => {
                setModal(undefined);
            }}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/modules/leaderboard/updating`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type,
                        channelId,
                        structure,
                        emoji,
                        styles,
                        embed: leaderboard?.channelId
                            ? undefined
                            : embed
                    })
                });
            }}
            onSuccess={() => {
                setLeaderboard({
                    ...leaderboard,
                    type,
                    // @ts-expect-error it works
                    channelId, structure, emoji,
                    styles
                });
            }}
            footer={leaderboard && cookies.get("devTools") &&
                <div className="text-xs flex flex-col">
                    {leaderboard.createdAt &&
                        <span>
                            <span className="opacity-50">Cr. </span>
                            {time.format(new Date(leaderboard.createdAt).getTime())}
                        </span>
                    }

                    {leaderboard.updatedAt &&
                        <span>
                            <span className="opacity-50">Up. </span>
                            {time.format(new Date(leaderboard.updatedAt).getTime())}
                        </span>
                    }
                </div>
            }
        >

            <SelectInput
                name="Channel"
                items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }))}
                description="Select a channel where updates should be send into."
                defaultState={leaderboard?.channelId || undefined}
                onSave={(o) => {
                    setChannelId(o.value as string);
                }}
            />

            <div className="mb-3">
                <div className="text-lg dark:text-neutral-300 text-neutral-700 font-medium mb-1">Leaderboard syle</div>

                <Tabs
                    aria-label="Display format"
                    color="secondary"
                    variant="bordered"
                    defaultSelectedKey={structure?.toString()}
                    onSelectionChange={(i) => setStructure(parseInt(i as string))}
                    fullWidth
                >
                    <Tab
                        key="0"
                        title={
                            <div className="flex items-center space-x-2">
                                Embed
                            </div>
                        }
                    />
                    <Tab
                        key="1"
                        title={
                            <div className="flex items-center space-x-2">
                                Image Grid
                            </div>
                        }
                    />
                    <Tab
                        key="2"
                        title={
                            <div className="flex items-center space-x-2">
                                Image List
                            </div>
                        }
                    />
                </Tabs>
            </div>

            {structure === 0 && <>
                <div className="flex gap-2">
                    <SelectInput
                        name="Rank"
                        items={stylesList}
                        defaultState={leaderboard?.styles?.rank || undefined}
                        onSave={(o) => {
                            setStyles({ ...styles, rank: o.value as null });
                        }}
                    />
                    <SelectInput
                        name="Number"
                        items={stylesList}
                        defaultState={leaderboard?.styles?.number || undefined}
                        onSave={(o) => {
                            setStyles({ ...styles, number: o.value as null });
                        }}
                    />
                    <SelectInput
                        name="User"
                        items={stylesList}
                        defaultState={leaderboard?.styles?.user || undefined}
                        onSave={(o) => {
                            setStyles({ ...styles, user: o.value as null });
                        }}
                    />
                </div>

                <SelectInput
                    name="Emoji"
                    items={guild?.emojis?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({
                        icon: <Image
                            src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`}
                            className="rounded-md h-6 w-6"
                            alt={c.name}
                            height={64}
                            width={64}
                        />,
                        name: c.name.replace(/-|_/g, " "),
                        value: c.id
                    })) || []}
                    description="Select a emots which will be between shown after the data count."
                    defaultState={leaderboard?.emoji || undefined}
                    showClear
                    onSave={(o) => {
                        setEmoji(o.value as string);
                    }}
                />

                {!leaderboard?.channelId &&
                    <TextInput
                        name="Title"
                        description="The title of the embed"
                        defaultState={"☕ " + `${type.replace(/^\w/, (match) => match.toUpperCase())} leaderboard`}
                        max={256}
                        onSave={(v) => {
                            setEmbed({
                                ...embed,
                                title: v as string
                            });
                        }}
                    />
                }

                <Switch
                    name="Use quotes for text"
                    isTickbox
                    defaultState={leaderboard?.styles?.useQuotes || false}
                    onSave={(s) => {
                        setStyles({ ...styles, useQuotes: s });
                    }}
                />
            </>}
        </Modal>

        <Modal
            className="flex flex-col gap-3"
            buttonName="Delete"
            variant="danger"
            title={`Delete ${type.replace(/^\w/, (match) => match.toUpperCase())} leaderboard`}
            isOpen={modal === ModalType.Delete && !!guild}
            onClose={() => {
                setModal(undefined);
            }}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/modules/leaderboard/updating`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ type })
                });
            }}
            onSuccess={() => {
                setChannelId(undefined);
                setStructure(0);
                setEmoji(undefined);
                setStyles({ useQuotes: false, rank: null, number: null, user: null });
                setLeaderboard(undefined);
            }}
        >
            Are you sure you want to deactivate this leaderboard?
            This still stop updating the message in discord.
            This will not reset or delete any statistics or ranks.
        </Modal>

    </div>);

}