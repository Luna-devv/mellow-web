"use client";

import { Switch } from "@nextui-org/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiAdjustments, HiBeaker, HiChartPie, HiChevronDown, HiEyeOff, HiFire, HiIdentification, HiLogout, HiTrendingUp, HiViewGridAdd } from "react-icons/hi";

import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import { LoginButton } from "@/components/login-button";
import { authorize } from "@/utils/authorize-user";
import { cn } from "@/utils/cn";

import ImageReduceMotion from "./image-reduce-motion";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

const split = { type: "split" } as const;

export function Header() {
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

    const buttons = useMemo(() => [
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
    ], [user, reduceMotions, devTools]);

    const UserButton = useCallback(() => (
        <button
            className={cn(
                "ml-auto truncate flex hover:bg-wamellow py-2 px-4 rounded-lg duration-200 items-center",
                menu && "bg-wamellow"
            )}
            onClick={() => setMenu(!menu)}
        >
            {!user?.id ?
                <>
                    <Skeleton className="rounded-full mr-2 size-[30p]" />
                    <Skeleton className="rounded-xl w-20 h-4" />
                </>
                :
                <>
                    <ImageReduceMotion
                        alt="your avatar"
                        className="rounded-full mr-2 size-[30px] shrink-0"
                        url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                        size={96}
                    />

                    <p className="mr-1 relative bottom-[1px] truncate block">{user.globalName || user.username}</p>
                    <HiChevronDown />
                </>
            }
        </button>
    ), [user, menu]);

    const UserDropdown = useCallback(() => (
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
                ml-auto w-full sm:w-72 bg-black/40 rounded-xl backdrop-blur-2xl backdrop-brightness-75 shadow-xl
                flex flex-col py-2 sm:py-1 p-2 sm:p-0
                [--y-closed:-16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                [--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
            "
        >
            <div className="flex items-center space-x-3 px-4 py-2">
                <ImageReduceMotion
                    alt="your avatar"
                    className="rounded-full size-14 sm:size-10 shrink-0"
                    url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                    size={128}
                />
                <div className="w-full">
                    <div className="text-neutral-200 max-w-40 truncate font-medium text-xl sm:text-base">
                        {user?.globalName || user?.username}
                    </div>
                    <div className="text-neutral-400 max-w-40 truncate -mt-1 text-medium sm:text-sm">
                        @{user?.username}
                    </div>
                </div>
                <button
                    className="ml-auto text-red-500 m-4"
                    onClick={() => {
                        window.location.href = "/login?logout=true";
                        userStore.setState({ __fetched: true });
                        setMenu(false);
                    }}
                >
                    <HiLogout className="size-5" />
                </button>
            </div>

            {buttons.map((button, i) => {
                if ("type" in button && button.type === "split") return (
                    <hr key={"headerButton-" + button.type + i} className="my-1 mx-2 dark:border-wamellow border-wamellow-100" />
                );

                if ("url" in button) return (
                    <Button
                        key={"headerButton-" + button.name + button.url}
                        asChild
                        className="w-full font-medium justify-start text-xl my-1 sm:my-0 sm:text-medium bg-transparent hover:bg-wamellow rounded-sm"
                        onClick={() => setMenu(false)}
                    >
                        <Link href={button.url!}>
                            {button.icon}
                            {button.name}
                        </Link>
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
    ), [user, menu, reduceMotions, devTools]);

    return (<>
        {state === State.Failure
            ? <LoginButton state={state} className="ml-auto" />
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
                    <div className="absolute top-[72px] right-3.5 z-50 w-[calc(100%-1.6rem)]">
                        <UserDropdown />
                    </div>
                }
            </AnimatePresence>
        </MotionConfig>
    </>);
}