
"use client";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiLightningBolt, HiViewGridAdd } from "react-icons/hi";

import { userStore } from "@/common/user";
import OverviewLinkComponent from "@/components/OverviewLinkComponent";

export default function Home() {
    const user = userStore((s) => s);

    return (
        <div>

            <div className="w-full md:flex gap-3">
                <OverviewLinkComponent
                    className="md:w-2/3"
                    title="Add Wamellow to your server"
                    message="If you haven't already, now is the ideal moment to introduce Wamellow to your server."
                    url="/login?invite=true"
                    icon={<HiLightningBolt />}
                />
                <OverviewLinkComponent
                    className="md:w-1/3"
                    title="Dashboard"
                    message="Effortlessly handle all your guilds."
                    url="/dashboard"
                    icon={<HiViewGridAdd />}
                />
            </div>

            <hr className="mb-3 dark:border-wamellow-light border-wamellow-100-light" />

            <div>Hey {user?.username}, thanks for testing out the early version of this bot :)</div>
            <div>There will be more exciting stuff coming soon&trade;</div>

            <div className="flex mt-2">
                <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 ">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Join our server for updates</span>
                </Link>
            </div>

        </div>
    );
}