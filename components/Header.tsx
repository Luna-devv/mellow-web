"use client";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FunctionComponent, useEffect, useState } from "react";
import { HiArrowNarrowRight, HiBeaker, HiChevronDown, HiEyeOff, HiIdentification, HiViewGridAdd } from "react-icons/hi";
import { SiKofi } from "react-icons/si";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import LoginButton from "@/components/LoginButton";
import authorizeUser from "@/utils/authorizeUser";

import TopggIcon from "./icons/topgg";
import ImageReduceMotion from "./ImageReduceMotion";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

interface Props {
    children: React.ReactNode
}

const Header: FunctionComponent<Props> = ({ children }) => {

    const [menu, setMenu] = useState(false);
    const [loginstate, setLoginstate] = useState<"LOADING" | "ERRORED" | undefined>(undefined);

    const path = usePathname() || "/";
    useEffect(() => {
        if (!["/login", "/logout"].includes(path)) localStorage.setItem("lastpage", path);

        if (!path.startsWith("/dashboard/")) guildStore.setState(undefined);
    }, [path]);

    const user = userStore((s) => s);
    useEffect(() => {
        authorizeUser({ stateHook: setLoginstate, page: path }).then((_user) => {
            if (_user) userStore.setState(_user);
        });
    }, []);

    const web = webStore((w) => w);
    useEffect(() => {
        const devToolsEnabled = localStorage.getItem("devToolsEnabled");
        const reduceMotions = localStorage.getItem("reduceMotions");

        webStore.setState({
            ...web,
            width: window?.innerWidth,
            devToolsEnabled: !!devToolsEnabled,
            reduceMotions: !!reduceMotions
        });

        // setInterval(() => {
        //     if (window?.innerWidth !== web.width) webStore.setState({ ...web, width: window?.innerWidth });
        // }, 1000);
    }, []);

    const UserButton = (
        <button className={`ml-auto flex ${menu && "dark:bg-wamellow bg-wamellow-100"} dark:hover:bg-wamellow hover:bg-wamellow-100 py-2 px-4 rounded-md duration-200 items-center`} onClick={() => setMenu(!menu)}>
            <ImageReduceMotion url={user?.id ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : "/discord.png"} size={64} alt="your avatar" className="rounded-full mr-2 h-[30px] w-[30px]" />
            <div className="mr-1 relative bottom-[1px]">@{user?.username}</div>
            <HiChevronDown />
        </button>
    );

    const UserDropdown = (
        <motion.div
            initial="closed"
            animate={menu ? "open" : "closed"}
            exit="closed"
            variants={{
                closed: {
                    y: "var(--y-closed, 0)",
                    opacity: "var(--opacity-closed)",
                    scale: "var(--scale-closed, 1)"
                },
                open: {
                    y: "var(--y-open, 0)",
                    opacity: "var(--opacity-open)",
                    scale: "var(--scale-open, 1)"
                }
            }}
            className="
                relative bottom-2 sm:right-60 w-full sm:w-60 dark:bg-wamellow bg-wamellow-100 rounded-md text-base overflow-hidden shadow-md
                max-sm:[--y-closed:-16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                max-sm:[--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
            "
        >

            <Link href="/dashboard" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha pt-3 pb-2 px-4 w-full duration-200 flex items-center" onClick={() => setMenu(false)}>
                <HiViewGridAdd />
                <span className="ml-2">Dashboard</span>
            </Link>
            <Link href="/profile" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-3 px-4 w-full duration-200 flex items-center" onClick={() => setMenu(false)}>
                <HiIdentification />
                <span className="ml-2">Profile</span>
            </Link>

            <div className="flex items-center px-4 pt-2 pb-3">
                <HiEyeOff />
                <span className="ml-2" title="Disables difs & animations.">Reduce Motion</span>
                <label className="ml-auto relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={web.reduceMotions}
                        onClick={() => {
                            if (!web.reduceMotions) localStorage.setItem("reduceMotions", "true");
                            else localStorage.removeItem("reduceMotions");

                            webStore.setState({ ...web, reduceMotions: !web.reduceMotions });
                        }}
                    />
                    <div
                        className="w-11 h-6 bg-neutral-300 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"
                    />
                </label>
            </div>

            {user?.HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY &&
                <div className="mb-3 mt-1">
                    <hr className="mb-3 dark:border-wamellow-light border-wamellow-100-light" />

                    <div className="flex items-center px-4">
                        <HiBeaker />
                        <span className="ml-2">Admin tools</span>
                        <label className="ml-auto relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={web.devToolsEnabled}
                                onClick={() => {
                                    if (!web.devToolsEnabled) localStorage.setItem("devToolsEnabled", "true");
                                    else localStorage.removeItem("devToolsEnabled");

                                    webStore.setState({ ...web, devToolsEnabled: !web.devToolsEnabled });
                                }}
                            />
                            <div
                                className="w-11 h-6 bg-neutral-300 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"
                            />
                        </label>
                    </div>

                </div>
            }

            <hr className="my-1 mx-0 dark:border-wamellow-light border-wamellow-100-light" />
            <Link href="/login?logout=true" className="hover:bg-danger dark:text-red-400 text-red-500 dark:hover:text-red-100 hover:text-neutral-800 pt-2 pb-3 px-4 w-full duration-200 flex items-center" onClick={() => setMenu(false)}>
                <HiArrowNarrowRight />
                <span className="ml-2">Logout</span>
            </Link>
        </motion.div>
    );

    return (
        <html lang="en" className="flex justify-center min-h-full max-w-full overflow-x-hidden">

            <body className={`${inter.className} w-full max-w-7xl min-h-full`}>

                <div className="absolute left-0 bg-gradient-to-r from-indigo-400 to-pink-400 h-8 w-full flex items-center justify-center text-white font-medium text-sm">
                    <div className="hidden md:block">
                        {user?.username && web.width > 624 && `Hey, @${user.username}!`} Please note that this is an <span className="underline decoration-dotted break-word">early alpha version</span> of the bot and the website!
                    </div>
                    <div className="block md:hidden">
                        This is an <span className="underline decoration-dotted break-word">early alpha version</span>!
                    </div>
                </div>

                <nav className="p-4 flex items-center gap-2 text-base font-medium dark:text-neutral-300 text-neutral-700 select-none mt-7">
                    <Link href="/" className={`${montserrat.className} font-semibold flex items-center mr-2`}>
                        <Image src="/waya-v3.webp" width={34} height={34} alt="wamellow" className="rounded-full mr-2" />
                        <span className="text-xl dark:text-neutral-100 text-neutral-900">Wamellow</span>
                    </Link>

                    <div className="hidden sm:flex gap-1">
                        <Link href="https://lunish.nl/kofi" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center gap-2 group">
                            <SiKofi className="group-hover:text-[#ff6c6b] duration-200" /> Support us
                        </Link>
                        <Link href="https://top.gg/bot/1125449347451068437/vote" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center gap-2 group">
                            <TopggIcon className="group-hover:text-[#ff3366] duration-200 h-5 w-5" /> Vote
                        </Link>
                    </div>

                    {!user?.id ? <LoginButton loginstate={loginstate} /> : UserButton}
                </nav>

                <MotionConfig
                    transition={web.reduceMotions ?
                        { duration: 0 }
                        :
                        { type: "spring", bounce: 0.4, duration: menu ? 0.7 : 0.4 }
                    }
                >
                    <AnimatePresence initial={false}>
                        {user?.id && menu &&
                            <div className="pr-4 flex text-base font-medium dark:text-neutral-300 text-neutral-700 select-none overflow-x-hidden">
                                <div className="ml-auto overflow-x-hidden"><div className="absolute left-0 sm:left-auto px-4 sm:px-0 z-10 w-full">{UserDropdown}</div></div>
                            </div>
                        }
                    </AnimatePresence>
                </MotionConfig>

                <main className="dark:text-neutral-400 text-neutral-700 flex flex-col items-center justify-between md:p-5 p-3 w-6xl max-w-full mt-2 md:mt-10">
                    {children}
                </main>

            </body>

        </html>
    );
};

export default Header;