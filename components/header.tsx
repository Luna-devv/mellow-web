"use client";

import { Button, Chip, Skeleton, Switch, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiBadgeCheck, HiBeaker, HiChartPie, HiChevronDown, HiEyeOff, HiIdentification, HiLogout, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import LoginButton from "@/components/login-button";
import authorizeUser from "@/utils/authorize-user";
import cn from "@/utils/cn";

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
        <button className={cn("ml-auto flex dark:hover:bg-wamellow hover:bg-wamellow-100 py-2 px-4 rounded-md duration-200 items-center", menu && "dark:bg-wamellow bg-wamellow-100")} onClick={() => setMenu(!menu)}>

            <Skeleton isLoaded={!!user?.id} className="rounded-full mr-2 h-[30px] w-[30px]">
                <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`} size={96} alt="your avatar" />
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
        split,
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
        )
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
                relative top-2 sm:right-[268px] w-full sm:w-72 dark:bg-wamellow bg-wamellow-100 rounded-xl backdrop-blur-2xl backdrop-brightness-75 overflow-hidden shadow-xl
                flex flex-col py-2 sm:py-1 p-2 sm:p-0 text-base
                [--y-closed:-16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                [--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
            "
        >
            <div className="flex items-center space-x-3 px-4 py-2">
                <Skeleton isLoaded={!!user?.id} className="rounded-full h-14 w-14 sm:h-10 sm:w-10 shrink-0">
                    <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`} size={128} alt="your avatar" />
                </Skeleton>
                <div className="w-full">
                    <div className="dark:text-neutral-200 text-neutral-800 truncate max-w-44 flex items-center gap-2">
                        <span className="font-medium text-xl sm:text-base">{user?.global_name || `@${user?.username}`}</span>
                        {user?.id === "821472922140803112" &&
                            <Chip color="secondary" size="sm" variant="flat" startContent={<HiBadgeCheck className="h-3.5 w-3.5 mr-1" />}>
                                <span className="font-bold">Developer</span>
                            </Chip>
                        }
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400 max-w-40 truncate">
                        <span className="text-medium sm:text-sm">@{user?.username}</span>
                    </div>
                </div>
                <Tooltip content="Logout" closeDelay={0} showArrow>
                    <Link href="/login?logout=true" className="ml-auto text-red-500 m-4">
                        <HiLogout className="h-6 w-6 sm:h-5 sm:w-5" />
                    </Link>
                </Tooltip>
            </div>

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
                            className="w-full font-medium !justify-start !text-xl !my-1 sm:!text-medium sm:!my-0 bg-transparent"
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
                            <span className="ml-2 text-xl my-1 sm:text-medium sm:my-0">{button.name}</span>
                            <Switch
                                key={"headerButton-" + button.name}
                                className="ml-auto"
                                isSelected={button.value}
                                onValueChange={button.onChange}
                                aria-label={button.name}
                                color="secondary"
                                size="sm"
                            />
                        </div>

                    );
                }

            })}
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
                        <div className="pr-4 flex text-base font-medium dark:text-neutral-300 text-neutral-700 overflow-x-hidden">
                            <div className="ml-auto">
                                <div className="absolute left-0 sm:left-auto px-4 sm:px-0 z-40 w-full">{UserDropdown}</div>
                            </div>
                        </div>
                    }
                </AnimatePresence>
            </MotionConfig>

        </div>
    );
}