"use client";
import Image from "next/image";

import { errorStore } from "@/common/error";
import { userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import { ListTab } from "@/components/List";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const error = errorStore((e) => e);
    const user = userStore((g) => g);

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