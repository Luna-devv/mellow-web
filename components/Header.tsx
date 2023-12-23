"use client";

import { Button, Skeleton } from "@nextui-org/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiArrowNarrowRight, HiBeaker, HiChartPie, HiChevronDown, HiEyeOff, HiIdentification, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import LoginButton from "@/components/login-button";
import authorizeUser from "@/utils/authorize-user";

import ImageReduceMotion from "./image-reduce-motion";

export default function Header(props: React.ComponentProps<"div">) {

    const [loggedin, setLoggedin] = useState<boolean>();
    const [menu, setMenu] = useState(false);
    const [loginstate, setLoginstate] = useState<"LOADING" | "ERRORED" | undefined>("LOADING");

    const path = usePathname() || "/";
    useEffect(() => {
        if (!["/login", "/login/spotify", "/logout"].includes(path)) localStorage.setItem("lastpage", path);

        const params = new URLSearchParams(window.location.search);
        if (params.get("spotify_login_success") === "true" && path !== "/login/spotify") window.close();

        if (!path.startsWith("/dashboard/")) guildStore.setState(undefined);
    }, [path]);

    const user = userStore((s) => s);
    const web = webStore((w) => w);

    useEffect(() => {
        setLoggedin(!!localStorage.getItem("token"));

        authorizeUser({ stateHook: setLoginstate, page: path }).then((_user) => {
            userStore.setState(Object.assign(_user || {}, { __fetched: true }));
        });

        const devToolsEnabled = localStorage.getItem("devToolsEnabled");
        const reduceMotions = localStorage.getItem("reduceMotions");

        webStore.setState({
            ...web,
            width: window?.innerWidth,
            devToolsEnabled: !!devToolsEnabled,
            reduceMotions: !!reduceMotions
        });
    }, []);


    const UserButton = (
        <button className={`ml-auto flex ${menu && "dark:bg-wamellow bg-wamellow-100"} dark:hover:bg-wamellow hover:bg-wamellow-100 py-2 px-4 rounded-md duration-200 items-center`} onClick={() => setMenu(!menu)}>

            <Skeleton isLoaded={!!user?.id} className="rounded-full mr-2 h-[30px] w-[30px]">
                <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`} size={64} alt="your avatar" />
            </Skeleton>

            {!user?.id ?
                <Skeleton className="rounded-xl w-20 h-4" />
                :
                <>
                    <div className="mr-1 relative bottom-[1px]">@{user?.username}</div>
                    <HiChevronDown />
                </>
            }

        </button>
    );

    const split = { type: "split" };

    const buttons = [
        {
            name: "Dashboard",
            icon: <HiViewGridAdd />,
            url: "/dashboard"
        },
        {
            name: "Profile",
            icon: <HiIdentification />,
            url: "/profile"
        },
        {
            name: "Reduce Motion",
            icon: <HiEyeOff />,
            value: web.reduceMotions,
            onChange: () => {
                if (!web.reduceMotions) localStorage.setItem("reduceMotions", "true");
                else localStorage.removeItem("reduceMotions");

                webStore.setState({ ...web, reduceMotions: !web.reduceMotions });
            }
        },
        ...(user?.HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY ?
            [
                split,
                {
                    name: "Analytics",
                    icon: <HiChartPie />,
                    url: "/profile/analytics"
                },
                {
                    name: "Lunar Tools",
                    icon: <HiBeaker />,
                    value: web.devToolsEnabled,
                    onChange: () => {
                        if (!web.devToolsEnabled) localStorage.setItem("devToolsEnabled", "true");
                        else localStorage.removeItem("devToolsEnabled");

                        webStore.setState({ ...web, devToolsEnabled: !web.devToolsEnabled });
                    }
                }
            ]
            :
            []
        ),
        split
    ];

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
                relative top-2 sm:right-56 w-full sm:w-60 dark:bg-wamellow bg-wamellow-100 rounded-md text-base overflow-hidden shadow-md
                flex flex-col pt-1
                max-sm:[--y-closed:-16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                max-sm:[--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
            "
        >
            {buttons.map((button, i) => {
                if ("type" in button && button.type === "split") {
                    return <hr key={"headerButton-" + button.type + i} className="my-1 mx-0 dark:border-wamellow-light border-wamellow-100-light" />;
                }

                if ("url" in button) {
                    return (
                        <Button
                            key={"headerButton-" + button.name + button.url}
                            as={Link}
                            href={button.url}
                            className="w-full !justify-start"
                            onClick={() => setMenu(false)}
                            startContent={button.icon}
                        >
                            {button.name}
                        </Button>
                    );
                }

                if ("onChange" in button) {
                    return (
                        <div
                            key={"headerButton-" + button.name}
                            className="flex items-center px-4 pt-2 pb-3"
                        >
                            {button.icon}
                            <span className="ml-2">{button.name}</span>
                            <label className="ml-auto relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={button.value}
                                    onClick={button.onChange}
                                />
                                <div
                                    className="w-11 h-6 bg-neutral-300 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"
                                />
                            </label>
                        </div>
                    );
                }

            })}

            <Link href="/login?logout=true" className="hover:bg-danger dark:text-red-400 text-red-500 dark:hover:text-red-100 hover:text-neutral-800 pt-2 pb-3 px-4 w-full duration-200 flex items-center" onClick={() => setMenu(false)}>
                <HiArrowNarrowRight />
                <span className="ml-2">Logout</span>
            </Link>
        </motion.div>
    );

    return (
        <div {...props}>

            {loggedin && loginstate !== "ERRORED" ? UserButton : <LoginButton loginstate={loginstate} />}

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

        </div>
    );
}