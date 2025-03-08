"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { BsSpotify } from "react-icons/bs";
import { useQuery } from "react-query";

import { userStore } from "@/common/user";
import Box from "@/components/box";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import type { ApiV1UsersMeConnectionsSpotifyGetResponse } from "@/typings";

interface Props {
    searchParams: Promise<{ spotify_login_success?: string; }>;
}

export default function Home({ searchParams }: Props) {
    const search = use(searchParams);
    const user = userStore((s) => s);

    const url = "/users/@me/connections/spotify" as const;

    const { isLoading, data, error } = useQuery(
        url,
        () => getData<ApiV1UsersMeConnectionsSpotifyGetResponse>(url),
        cacheOptions
    );

    if (error || (data && "message" in data && data.status !== 404)) {
        return (
            <ScreenMessage
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    return (
        <div className="h-full">

            {"status" in data &&
                <ScreenMessage
                    title="Nothing to see here.. yet.."
                    description="Cool things will come soon"
                    className="bg-[#1ed760] hover:bg-[#1ed760]/80 text-black cursor-not-allowed opacity-50"
                    href="/login/spotify"
                    icon={<BsSpotify />}
                    button="Connect Spotify"
                />
            }

            {"displayName" in data && user?.id &&
                <>

                    <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={data.avatar ? data.avatar : "/discord.webp"} alt="your spotify avatar" className="rounded-lg mr-1 h-14 w-14" />
                        <div>
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium flex gap-1 items-center">
                                {data.displayName}
                                <BsSpotify className="h-4 relative top-0.5 text-[#1ed760]" />
                            </div>
                            <div className="flex items-center">
                                <Link
                                    className="text-violet-500 opacity-60 hover:opacity-80 duration-200"
                                    href="/login/spotify?logout=true"
                                    prefetch={false}
                                >
                                    Not you?
                                </Link>
                                {search.spotify_login_success === "true" && data.displayName && <>
                                    <span className="mx-2 text-neutral-500">•</span>
                                    <div className="text-green-500 duration-200">Link was successfull!</div>
                                </>}
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-b dark:border-wamellow-light border-wamellow-100-light md:hidden mt-6" />

                    <Box className="mt-6 flex flex-col gap-6 overflow-hidden" small>

                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: user.globalName || user.username,
                                avatar: user.avatar ? `https://cdn.discordapp.com/avatars/821472922140803112/${user.avatar}.webp?size=64` : "/discord.webp",
                                bot: false
                            }}
                        >

                            <DiscordMarkdown mode={"DARK"} text={`wm play [https://open.spotify.com/track/${data.playing?.id || "4cOdK2wGLETKBW3PvgPWqT"}](#)`} />

                        </DiscordMessage>
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3.webp",
                                bot: true
                            }}
                        >

                            <div className="flex items-center gap-1">
                                <Image src="https://cdn.discordapp.com/emojis/845043307351900183.gif?size=44&quality=lossless" height={18} width={18} alt="" />
                                <DiscordMarkdown mode={"DARK"} text={`@${user.username} now playing [${data.playing?.name || "Never Gonna Give You Up"}](#) for **${data.playing?.duration || "3 minutes 33 seconds"}**`} />
                            </div>

                            <div className="flex flex-row gap-1.5 h-8 mt-3">
                                <div className="dark:border-neutral-600/90 border-neutral-400/90 border-2 h-full w-32 py-2.5 px-4 rounded-md flex items-center justify-center cursor-pointer">
                                    <div className="dark:bg-neutral-600/90 bg-neutral-400/90 h-full w-full rounded-full" />
                                </div>
                                <div className="dark:border-neutral-600/90 border-neutral-400/90 border-2 h-full w-16 py-2.5 px-4 rounded-md flex items-center justify-center cursor-pointer">
                                    <div className="dark:bg-neutral-600/90 bg-neutral-400/90 h-full w-full rounded-full" />
                                </div>
                                <div className="dark:border-neutral-600/90 border-neutral-400/90 border-2 h-full w-16 py-2.5 px-4 rounded-md flex items-center justify-center cursor-pointer">
                                    <div className="dark:bg-neutral-600/90 bg-neutral-400/90 h-full w-full rounded-full" />
                                </div>
                            </div>

                        </DiscordMessage>

                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: user.globalName || user.username,
                                avatar: user.avatar ? `https://cdn.discordapp.com/avatars/821472922140803112/${user.avatar}.webp?size=64` : "/discord.webp",
                                bot: false
                            }}
                        >

                            <DiscordMarkdown mode={"DARK"} text="wm" />

                        </DiscordMessage>
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3.webp",
                                bot: true
                            }}
                        >

                            <div className="flex items-center gap-1">
                                <Image src="https://cdn.discordapp.com/emojis/845043307351900183.gif?size=44&quality=lossless" height={18} width={18} alt="" />
                                <DiscordMarkdown mode={"DARK"} text={`@${user.username} is playing [${data.playing?.name || "Never Gonna Give You Up"}](#) by ${data.playing?.artists || "[Rick Astley]()"}`} />
                            </div>

                            <div className="flex gap-1.5 h-8 mt-3">
                                <div className="dark:border-neutral-700/90 border-neutral-300/90 border-2 h-full w-32 py-2.5 px-4 rounded-md flex items-center justify-center cursor-pointer">
                                    <div className="dark:bg-neutral-700/90 bg-neutral-300/90 h-full w-full rounded-full" />
                                </div>
                                <div className="dark:border-neutral-700/90 border-neutral-300/90 border-2 h-full w-16 py-2.5 px-4 rounded-md flex items-center justify-center cursor-pointer">
                                    <div className="dark:bg-neutral-700/90 bg-neutral-300/90 h-full w-full rounded-full" />
                                </div>
                                <div className="dark:border-neutral-700/90 border-neutral-300/90 border-2 h-full w-16 py-2.5 px-4 rounded-md flex items-center justify-center cursor-pointer">
                                    <div className="dark:bg-neutral-700/90 bg-neutral-300/90 h-full w-full rounded-full" />
                                </div>
                            </div>

                        </DiscordMessage>

                    </Box>

                </>
            }


        </div>
    );
}