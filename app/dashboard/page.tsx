"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";

import { userStore } from "@/common/user";
import { widthStore } from "@/common/width";
import ErrorBanner from "@/components/Error";
import LoginButton from "@/components/LoginButton";
import { RouteErrorResponse, UserGuild } from "@/typings";

export default function Home() {
    const width = widthStore((w) => w);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [guilds, setGuilds] = useState<UserGuild[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/@me`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as UserGuild[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setGuilds(response);
                        break;
                    }
                    default: {
                        setError((response as unknown as RouteErrorResponse).message || "Error while fetching guilds");
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching guilds");
            });
    }, []);

    return (
        <div className="flex flex-col w-full">

            {error && <ErrorBanner message={error} />}
            <div className="md:flex md:items-center">
                <div>
                    <div className="text-2xl dark:text-neutral-100 text-neutral-900 font-semibold mb-2">👋 Heyia, {user?.global_name || `@${user?.username}`}</div>
                    <div className="text-lg">Select a server you want to manage.</div>
                </div>
                <div className="md:ml-auto flex gap-3 mt-4 md:mt-0">
                    <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 w-full md:w-fit justify-center">
                        <HiPlus className="relative top-1" />
                        <span className="ml-2">Add to Server</span>
                    </Link>
                    <LoginButton
                        className="w-full md:w-fit text-center"
                        addClassName="justify-center"
                        width={width}
                        message={"Reload Guilds"}
                    />
                </div>
            </div>
            <hr className="mx-0 p-1 my-4 dark:border-wamellow-light border-wamellow-100-light w-full" />

            {guilds.map((guild) => (
                <div className="dark:bg-wamellow bg-wamellow-100 py-4 px-5 mb-4 flex items-center rounded-lg w-full drop-shadow-md" key={guild.id}>
                    <Image src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64` : "https://cdn.waya.one/r/discord.png"} width={64} height={64} alt="Server" className="rounded-lg h-16 w-16" />
                    <div className="ml-3 text-sm relative bottom-1">
                        <div className="text-lg dark:text-neutral-200 text-neutral-800 mb-3">{guild.name}</div>
                        <Link href={`/dashboard/${guild.id}`} className="dark:bg-wamellow-alpha bg-wamellow-100-alpha dark:hover:bg-wamellow-light hover:bg-wamellow-100-light py-2 px-4 rounded-md duration-200">Manage</Link>
                    </div>
                </div>
            ))}

        </div>
    );
}