"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { errorStore } from "@/common/error";
import { guildStore } from "@/common/guilds";
import ErrorBanner from "@/components/Error";
import { ListTab } from "@/components/List";
import { ApiV1GuildsGetResponse, RouteErrorResponse } from "@/typings";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const error = errorStore((e) => e);
    const guild = guildStore((g) => g);

    const params = useParams();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        errorStore.setState(undefined);
                        guildStore.setState(response);
                        break;
                    }
                    default: {
                        guildStore.setState(undefined);
                        errorStore.setState((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                errorStore.setState("Error while fetching guilds");
            });
    }, []);

    if (guild === undefined && !error) return <></>;

    return (
        <div className="flex flex-col w-full">

            <div className="flex mb-5">
                <Link href="/dashboard" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-3 rounded-md duration-200 text-sm">
                    <HiArrowNarrowLeft className="relative top-1" />
                    <span className="ml-2">Serverlist</span>
                </Link>
            </div>

            {error && <ErrorBanner message={error} />}

            <div className="text-lg flex items-center">
                <Image src={guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64` : "https://cdn.waya.one/r/discord.png"} width={64} height={64} alt="Server" className="rounded-full h-14 w-14 mr-3" />
                <div>
                    <div className="text-xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                    <div className="text-sm">Lorem ipsum</div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Overview",
                        value: "/"
                    },
                    {
                        name: "Welcome",
                        value: "/welcome"
                    }
                ]}
                url={`/dashboard/${params.guildId}`}
                disabled={!guild}
            />

            {children}

        </div>
    );
}