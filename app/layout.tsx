"use client";
import "./globals.css";

import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowRight, HiOutlineChevronDown, HiTemplate } from "react-icons/hi";

import { errorStore } from "@/common/error";
import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { widthStore } from "@/common/width";
import authorizeUser from "@/components/authorizeUser";
import LoginButton from "@/components/LoginButton";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//     title: "%s | Wamellow",
//     description: "Some awesome bot for your discord community",
//     keywords: ["discord", "waya", "mwya", "wamellow", "waya bot", "discord bot", "bot"],
//     themeColor: "#ff709b",
//     creator: "Luna (lunish.nl)",
//     publisher: "Luna (lunish.nl)",
//     robots: "index, follow"
// };

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {

    const [menu, setMenu] = useState<boolean>(false);
    const [loginstate, setLoginstate] = useState<"LOADING" | "ERRORED" | undefined>(undefined);

    const path = usePathname() || "/";
    useEffect(() => {
        if (!["/login", "/logout"].includes(path.split("?")[0])) localStorage.setItem("lastpage", path);
        if (!path.startsWith("/dashboard/")) {
            guildStore.setState(undefined);
            errorStore.setState(undefined);
        }
    }, [path]);

    const user = userStore((s) => s);
    useEffect(() => {
        authorizeUser({ stateHook: setLoginstate, page: path }).then((_user) => {
            if (_user) userStore.setState(_user);
        });
    }, []);

    const width = widthStore((w) => w);
    useEffect(() => {
        widthStore.setState(window?.innerWidth);
        setInterval(() => {
            if (window?.innerWidth !== width) widthStore.setState(window?.innerWidth);
        }, 1000);
    }, []);

    const UserButton = (
        <button className={`ml-auto flex ${menu && "dark:bg-wamellow bg-wamellow-100"} dark:hover:bg-wamellow hover:bg-wamellow-100 py-2 px-4 rounded-md duration-200 items-center`} onClick={() => setMenu(!menu)}>
            <Image src={user?.avatar as string} width={30} height={30} style={{ height: 30, width: 30 }} alt="your avatar" className="rounded-full mr-2 drop-shadow-lg" />
            <div className="mr-2">@{user?.username}</div>
            <HiOutlineChevronDown />
        </button>
    );

    const UserDropdown = (
        <div className="relative bottom-2 right-56 dark:bg-wamellow bg-wamellow-100 rounded-md w-56 text-base overflow-hidden shadow-md">
            <Link href="/dashboard" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha pt-3 pb-2 px-4 w-full duration-200 flex items-center" onClick={() => setMenu(false)}>
                <HiTemplate />
                <span className="ml-2">Dashboard</span>
            </Link>
            <hr className="my-1 mx-0 dark:border-wamellow-light border-wamellow-100-light" />
            <Link href="/login?logout=true" className="hover:bg-danger dark:text-red-400 text-red-500 dark:hover:text-red-100 hover:text-neutral-800 pt-2 pb-3 px-4 w-full duration-200 flex items-center" onClick={() => setMenu(false)}>
                <HiArrowNarrowRight />
                <span className="ml-2">Logout</span>
            </Link>
        </div>
    );

    return (
        <html lang="en" className="flex justify-center min-h-screen h-full max-w-full overflow-x-hidden">
            <title>Wamellow</title>

            <body className={`${inter.className} w-full max-w-6xl`}>

                <div className="p-4 flex items-center gap-2 text-base font-medium dark:text-neutral-300 text-neutral-700 select-none">
                    <Link href="/" className="flex items-center mr-2">
                        <Image src="/waya-legacy1.png" width={34} height={34} alt="wamellow" className="rounded-full mr-2 drop-shadow-lg" />
                        <span className="text-xl dark:text-slate-100 text-slate-900">Wamellow</span>
                    </Link>

                    {width > 512 &&
                        <>
                            <Link href="/docs" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Guides</Link>
                            <Link href="/support" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Support</Link>
                        </>
                    }

                    {!user?.id ? <LoginButton loginstate={loginstate} width={width} /> : UserButton}
                </div>

                {user?.id && menu &&
                    <div className="pr-4 flex text-base font-medium dark:text-neutral-300 text-neutral-700 select-none overflow-x-hidden">
                        <div className="ml-auto overflow-x-hidden"><div className="absolute z-10">{UserDropdown}</div></div>
                    </div>
                }

                <main className={`dark:text-neutral-300 text-neutral-700 flex flex-col items-center justify-between p-5 w-6xl max-w-full mt-${width > 512 ? 10 : 2}`}>
                    {children}
                </main>

            </body>

            {/* <div className=" text-neutral-500 w-full max-w-6xl mt-10 mb-6">
                <div>&copy; Wamellow {new Date(1635609600000).getFullYear()} - {new Date().getFullYear()}, Not affiliated with Discord Inc.</div>
                <div className="flex gap-2 mt-2">
                    <Link href="/docs" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Documentation</Link>
                    <Link href="/terms" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Terms of Service</Link>
                    <Link href="/terms#privacy" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Privacy Policy</Link>
                    <Link href="/status" className="bg-wamellow-alpha hover:bg-wamellow-light hover:text-neutral-300 py-1 px-2 rounded-md duration-200">Status</Link>
                </div>
            </div> */}

        </html>
    );
}