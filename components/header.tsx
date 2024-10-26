"use client";

import { Button, Chip, Skeleton, Switch, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import React, { useEffect, useState } from "react";
import { HiAdjustments, HiBadgeCheck, HiBeaker, HiChartPie, HiChevronDown, HiEyeOff, HiFire, HiIdentification, HiLogout, HiTrendingUp, HiViewGridAdd } from "react-icons/hi";

import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import LoginButton from "@/components/login-button";
import { authorize } from "@/utils/authorize-user";
import cn from "@/utils/cn";

import ImageReduceMotion from "./image-reduce-motion";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

export default function Header(props: React.ComponentProps<"div">) {
    const cookies = useCookies();
    const devTools = cookies.get("devTools") === "true";
    const reduceMotions = cookies.get("reduceMotions") === "true";

    const [menu, setMenu] = useState(false);
    const [state, setState] = useState<State>(State.Loading);

    const user = userStore((s) => s);
    const router = useRouter();

    useEffect(() => {

        authorize({ setState })
            .then((_user) => {
                userStore.setState({
                    ...(_user || {}),
                    __fetched: true
                });
            });

        webStore.setState({
            width: window?.innerWidth
        });
    }, []);


    const UserButton = () => (
        <button
            className={cn(
                "ml-auto flex dark:hover:bg-wamellow hover:bg-wamellow-100 py-2 px-4 rounded-md duration-200 items-center",
                menu && "dark:bg-wamellow bg-wamellow-100"
            )}
            onClick={() => setMenu(!menu)}
        >

            <Skeleton isLoaded={!!user?.id} className="rounded-full mr-2 h-[30px] w-[30px]">
                <ImageReduceMotion
                    alt="your avatar"
                    className="rounded-full"
                    url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                    size={96}
                />
            </Skeleton>

            {!user?.id ?
                <Skeleton className="rounded-xl w-20 h-4" />
                :
                <>
                    <div className="mr-1 relative bottom-[1px]">{user?.globalName || user?.username}</div>
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
            value: reduceMotions,
            onChange: () => {
                if (!reduceMotions) cookies.set("reduceMotions", "true", { expires: 365 });
                else cookies.remove("reduceMotions");
                router.refresh();
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
                    name: "Debug",
                    icon: <HiAdjustments />,
                    url: "/debug"
                },
                {
                    name: "Issues",
                    icon: <HiFire />,
                    url: "https://redirect.wamellow.com/issues"
                },
                {
                    name: "Metrics",
                    icon: <HiTrendingUp />,
                    url: "https://redirect.wamellow.com/metrics"
                },
                {
                    name: "Lunar Tools",
                    icon: <HiBeaker />,
                    value: devTools,
                    onChange: () => {
                        if (!devTools) cookies.set("devTools", "true", { expires: 365 });
                        else cookies.remove("devTools");
                        router.refresh();
                    }
                }
            ]
            :
            []
        )
    ];

    const UserDropdown = () => (
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
                relative top-2 sm:right-[268px] w-full sm:w-72 dark:bg-black/40 bg-white/40 rounded-xl backdrop-blur-3xl backdrop-brightness-75 overflow-hidden shadow-xl
                flex flex-col py-2 sm:py-1 p-2 sm:p-0 text-base
                [--y-closed:-16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                [--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
            "
        >
            <div className="flex items-center space-x-3 px-4 py-2">
                <Skeleton isLoaded={!!user?.id} className="rounded-full h-14 w-14 sm:h-10 sm:w-10 shrink-0">
                    <ImageReduceMotion
                        alt="your avatar"
                        className="rounded-full"
                        url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                        size={128}
                    />
                </Skeleton>
                <div className="w-full">
                    <div className="dark:text-neutral-200 text-neutral-800 truncate max-w-44 flex items-center gap-2">
                        <span className="font-medium text-xl sm:text-base">
                            {user?.globalName || `@${user?.username}`}
                        </span>
                        {user?.id === "821472922140803112" &&
                            <Chip color="secondary" size="sm" variant="flat" startContent={<HiBadgeCheck className="h-3.5 w-3.5 mr-1" />}>
                                <span className="font-bold">Developer</span>
                            </Chip>
                        }
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400 max-w-40 truncate -mt-1">
                        <span className="text-medium sm:text-sm">
                            @{user?.username}
                        </span>
                    </div>
                </div>
                <Tooltip
                    content="Logout"
                    closeDelay={0}
                    showArrow
                >
                    <button
                        className="ml-auto text-red-500 m-4"
                        onClick={() => {
                            window.location.href = "/login?logout=true";
                            userStore.setState({ __fetched: true });
                            setMenu(false);
                        }}
                    >
                        <HiLogout className="h-6 w-6 sm:h-5 sm:w-5" />
                    </button>
                </Tooltip>
            </div>

            {buttons.map((button, i) => {
                if ("type" in button && button.type === "split") return (
                    <hr key={"headerButton-" + button.type + i} className="my-1 mx-2 dark:border-wamellow border-wamellow-100" />
                );

                if ("url" in button) return (
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

                if ("onChange" in button) return (
                    <div
                        key={"headerButton-" + button.name}
                        className="flex items-center px-4 pt-2 pb-3"
                    >
                        {button.icon}
                        <span className="ml-[9px] text-xl my-1 sm:text-medium sm:my-0">{button.name}</span>
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

            })}
        </motion.div>
    );

    return (<div {...props}>

        {state === State.Failure
            ? <LoginButton state={state} />
            : <UserButton />
        }

        <MotionConfig
            transition={reduceMotions ?
                { duration: 0 }
                :
                { type: "spring", bounce: 0.4, duration: menu ? 0.7 : 0.4 }
            }
        >
            <AnimatePresence initial={false}>
                {user?.id && menu &&
                    <div className="pr-4 flex text-base font-medium dark:text-neutral-300 text-neutral-700 overflow-x-hidden">
                        <div className="ml-auto">
                            <div className="absolute left-0 sm:left-auto px-4 sm:px-0 z-40 w-full sm:w-0">
                                <UserDropdown />
                            </div>
                        </div>
                    </div>
                }
            </AnimatePresence>
        </MotionConfig>

    </div>);
}