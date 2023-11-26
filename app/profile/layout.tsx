"use client";
import { Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import { userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import ImageReduceMotion from "@/components/ImageReduceMotion";
import { ListTab } from "@/components/List";
import { ApiV1MeGetResponse, RouteErrorResponse } from "@/typings";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const user = userStore((g) => g);

    const [error, setError] = useState<string>();

    const intl = new Intl.NumberFormat("en", { notation: "compact" });

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

            <div className="text-lg sm:flex items-center">
                <div className="flex items-center">

                    <Skeleton isLoaded={!!user?.id} className="rounded-full h-14 w-14 mr-3">
                        <ImageReduceMotion url={user?.id ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : "/discord.png"} size={128} alt="your avatar" />
                    </Skeleton>

                    {!user?.id ?
                        <div>
                            <Skeleton className="rounded-xl w-24 h-5 mb-2" />
                            <Skeleton className="rounded-xl w-40 h-3.5" />
                        </div>
                        :
                        <div>
                            <div className="text-xl dark:text-neutral-200 text-neutral-800 font-medium">{user?.username ? `@${user.username}` : "Unknown User"}</div>
                            <div className="text-sm">Manage your profile here</div>
                        </div>
                    }

                </div>

                <div className="ml-auto flex items-center gap-5 mt-6 sm:mt-0">
                    <div>
                        <div className="text-sm">Messages</div>
                        {!user?.extended?.activity
                            ? <Skeleton className="rounded-md mt-1.5 w-12 h-6 mb-1" />
                            :
                            <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.messages || 0} />
                        }
                    </div>
                    <div>
                        <div className="text-sm">Voice</div>
                        {!user?.extended?.activity
                            ? <Skeleton className="rounded-md mt-1.5 w-8 h-6 mb-1" />
                            :
                            <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.voiceminutes || 0} />
                        }
                    </div>
                    <div>
                        <div className="text-sm">Invites</div>
                        {!user?.extended?.activity
                            ? <Skeleton className="rounded-md mt-1.5 w-8 h-6 mb-1" />
                            :
                            <CountUp className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium" duration={4} end={user?.extended?.activity?.invites || 0} />
                        }
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
                    }// ,
                    // {
                    //     name: "Spotify",
                    //     value: "/spotify"
                    // }
                ]}
                url={"/profile"}
                disabled={!user}
            />

            {children}

        </div>
    );
}