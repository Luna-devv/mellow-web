"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsSpotify } from "react-icons/bs";
import { HiIdentification } from "react-icons/hi";

import { userStore } from "@/common/user";
import Box from "@/components/box";
import Highlight from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import { ScreenMessage } from "@/components/screen-message";
import { ApiV1UsersMeConnectionsSpotifyGetResponse, RouteErrorResponse } from "@/typings";

export default function Home({
    searchParams
}: {
    searchParams: { spotify_login_success?: string }
}) {
    const user = userStore((s) => s);

    const [spotify, setSpotify] = useState<ApiV1UsersMeConnectionsSpotifyGetResponse & { _fetched: boolean }>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/spotify`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1UsersMeConnectionsSpotifyGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setError(undefined);
                        setSpotify({ ...response, _fetched: true });
                        break;
                    }
                    case 404: {
                        // @ts-expect-error Cuz
                        setSpotify({ _fetched: true });
                        break;
                    }
                    default: {
                        // @ts-expect-error Cuz
                        setSpotify({ _fetched: true });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching user");
            });
    }, []);

    if (error) {
        return <>
            <ScreenMessage
                title="Something went wrong.."
                description={error}
                href="/profile"
                button="Go back to overview"
                icon={<HiIdentification />}
            />
        </>;
    }

    if (!spotify?._fetched) return <></>;

    return (
        <div className="h-full">

            {!spotify.displayName &&
                <ScreenMessage
                    title="Nothing to see here.. yet.."
                    description="Cool things will come soon"
                    className="bg-[#1ed760] hover:bg-[#1ed760]/80 text-black cursor-not-allowed opacity-50"
                    href={"/profile/spotify" ?? `${process.env.NEXT_PUBLIC_API}/connections/spotify`}
                    icon={<BsSpotify />}
                    button="Connect Spotify"
                />
            }

            {spotify.displayName && user?.id &&
                <>

                    <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={spotify.avatar ? spotify.avatar : "/discord.webp"} alt="your spotify avatar" className="rounded-lg mr-1 h-14 w-14" />
                        <div>
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium flex gap-1 items-center">
                                {spotify.displayName}
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
                                {searchParams.spotify_login_success === "true" && spotify.displayName && <>
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

                            <Highlight mode={"DARK"} text={`wm play [https://open.spotify.com/track/${spotify.playing?.id || "4cOdK2wGLETKBW3PvgPWqT"}](#)`} />

                        </DiscordMessage>
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3-small.webp",
                                bot: true
                            }}
                        >

                            <div className="flex items-center gap-1">
                                <Image src="https://cdn.discordapp.com/emojis/845043307351900183.gif?size=44&quality=lossless" height={18} width={18} alt="" />
                                <Highlight mode={"DARK"} text={`@${user.username} now playing [${spotify.playing?.name || "Never Gonna Give You Up"}](#) for **${spotify.playing?.duration || "3 minutes 33 seconds"}**`} />
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

                            <Highlight mode={"DARK"} text="wm" />

                        </DiscordMessage>
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3-small.webp",
                                bot: true
                            }}
                        >

                            <div className="flex items-center gap-1">
                                <Image src="https://cdn.discordapp.com/emojis/845043307351900183.gif?size=44&quality=lossless" height={18} width={18} alt="" />
                                <Highlight mode={"DARK"} text={`@${user.username} is playing [${spotify.playing?.name || "Never Gonna Give You Up"}](#) by ${spotify.playing?.artists || "[Rick Astley]()"}`} />
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