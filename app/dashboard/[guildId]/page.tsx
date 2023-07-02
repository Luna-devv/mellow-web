
"use client";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";

import { userStore } from "@/common/user";
import { widthStore } from "@/common/width";

export default function Home() {
    const width = widthStore((w) => w);
    const user = userStore((s) => s);

    return (
        <div>

            <div>Hey {user?.username}, thanks for testing out the early version of this bot :)</div>
            <div>There will be more exciting stuff coming soon&trade;</div>

            <div className="flex mt-4">
                <Link href="/support" className="flex bg-wamellow hover:bg-wamellow-light hover:text-white py-2 px-4 rounded-md duration-200 ">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Join our server for updates</span>
                </Link>
            </div>

        </div>
    );
}