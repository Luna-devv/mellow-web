"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { User, userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import { RouteErrorResponse } from "@/typings";

export default function Home() {
    const [error, setError] = useState<string>();
    const router = useRouter();

    useEffect(() => {

        userStore.setState(undefined);
        const params = new URLSearchParams(window.location.search);

        if (params.get("logout")) {

            fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
                headers: {
                    authorization: localStorage.getItem("token") as string
                },
                method: "DELETE"
            })
                .catch(() => null);

            localStorage.setItem("freshleyLoggedout", "true");
            localStorage.removeItem("token");
            router.push("/");
            return;
        }

        if (!params.get("code")) window.location.href = `${process.env.NEXT_PUBLIC_LOGIN}&scope=${params.get("invite") ? "identify+bot" : "identify+email+guilds"}`;
        else
            fetch(`${process.env.NEXT_PUBLIC_API}/sessions?code=${params.get("code")}`, {
                method: "POST"
            })
                .then(async (res) => {
                    const response = await res.json() as User;
                    if (!response) return;

                    if (localStorage.getItem("token")) {
                        fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
                            headers: {
                                "Content-Type": "application/json",
                                authorization: localStorage.getItem("token") as string
                            },
                            method: "DELETE"
                        })
                            .catch(() => null);
                    }

                    const redirect = localStorage.getItem("lastpage");
                    localStorage.removeItem("token");
                    localStorage.removeItem("freshleyLoggedout");
                    localStorage.removeItem("lastpage");

                    switch (res.status) {
                        case 200: {
                            userStore.setState(response);
                            localStorage.setItem("token", response.session);

                            if (params.get("guild_id")) {
                                await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/@me`, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        authorization: localStorage.getItem("token") as string
                                    },
                                    method: "POST",
                                    body: JSON.stringify({ guildId: params.get("guild_id") })
                                })
                                    .catch(() => null);

                                router.push(`/dashboard/${params.get("guild_id")}`);
                                return;
                            }

                            router.push(redirect || "/");
                            break;
                        }
                        default: {
                            setError((response as unknown as RouteErrorResponse).message || "Error during authorization");
                            break;
                        }
                    }

                })
                .catch(() => {
                    setError("Error during authorization");
                });
    }, []);

    if (!error) return <></>;

    return (
        <div className="w-full">
            <ErrorBanner message={error} removeButton={true} />
            <div className="ml-1 relative bottom-4 flex gap-2">
                <Link href="/" className="text-blurple hover:opacity-80 dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center">
                    <HiArrowNarrowLeft />
                    <span className="ml-1">Home</span>
                </Link>
                <Link href="/support" className="text-blurple hover:opacity-80 dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center">
                    <BsDiscord />
                    <span className="ml-2">Support</span>
                </Link>
            </div>
        </div>
    );
}