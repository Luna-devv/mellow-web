"use client";

import { Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import { userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { ApiV1MeGetResponse, RouteErrorResponse } from "@/typings";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const user = userStore((g) => g);

    const [error, setError] = useState<string>();

    useEffect(() => {
        if (user?.extended !== undefined) return;

        fetch(`${process.env.NEXT_PUBLIC_API}/users/@me`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1MeGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setError(undefined);
                        userStore.setState({ ...user, extended: response });
                        break;
                    }
                    default: {
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching user");
            });
    }, [user]);

    if (error) return <ErrorBanner message={error} />;

    return (
        <div className="flex flex-col w-full h-full">
            <title>Your profile</title>

            <div className="flex flex-col gap-5 mb-3">
                {error && <ErrorBanner message={error} />}

                <div className="text-lg flex flex-col md:flex-row md:items-center">
                    <div className="flex gap-5">
                        <Skeleton isLoaded={!!user?.id} className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40">
                            <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`} size={128} alt="User" />
                        </Skeleton>

                        {!user?.id ?
                            <div className="flex flex-col gap-1 mt-1.5">
                                <Skeleton className="rounded-xl w-32 h-5 mb-2" />
                                <Skeleton className="rounded-xl w-40 h-3.5" />
                            </div>
                            :
                            <div className="flex flex-col gap-1">
                                <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">@{user?.username || "Unknown User"}</div>
                                <div className="text-sm font-semibold flex items-center gap-1"> Manage your profile here </div>
                            </div>
                        }
                    </div>

                    <div className="md:ml-auto flex items-center gap-5 mt-6 sm:mt-0">
                        <div>
                            <div className="text-sm font-medium">Messages</div>
                            {!user?.extended?.activity
                                ? <Skeleton className="rounded-md mt-1.5 w-12 h-6 mb-1" />
                                :
                                <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.messages || 0} />
                            }
                        </div>
                        <div>
                            <div className="text-sm font-medium">Invites</div>
                            {!user?.extended?.activity
                                ? <Skeleton className="rounded-md mt-1.5 w-8 h-6 mb-1" />
                                :
                                <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.invites || 0} />
                            }
                        </div>
                        <div>
                            <div className="text-sm font-medium">Voice</div>
                            {!user?.extended?.activity
                                ? <Skeleton className="rounded-md mt-1.5 w-20 h-6 mb-1" />
                                :
                                <span className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">{user?.extended?.activity?.formattedVoicetime}</span>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Overview",
                        value: "/"
                    },
                    {
                        name: "Rank",
                        value: "/rank"
                    },
                    {
                        name: "Text to Speech",
                        value: "/text-to-speech"
                    },
                    {
                        name: "Spotify",
                        value: "/spotify"
                    },
                    ...(user?.HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY ?
                        [
                            {
                                name: "Analytics",
                                value: "/analytics"
                            }
                        ]
                        :
                        []
                    )
                ]}
                url={"/profile"}
                disabled={!user}
            />

            {user?.id ? children : <></>}

        </div>
    );
}