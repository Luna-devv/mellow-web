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

            fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/spotify`, {
                headers: {
                    authorization: localStorage.getItem("token") as string
                },
                method: "DELETE"
            })
                .then(() => {

                    const redirect = localStorage.getItem("lastpage");
                    window.location.href = redirect || "/";

                })
                .catch(() => null);

            return;
        }

        if (!params.get("code")) window.location.href = `${process.env.NEXT_PUBLIC_API}/connections/spotify`;
        else
            fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/spotify?${params.toString()}`, {
                headers: {
                    authorization: localStorage.getItem("token") as string
                },
                method: "PUT"
            })
                .then(async (res) => {
                    const response = await res.json().catch(() => null) as User;

                    switch (res.status) {
                        case 204: {
                            const redirect = localStorage.getItem("lastpage");
                            router.push((redirect || "/") + "?spotify_login_success=true");
                            break;
                        }
                        default: {
                            setError((response as unknown as RouteErrorResponse)?.message || "Error during authorization");
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