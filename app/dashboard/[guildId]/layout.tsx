"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { widthStore } from "@/common/width";
import { ErrorBanner } from "@/components/Error";
import { ListTab } from "@/components/List";
import { ApiV1GuildsGetResponse, RouteErrorResponse } from "@/typings";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const width = widthStore((w) => w);
    const user = userStore((s) => s);
    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();
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
    }, []);

    if (!guild && error) return (
        <div className="flex flex-col w-full">
            <ErrorBanner message={error} />
        </div>
    );

    if (guild === undefined) return <></>;

    return (
        <div className="flex flex-col w-full">

            {error && <ErrorBanner message={error} />}
            <div className="flex mb-5">
                <Link href="/dashboard" className="flex bg-wamellow hover:bg-wamellow-light hover:text-white py-2 px-3 rounded-md duration-200 drop-shadow-lg text-sm">
                    <HiArrowNarrowLeft className="relative top-1" />
                    <span className="ml-2">Serverlist</span>
                </Link>
            </div>

            <span className="text-lg flex items-center">
                <Image src={guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64` : "https://cdn.waya.one/r/discord.png"} width={64} height={64} alt="Server" className="rounded-full h-14 w-14 mr-3" />
                <div>
                    <div className="text-xl text-slate-200 font-medium">{guild?.name}</div>
                    <div className="text-sm">Lorem ipsum</div>
                </div>
            </span>

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
                url={`/dashboard/${guild.id}`}
            />

            {children}

        </div>
    );
}