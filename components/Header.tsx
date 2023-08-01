"use client";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FunctionComponent, useEffect, useState } from "react";
import { HiArrowNarrowRight, HiBeaker, HiChevronDown, HiEyeOff, HiIdentification, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import LoginButton from "@/components/LoginButton";
import authorizeUser from "@/utils/authorizeUser";

import ImageReduceMotion from "./ImageReduceMotion";

const inter = Inter({ subsets: ["latin"] });

interface Props {
    children: React.ReactNode
}

const Header: FunctionComponent<Props> = ({ children }) => {

    const [menu, setMenu] = useState<boolean>(false);
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

        webStore.setState({
            ...web,
            width: window?.innerWidth,
            devToolsEnabled: !!devToolsEnabled
        });

        // setInterval(() => {
        //     if (window?.innerWidth !== web.width) webStore.setState({ ...web, width: window?.innerWidth });
        // }, 1000);
    }, []);

    const UserButton = (
        <button className={`ml-auto flex ${menu && "dark:bg-wamellow bg-wamellow-100"} dark:hover:bg-wamellow hover:bg-wamellow-100 py-2 px-4 rounded-md duration-200 items-center`} onClick={() => setMenu(!menu)}>
            <ImageReduceMotion url={user?.id ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : "/discord.png"} size={32} alt="your avatar" className="rounded-full mr-2 h-[30px] w-[30px]" />
            <div className="mr-1">@{user?.username}</div>
            <HiChevronDown />
        </button>
    );

    const UserDropdown = (
        <div className="relative bottom-2 right-60 dark:bg-wamellow bg-wamellow-100 rounded-md w-60 text-base overflow-hidden shadow-md">

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
        </div>
    );

    return (
        <html lang="en" className="flex justify-center min-h-full max-w-full overflow-x-hidden">
            <Analytics />

            {/* make this relative to support the footer, will break the header (lol) */}
            <body className={`${inter.className} w-full max-w-6xl min-h-full`}>

                <div className="absolute left-0 bg-gradient-to-r from-indigo-400 to-pink-400 h-8 w-full flex items-center justify-center text-white font-medium text-sm">
                    {web.width > 512 ?
                        <div>
                            {user?.username && web.width > 624 && `Hey, @${user.username}!`} Please note that this is an <span className="underline decoration-dotted break-word">early alpha version</span> of the bot and the website!
                        </div>
                        :
                        <div>
                            This is an <span className="underline decoration-dotted break-word">early alpha version</span>!
                        </div>
                    }
                </div>

                <div className="p-4 flex items-center gap-2 text-base font-medium dark:text-neutral-300 text-neutral-700 select-none mt-7">
                    <Link href="/" className="flex items-center mr-2">
                        <Image src="/waya-legacy1.png" width={34} height={34} alt="wamellow" className="rounded-full mr-2" />
                        <span className="text-xl dark:text-neutral-100 text-neutral-900">Wamellow</span>
                    </Link>

                    {web.width > 512 &&
                        <>
                            <Link href="/privacy" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Privacy</Link>
                            <Link href="/support" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Support</Link>
                        </>
                    }

                    {!user?.id ? <LoginButton loginstate={loginstate} width={web.width} /> : UserButton}
                </div>

                {user?.id && menu &&
                    <div className="pr-4 flex text-base font-medium dark:text-neutral-300 text-neutral-700 select-none overflow-x-hidden">
                        <div className="ml-auto overflow-x-hidden"><div className="absolute z-10">{UserDropdown}</div></div>
                    </div>
                }

                <main className="dark:text-neutral-300 text-neutral-700 flex flex-col items-center justify-between md:p-5 p-3 w-6xl max-w-full mt-2 md:mt-10">
                    {children}
                </main>

                {/* <div className="absolute bottom-0 text-neutral-500 w-full max-w-6xl mt-10 mb-6">
                    <div>&copy; Wamellow {new Date(1635609600000).getFullYear()} - {new Date().getFullYear()}, Not affiliated with Discord Inc.</div>
                    <div className="flex gap-2 mt-2">
                        <Link href="/docs" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Documentation</Link>
                        <Link href="/terms" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Terms of Service</Link>
                        <Link href="/terms#privacy" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Privacy Policy</Link>
                        <Link href="/status" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Status</Link>
                    </div>
                </div> */}

            </body>

        </html>
    );
};

export default Header;