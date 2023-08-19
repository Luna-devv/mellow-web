"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiPlus, HiViewGrid, HiViewList } from "react-icons/hi";

import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import ErrorBanner from "@/components/Error";
import ImageReduceMotion from "@/components/ImageReduceMotion";
import DumbTextInput from "@/components/inputs/Dumb_TextInput";
import LoginButton from "@/components/LoginButton";
import { RouteErrorResponse, UserGuild } from "@/typings";
import { truncate } from "@/utils/truncate";

export default function Home() {
    const web = webStore((w) => w);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [guilds, setGuilds] = useState<UserGuild[]>([]);
    const [search, setSearch] = useState<string>("");
    const [display, setDisplay] = useState<"LIST" | "GRID">("GRID");

    const searchParams = useSearchParams();

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
                    <div className="text-lg">Select a server you want to manage.</div>
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
                    <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 w-full md:w-auto h-min justify-center">
                        <HiPlus className="relative top-1" />
                        <span className="ml-2">Add to Server</span>
                    </Link>
                    <LoginButton
                        className="w-full md:w-fit text-center"
                        addClassName="justify-center"
                        message="Reload"
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <hr className="mx-0 p-1 my-4 dark:border-wamellow-light border-wamellow-100-light w-full" />

                <div className="dark:bg-wamellow bg-wamellow-100 md:flex gap-1 dark:text-neutral-400 text-neutral-600 rounded-md overflow-hidden w-[72px] mb-5 hidden">
                    <button onClick={() => setDisplay("GRID")} className={`h-7 w-8 flex items-center justify-center p-[4px] rounded-md ${display === "GRID" ? "dark:bg-neutral-700/50 bg-neutral-400/50" : "dark:bg-neutral-800/30 bg-neutral-400/30"}`}>
                        <HiViewGrid />
                    </button>
                    <button onClick={() => setDisplay("LIST")} className={`h-7 w-8 flex items-center justify-center p-[4px] rounded-md ${display === "LIST" ? "dark:bg-neutral-700/50 bg-neutral-400/50" : "dark:bg-neutral-800/30 bg-neutral-400/30"}`}>
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
                                delayChildren: 0.3,
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    initial={web.reduceMotions ? "visible" : "hidden"}
                    animate="visible"
                    className={`grid ${display === "GRID" && "lg:grid-cols-3 md:grid-cols-2"} grid-cols-1 gap-4 w-full`}
                >

                    {guilds
                        .filter((g) => {
                            if (!search) return true;

                            if (g.name.toLowerCase().includes(search.toLowerCase())) return true;
                            if (search.toLowerCase().includes(g.name.toLowerCase())) return true;

                            if (g.id.includes(search)) return true;
                            if (search.includes(g.id)) return true;

                            return false;
                        })
                        .map((guild, index) => (
                            <>
                                <motion.li
                                    key={index}
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
                                    className="dark:bg-wamellow bg-wamellow-100 p-4 flex items-center rounded-lg drop-shadow-md overflow-hidden relative h-24 duration-100 outline-violet-500 hover:outline group/card"
                                >
                                    <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} size={24} alt="" forceStatic={true} className="absolute top-[-48px] left-0 w-full z-0 blur-xl opacity-30" />

                                    <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} size={56} alt={`Server icon of @${guild.name}`} className="rounded-lg h-14 w-14 z-1 relative drop-shadow-md" />
                                    <div className="ml-3 text-sm relative bottom-1">
                                        <div className="text-lg dark:text-neutral-200 font-medium text-neutral-800 mb-1">{truncate(guild.name, 20)}</div>
                                        <span className="flex gap-2">
                                            <Link href={`/dashboard/${guild.id}${searchParams.get("to") ? `/${searchParams.get("to")}` : ""}`} className="dark:bg-neutral-500/40 bg-neutral-400/40 dark:hover:bg-neutral-400/40 hover:bg-neutral-500/40 hover:text-neutral-900 dark:hover:text-neutral-200 py-1.5 px-3 rounded-md duration-200">Manage</Link>
                                            <Link href={`/leaderboard/${guild.id}`} className="dark:bg-neutral-500/40 bg-neutral-400/40 dark:hover:bg-neutral-400/40 hover:bg-neutral-500/40 hover:text-neutral-900 dark:hover:text-neutral-200 py-1.5 px-3 rounded-md duration-200 opacity-0 group-hover/card:opacity-100">Leaderboard</Link>
                                        </span>
                                    </div>

                                </motion.li>
                            </>
                        ))}

                    <motion.button
                        key={guilds.length}
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
                    </motion.button>

                </motion.ul>
                :
                <div className="border-2 dark:border-wamellow border-wamellow-100 p-4 flex justify-center items-center rounded-lg drop-shadow-md overflow-hidden relative h-24 w-1/3">
                    Loading your servers...
                </div>
            }

        </div>
    );
}