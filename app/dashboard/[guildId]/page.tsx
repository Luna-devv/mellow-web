"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsDiscord } from "react-icons/bs";

import { userStore } from "@/common/user";

import OverviewLinkComponent from "./OverviewLinkComponent";

export default function Home() {
    const user = userStore((s) => s);

    const params = useParams();

    return (
        <div>

            <OverviewLinkComponent
                title="View Leaderboard"
                message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                url={`/leaderboard/${params.guildId}`}
            />

            <div className="flex mb-4">
                <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 ">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Join our server for updates</span>
                </Link>
            </div>

            <div>Hey {user?.username}, thanks for testing out the early version of this bot :)</div>
            <div>There will be more exciting stuff coming soon&trade;</div>

        </div>
    );
}