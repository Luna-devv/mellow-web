"use client";

import { Chip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Suspense } from "react";
import CountUp from "react-countup";
import { HiChartPie, HiCubeTransparent, HiFire, HiHome, HiPhotograph, HiTranslate } from "react-icons/hi";
import { useQuery } from "react-query";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { MetricCard, Metrics } from "@/components/metric-card";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import type { ApiV1UsersMeGetResponse } from "@/typings";

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const cookies = useCookies();
    const session = cookies.get("session");

    if (!session) redirect("/login?callback=/profile");

    const user = userStore((u) => u);

    const url = "/users/@me" as const;

    const { data, error } = useQuery(
        url,
        () => getData<ApiV1UsersMeGetResponse>(url),
        {
            enabled: !!user?.id,
            onSuccess: (d) => userStore.setState({
                ...user,
                extended: "status" in d ? {} : d
            }),
            ...cacheOptions
        }
    );

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
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

    return (
        <div className="flex flex-col w-full h-full">
            <title>Your profile</title>

            <div className="flex flex-col gap-5 mb-3">

                <div className="text-lg flex flex-col md:flex-row md:items-center">
                    <div className="flex gap-5">
                        <Skeleton
                            isLoading={!user?.id}
                            className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40 shrink-0 relative top-1"
                        >
                            <ImageReduceMotion
                                alt="you"
                                className="rounded-full"
                                url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                                size={128}
                            />
                        </Skeleton>

                        {!user?.id ?
                            <div className="flex flex-col mt-2">
                                <Skeleton className="rounded-xl w-32 h-5 mb-2" />
                                <Skeleton className="rounded-md w-24 h-7" />
                            </div>
                            :
                            <div className="flex flex-col gap-1">
                                <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">
                                    {user.globalName || user.username}
                                </div>
                                <Chip
                                    as={Link}
                                    href="/vote"
                                    target="_blank"
                                    color="secondary"
                                    startContent={<HiFire className="ml-1" />}
                                    variant="flat"
                                    radius="sm"
                                >
                                    <span className="font-bold uppercase">
                                        {user.extended?.voteCount} votes
                                    </span>
                                </Chip>
                            </div>
                        }
                    </div>

                    <Metrics>
                        <MetricCard name="Messages" isLoading={!user?.extended}>
                            <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.messages || 0} />
                        </MetricCard>
                        <MetricCard name="Invites" isLoading={!user?.extended}>
                            <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.invites || 0} />
                        </MetricCard>
                        <MetricCard name="Voice" isLoading={!user?.extended}>
                            <span className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">{user?.extended?.activity?.formattedVoicetime}</span>
                        </MetricCard>
                    </Metrics>
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
                            name: "Rank",
                            value: "/rank",
                            icon: <HiPhotograph />
                        },
                        {
                            name: "Text to Speech",
                            value: "/text-to-speech",
                            icon: <HiTranslate />
                        },
                        {
                            name: "Connections",
                            value: "/connections",
                            icon: <HiCubeTransparent />
                        },
                        ...(user?.HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY ?
                            [
                                {
                                    name: "Analytics",
                                    value: "/analytics",
                                    icon: <HiChartPie />
                                }
                            ]
                            :
                            []
                        )
                    ]}
                    url="/profile"
                />
            </Suspense>

            {user?.id ? children : <></>}
        </div>
    );
}