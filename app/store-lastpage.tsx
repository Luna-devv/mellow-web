"use client";

import { usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";

import { guildStore } from "@/common/guilds";

export function StoreLastPage() {
    const cookies = useCookies();
    const path = usePathname();

    useEffect(() => {
        cookies.set(
            "lastpage",
            path,
            {
                secure: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://"),
                sameSite: "none",
                domain: process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1],
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4)
            }
        );

        const params = new URLSearchParams(window.location.search);
        if (params.get("spotify_login_success") === "true" && path !== "/login/spotify") window.close();

        if (!path.startsWith("/dashboard/")) guildStore.setState(undefined);
    }, [path]);

    return <></>;
}