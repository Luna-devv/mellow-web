"use client";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { MetricCard, Metrics } from "@/components/metric-card";
import { ScreenMessage } from "@/components/screen-message";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheOptions, getData } from "@/lib/api";
import type { ApiV1UsersMeGetResponse } from "@/typings";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Suspense } from "react";
import CountUp from "react-countup";
import { HiCreditCard, HiCubeTransparent, HiFire, HiHome, HiPhotograph, HiTranslate } from "react-icons/hi";
import { useQuery } from "react-query";

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
            enabled: Boolean(user?.id),
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
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."
                }
            />
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            <title>Your profile</title>

            <div className="flex flex-col gap-5 mb-3">

                <div className="text-lg flex flex-col md:flex-row md:items-center">
                    <div className="text-lg flex gap-6">
                        <Skeleton
                            isLoading={!user?.id}
                            className="rounded-full size-16 ring-offset-(--background-rgb) ring-2 ring-offset-2 ring-violet-400/40 shrink-0 relative top-1 left-1"
                        >
                            <ImageReduceMotion
                                alt="you"
                                className="rounded-full"
                                url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                                size={128}
                            />
                        </Skeleton>

                        {user?.id ?
                            <div className="flex flex-col gap-1">
                                <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">
                                    {user.globalName || user.username}
                                </div>
                                <Link
                                    href="/vote"
                                    target="_blank"
                                >
                                    <Badge
                                        className="h-7 font-bold"
                                        variant="flat"
                                    >
                                        <HiFire/>
                                        {user.extended?.voteCount} VOTE{user.extended?.voteCount === 1 ? "" : "S"}
                                    </Badge>
                                </Link>
                            </div>
                            :
                            <div className="flex flex-col mt-2">
                                <Skeleton className="rounded-xl w-32 h-5 mb-2" />
                                <Skeleton className="rounded-md w-[90px] h-7" />
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
                        {
                            name: "Billing",
                            value: "/billing",
                            icon: <HiCreditCard />
                        }
                    ]}
                    url="/profile"
                />
            </Suspense>

            {user?.id ? children : <></>}
        </div>
    );
}