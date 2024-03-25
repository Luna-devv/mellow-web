"use client";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import { HiRefresh, HiUserAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import DumbTextInput from "@/components/inputs/Dumb_TextInput";
import Notice, { NoticeType } from "@/components/notice";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { UserGuild } from "@/typings";
import cn from "@/utils/cn";

const MAX_GUILDS = 24;

export default function Home() {
    const cookies = useCookies();
    const user = userStore((u) => u);

    const display = "GRID";
    const [search, setSearch] = useState<string>("");

    function filter(guild: UserGuild) {
        if (!search) return true;

        if (guild.name.toLowerCase().includes(search.toLowerCase())) return true;
        if (search.toLowerCase().includes(guild.name.toLowerCase())) return true;

        if (guild.id.includes(search)) return true;
        if (search.includes(guild.id)) return true;

        return false;
    }

    const url = "/guilds/@me" as const;

    const { isLoading, data, error } = useQuery(
        url,
        () => getData<UserGuild[]>(url),
        {
            enabled: !!user?.id,
            ...cacheOptions
        }
    );

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                top="0rem"
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

    const { length } = (data || []).filter(filter);

    const springAnimation = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: data.length > 20 ? 0.2 : 0.4,
                duration: data.length > 20 ? 0.35 : 0.7
            }
        }
    } as const;

    return (
        <div className="flex flex-col w-full">

            {error ?
                <Notice
                    type={NoticeType.Error}
                    message={`${error}`}
                />
                :
                <></>
            }

            <div className="flex flex-col md:flex-row md:items-center gap-2">

                <div className="relative top-2 md:max-w-sm w-full">
                    <DumbTextInput
                        value={search}
                        setValue={setSearch}
                        placeholder="Search"
                        thin
                    />
                </div>

                <div className="md:ml-auto flex gap-3 md:mt-0">
                    <Button
                        as={Link}
                        className="w-1/2 md:w-min"
                        href="/login?invite=true"
                        prefetch={false}
                        startContent={<HiUserAdd />}
                    >
                        Add to Server
                    </Button>
                    <Button
                        as={Link}
                        className="button-primary w-1/2 md:w-min"
                        href="/login"
                        prefetch={false}
                        startContent={<HiRefresh />}
                    >
                        Reload
                    </Button>
                </div>

            </div>

            {!isLoading &&
                <motion.ul
                    variants={{
                        hidden: { opacity: 1, scale: 0 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                                delayChildren: data.length > 20 ? 0.2 : 0.3,
                                staggerChildren: data.length > 20 ? 0.1 : 0.2
                            }
                        }
                    }}
                    initial={cookies.get("reduceMotions") === "true" ? "visible" : "hidden"}
                    animate="visible"
                    className={cn(
                        "grid grid-cols-1 gap-4 w-full mt-4",
                        display === "GRID" && "lg:grid-cols-3 md:grid-cols-2"
                    )}
                >

                    {data
                        .filter(filter)
                        .slice(0, MAX_GUILDS)
                        .map((guild) => (
                            <motion.li
                                key={"guildGrid" + guild.id}
                                className="dark:bg-wamellow bg-wamellow-100 p-4 flex items-center rounded-lg drop-shadow-md overflow-hidden relative h-24 duration-100 outline-violet-500 hover:outline group/card"
                                variants={springAnimation}
                            >
                                <ImageReduceMotion
                                    alt=""
                                    className="absolute top-[-48px] left-0 w-full z-0 blur-xl opacity-30 pointer-events-none"
                                    size={24}
                                    url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                                    forceStatic={true}
                                />

                                <ImageReduceMotion
                                    alt={`Server icon of @${guild.name}`}
                                    className="rounded-lg h-14 w-14 z-1 relative drop-shadow-md"
                                    size={56}
                                    url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                                />

                                <div className="ml-3 text-sm relative bottom-1">
                                    <span className="text-lg dark:text-neutral-200 font-medium text-neutral-800 mb-1 sm:max-w-64 lg:max-w-56 truncate">
                                        {guild.name}
                                    </span>
                                    <div className="flex gap-2">
                                        <ManageButton guildId={guild.id} />
                                        <LeaderboardButton guildId={guild.id} />
                                    </div>
                                </div>

                            </motion.li>
                        ))}

                    <motion.a
                        href="/login?invite=true"
                        target="_blank"
                        key={"guildGrid" + data.length}
                        className="border-2 dark:border-wamellow border-wamellow-100 p-4 flex justify-center items-center rounded-lg drop-shadow-md overflow-hidden relative h-24 duration-100 outline-violet-500 hover:outline"
                        variants={springAnimation}
                    >
                        Click to add a new server
                    </motion.a>

                </motion.ul>
            }

            {length > MAX_GUILDS &&
                <ScreenMessage
                    title="There are too many servers.."
                    description={`To save some performance, use the search to find a guild. Showing ${MAX_GUILDS} out of ~${length < 100 ? length : Math.round(length / 100) * 100}.`}
                >
                    <Image src={SadWumpusPic} alt="" height={141} width={124} />
                </ScreenMessage>
            }

        </div>
    );
}

function ManageButton({ guildId }: { guildId: string }) {
    const searchParams = useSearchParams();

    return (
        <Button
            as={Link}
            href={`/dashboard/${guildId}${searchParams.get("to") ? `/${searchParams.get("to")}` : ""}`}
            className="default dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20 bg-neutral-400/40 hover:bg-neutral-400/20 text-sm h-9"
        >
            Manage
        </Button>
    );
}

function LeaderboardButton({ guildId }: { guildId: string }) {
    return (
        <Button
            as={Link}
            href={`/leaderboard/${guildId}`}
            className="default dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20 bg-neutral-400/40 hover:bg-neutral-400/20 text-sm h-9 md:opacity-0 group-hover/card:opacity-100"
        >
            Leaderboard
        </Button>
    );
}