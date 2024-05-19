"use client";

import { Button, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams, usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Suspense, useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiChartBar, HiCode, HiCursorClick, HiEye, HiHome, HiShare, HiStar, HiUserAdd, HiUsers, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { AddButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { ServerButton } from "@/components/server-button";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse, RouteErrorResponse } from "@/typings";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";
import { BiLogoYoutube } from "react-icons/bi";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const cookies = useCookies();
    const params = useParams();
    const hasSession = cookies.get("hasSession") === "true";

    if (!hasSession) redirect(`/login?callback=/dashboard/${params.guildId}`);

    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();

    const path = usePathname();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setError(undefined);
                        guildStore.setState(response);
                        break;
                    }
                    default: {
                        guildStore.setState(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching guilds");
            });



        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/channels`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsChannelsGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        guildStore.setState({
                            ...guild,
                            channels: response
                        });
                        break;
                    }
                    default: {
                        guildStore.setState({
                            ...guild,
                            channels: []
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching channels");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/roles`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsRolesGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        guildStore.setState({
                            ...guild,
                            roles: response
                        });
                        break;
                    }
                    default: {
                        guildStore.setState({
                            ...guild,
                            roles: response
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/emojis`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsEmojisGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {

                        guildStore.setState({
                            ...guild,
                            emojis: response
                        });
                        break;
                    }
                    default: {

                        guildStore.setState({
                            ...guild,
                            emojis: response
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

    }, []);

    return (
        <div className="flex flex-col w-full">
            <title>{`${guild?.name}'s Dashboard`}</title>

            <div className="flex flex-col gap-5 mb-3">
                <div className="flex gap-2">
                    <Button
                        as={Link}
                        className="w-fit"
                        href="/profile"
                        startContent={<HiArrowNarrowLeft />}
                    >
                        Serverlist
                    </Button>
                    {cookies.get("devTools") &&
                        <CopyToClipboardButton
                            needsWait
                            text={getCanonicalUrl("leaderboard", params.guildId.toString())}
                            items={[
                                { icon: <HiShare />, name: "Copy page url", description: "Creates a link to this specific page", text: getCanonicalUrl(...path.split("/").slice(1)) },
                                { icon: <HiCursorClick />, name: "Copy dash-to url", description: "Creates a dash-to link to the current tab", text: getCanonicalUrl(`dashboard?to=${path.split("/dashboard/")[1].split("/")[1] || "/"}`) }
                            ]}
                            icon={<HiShare />}
                        />
                    }
                </div>

                <div className="text-lg flex gap-5">
                    <Skeleton isLoaded={!!guild?.id} className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40 shrink-0">
                        <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`} size={128} alt="Server" />
                    </Skeleton>

                    {!guild?.id ?
                        <div className="mt-1.5">
                            <Skeleton className="rounded-xl w-32 h-6 mb-2" />
                            <Skeleton className="rounded-xl w-10 h-3.5" />
                        </div>
                        :
                        <div className="flex flex-col gap-1">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                            <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
                        </div>
                    }

                </div>

            </div>

            <Suspense>
                <ListTab
                    tabs={[
                        {
                            name: "Overview",
                            value: "/",
                            icon: <HiHome />
                        },
                        {
                            name: "Leaderboards",
                            value: "/leaderboards",
                            icon: <HiChartBar />
                        },
                        {
                            name: "Greetings",
                            value: "/greeting",
                            icon: <HiUserAdd />
                        },
                        {
                            name: "Starboard",
                            value: "/starboard",
                            icon: <HiStar />
                        },
                        {
                            name: "Custom Commands",
                            value: "/custom-commands",
                            icon: <HiCode />
                        },
                        {
                            name: "YouTube Notifications",
                            value: "/notifications",
                            icon: <BiLogoYoutube />
                        },
                        // {
                        //     name: "NSFW Image Moderation",
                        //     value: "/nsfw-image-scanning",
                        //     icon: <HiEye />
                        // }
                    ]}
                    url={`/dashboard/${params.guildId}`}
                    disabled={!guild?.id || !!error}
                />
            </Suspense>

            {error ?
                <ScreenMessage
                    title={error.includes("permssions")
                        ? "Something went wrong on this page.."
                        : "You cannot access this page.."
                    }
                    description={error}
                    buttons={<>
                        <ServerButton
                            as={Link}
                            href="/profile"
                            startContent={<HiViewGridAdd />}
                        >
                            Go back to Dashboard
                        </ServerButton>
                        {error.includes("permissions")
                            ? <AddButton />
                            : <SupportButton />
                        }
                    </>}
                >
                    <Image src={SadWumpusPic} alt="" height={141} width={124} />
                </ScreenMessage>
                :
                guild?.id ? children : <></>
            }

        </div >
    );
}