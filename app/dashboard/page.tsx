"use client";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiRefresh, HiUserAdd, HiViewGrid, HiViewList } from "react-icons/hi";

import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import ErrorBanner from "@/components/Error";
import ImageReduceMotion from "@/components/image-reduce-motion";
import DumbTextInput from "@/components/inputs/Dumb_TextInput";
import { ScreenMessage } from "@/components/screen-message";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { RouteErrorResponse, UserGuild } from "@/typings";
import cn from "@/utils/cn";
import { truncate } from "@/utils/truncate";

const MAX_GUILDS = 24;

export default function Home() {
    const web = webStore((w) => w);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [guilds, setGuilds] = useState<UserGuild[]>([]);
    const [search, setSearch] = useState<string>("");
    const [display, setDisplay] = useState<"LIST" | "GRID">("GRID");

    function filter(guild: UserGuild) {
        if (!search) return true;

        if (guild.name.toLowerCase().includes(search.toLowerCase())) return true;
        if (search.toLowerCase().includes(guild.name.toLowerCase())) return true;

        if (guild.id.includes(search)) return true;
        if (search.includes(guild.id)) return true;

        return false;
    }

    const { length } = guilds.filter(filter);

    useEffect(() => {

        setDisplay((localStorage.getItem("dashboardServerSelectStyle") || "GRID") as "LIST" | "GRID");

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/@me`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as UserGuild[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setGuilds(response);
                        break;
                    }
                    default: {
                        setError((response as unknown as RouteErrorResponse).message || "Error while fetching guilds");
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching guilds");
            });

    }, []);

    useEffect(() => {
        localStorage.setItem("dashboardServerSelectStyle", display);
    }, [display]);

    return (
        <div className="flex flex-col w-full">
            <title>Dashboard</title>

            {error && <ErrorBanner message={error} />}
            <div className="md:flex md:items-center">
                <div>
                    <div className="text-2xl dark:text-neutral-100 text-neutral-900 font-semibold mb-2">👋 Heyia, {user?.global_name || `@${user?.username}`}</div>
                    <div className="text-lg font-medium">Select a server you want to manage.</div>
                </div>

                {web.devToolsEnabled &&
                    <div className="md:hidden mt-3">
                        <DumbTextInput
                            value={search}
                            setValue={setSearch}
                            placeholder="Search"
                            thin
                        />
                    </div>
                }

                <div className="md:ml-auto flex gap-3 mt-4 md:mt-0">
                    {web.devToolsEnabled &&
                        <div className="hidden md:block">
                            <DumbTextInput
                                value={search}
                                setValue={setSearch}
                                placeholder="Search"
                                thin
                            />
                        </div>
                    }
                    <Button
                        as={Link}
                        href="/login?invite=true"
                        className="w-1/2 md:w-min"
                        startContent={<HiUserAdd />}
                    >
                        Add to Server
                    </Button>
                    <Button
                        as={Link}
                        href="/login"
                        className="button-primary w-1/2 md:w-min"
                        startContent={<HiRefresh />}
                    >
                        Reload
                    </Button>
                </div>
            </div>

            <div className="flex gap-3">
                <hr className="mx-0 p-1 my-4 dark:border-wamellow-light border-wamellow-100-light w-full" />

                <div className="dark:bg-wamellow bg-wamellow-100 md:flex gap-1 dark:text-neutral-400 text-neutral-600 rounded-md overflow-hidden w-[72px] mb-5 hidden">
                    <button onClick={() => setDisplay("GRID")} className={cn("h-7 w-8 flex items-center justify-center p-[4px] rounded-md", display === "GRID" ? "dark:bg-neutral-700/50 bg-neutral-400/50" : "dark:bg-neutral-800/30 bg-neutral-400/30")}>
                        <HiViewGrid />
                    </button>
                    <button onClick={() => setDisplay("LIST")} className={cn("h-7 w-8 flex items-center justify-center p-[4px] rounded-md", display === "LIST" ? "dark:bg-neutral-700/50 bg-neutral-400/50" : "dark:bg-neutral-800/30 bg-neutral-400/30")}>
                        <HiViewList />
                    </button>
                </div>
            </div>

            {guilds.length ?
                <motion.ul
                    variants={{
                        hidden: { opacity: 1, scale: 0 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                                delayChildren: guilds.length > 20 ? 0.2 : 0.3,
                                staggerChildren: guilds.length > 20 ? 0.1 : 0.2
                            }
                        }
                    }}
                    initial={web.reduceMotions ? "visible" : "hidden"}
                    animate="visible"
                    className={cn("grid grid-cols-1 gap-4 w-full", display === "GRID" && "lg:grid-cols-3 md:grid-cols-2")}
                >

                    {guilds
                        .filter(filter)
                        .slice(0, MAX_GUILDS)
                        .map((guild) => (
                            <motion.li
                                key={"guildGrid" + guild.id}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: {
                                        y: 0,
                                        opacity: 1,
                                        transition: {
                                            type: "spring",
                                            bounce: guilds.length > 20 ? 0.2 : 0.4,
                                            duration: guilds.length > 20 ? 0.35 : 0.7
                                        }
                                    }
                                }}
                                className="dark:bg-wamellow bg-wamellow-100 p-4 flex items-center rounded-lg drop-shadow-md overflow-hidden relative h-24 duration-100 outline-violet-500 hover:outline group/card"
                            >
                                <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} size={24} alt="" forceStatic={true} className="absolute top-[-48px] left-0 w-full z-0 blur-xl opacity-30" />

                                <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} size={56} alt={`Server icon of @${guild.name}`} className="rounded-lg h-14 w-14 z-1 relative drop-shadow-md" />
                                <div className="ml-3 text-sm relative bottom-1">
                                    <div className="text-lg dark:text-neutral-200 font-medium text-neutral-800 mb-1">{truncate(guild.name, 20)}</div>
                                    <span className="flex gap-2">
                                        <ManageButton guildId={guild.id} />
                                        <LeaderboardButton guildId={guild.id} />
                                    </span>
                                </div>

                            </motion.li>
                        ))}

                    <motion.a
                        href="/login?invite=true"
                        target="_blank"
                        key={"guildGrid" + guilds.length}
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: {
                                y: 0,
                                opacity: 1,
                                transition: {
                                    type: "spring",
                                    bounce: 0.4,
                                    duration: 0.7
                                }
                            }
                        }}
                        className="border-2 dark:border-wamellow border-wamellow-100 p-4 flex justify-center items-center rounded-lg drop-shadow-md overflow-hidden relative h-24 duration-100 outline-violet-500 hover:outline"
                    >
                        Click to add a new server
                    </motion.a>

                </motion.ul>
                :
                <div className={cn("border-2 dark:border-wamellow border-wamellow-100 p-4 flex justify-center items-center rounded-lg drop-shadow-md overflow-hidden relative h-24", display === "GRID" && "md:w-1/2 lg:w-1/3")}>
                    Loading your servers...
                </div>
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
            className="default dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20 bg-neutral-400/40 hover:bg-neutral-400/20 text-sm h-9 opacity-0 group-hover/card:opacity-100"
        >
            Leaderboard
        </Button>
    );
}