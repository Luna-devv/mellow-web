"use client";
import Image from "next/image";
import { useEffect } from "react";

import { errorStore } from "@/common/error";
import { userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import { ListTab } from "@/components/List";
import { ApiV1MeGetResponse, RouteErrorResponse } from "@/typings";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const error = errorStore((e) => e);
    const user = userStore((g) => g);

    const intl = new Intl.NumberFormat(user?.locale, { notation: "compact" });

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
                        errorStore.setState(undefined);
                        userStore.setState({ ...user, extended: response });
                        break;
                    }
                    default: {
                        errorStore.setState((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                errorStore.setState("Error while fetching user");
            });
    }, [user]);

    if (user === undefined && !error) return <></>;

    return (
        <div className="flex flex-col w-full">

            {error && <ErrorBanner message={error} />}

            <div className="text-lg flex items-center">
                <Image src={user?.avatar || "https://cdn.waya.one/r/discord.png"} width={64} height={64} alt="Your profile picture" className="rounded-full h-14 w-14 mr-3" />
                <div>
                    <div className="text-xl dark:text-slate-200 text-slate-800 font-medium">{user ? `@${user.username}` : "Unknown User"}</div>
                    <div className="text-sm">Manage your profile here</div>
                </div>

                {user?.extended &&
                    <div className="ml-auto flex items-center gap-5">
                        <div>
                            <div className="text-sm">Messages</div>
                            <span className="text-2xl text-neutral-100 font-medium">{intl.format(user.extended.activity.messages + 4234234)}</span>
                        </div>
                        <div>
                            <div className="text-sm">Voice</div>
                            <span className="text-2xl text-neutral-100 font-medium">{intl.format(user.extended.activity.voiceminutes)}</span>
                        </div>
                        <div>
                            <div className="text-sm">Invites</div>
                            <span className="text-2xl text-neutral-100 font-medium">{intl.format(user.extended.activity.invites)}</span>
                        </div>
                    </div>
                }

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
                    }
                ]}
                url={"/profile"}
                disabled={!user}
            />

            {children}

        </div>
    );
}