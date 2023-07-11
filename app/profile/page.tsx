
"use client";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";

import { userStore } from "@/common/user";

export default function Home() {
    const user = userStore((s) => s);

    return (
        <div>

            <div>Hey {user?.username}, thanks for testing out the early version of this bot :)</div>
            <div>There will be more exciting stuff coming soon&trade;</div>

            <div className="flex flex-wrap gap-2 mt-4">
                <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 ">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Join our server for updates</span>
                </Link>

                <Link href="/dashboard" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 ">
                    <HiTemplate className="relative top-1" />
                    <span className="ml-2">Server dashboard</span>
                </Link>
            </div>

        </div>
    );
}