"use client";

import { NextUIProvider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { guildStore } from "@/common/guilds";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

interface Props {
    children: React.ReactNode;
}

export function Provider({ children }: Props) {
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
                expires: 28
            }
        );

        const params = new URLSearchParams(window.location.search);
        if (params.get("spotify_login_success") === "true" && path !== "/login/spotify") window.close();

        if (!path.startsWith("/dashboard/")) guildStore.setState(undefined);
    }, [path]);

    return (
        <TooltipProvider>
            <NextUIProvider>
                <QueryClientProvider client={queryClient}>
                    <main className="dark:text-neutral-400 text-neutral-700 flex flex-col items-center justify-between md:p-5 p-3 w-6xl max-w-full mt-2 md:mt-10">
                        {children}
                    </main>
                </QueryClientProvider>
            </NextUIProvider>
        </TooltipProvider>
    );
}