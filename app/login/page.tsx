"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { User, userStore } from "@/common/user";
import Modal from "@/components/modal";
import { ScreenMessage } from "@/components/screen-message";
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

    return (
        <>
            <Modal
                title="OAuth2 error"
                show={!!error}
                buttonName="Try again"
                onClose={() => {
                    setError(undefined);
                }}
                onSubmit={() => {
                    router.refresh();
                    return undefined;
                }}
            >
                {error}
            </Modal>

            <ScreenMessage
                title="Authorizing.."
                description="We're just checking who you are"
            />
        </>
    );
}