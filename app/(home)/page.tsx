
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiHeart, HiPlus } from "react-icons/hi";

import { ApiV1TopguildsGetResponse } from "@/typings";
import { truncate } from "@/utils/truncate";

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1TopguildsGetResponse[];
    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];

    const InnerMarquee = (
        <>
            {topGuilds?.map((guild) => (
                <div className="dark:bg-wamellow bg-wamellow-100 py-4 px-5 flex items-center rounded-lg w-64 drop-shadow-md" key={Math.random().toString()}>
                    <Image src={(guild.icon && !guild.icon.includes("null")) ? guild.icon : "/discord.png"} width={46} height={46} alt="Server" className="rounded-lg" />
                    <div className="ml-3 text-sm">
                        <div className="text-lg dark:text-neutral-200 text-neutral-800 font-medium">{truncate(guild.name, 16)}</div>
                        <div>{guild.memberCount} members</div>
                    </div>
                </div>
            ))}

        </>
    );

    return (
        <div className="text-center flex items-center flex-col w-full">

            <div className="lg:text-6xl text-5xl flex font-medium relative mb-1 dark:text-neutral-100 text-neutral-900 break-words">
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {" of "}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                <div
                    className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none sm:block hidden"
                    style={{ animation: "ScaleBlink 1s ease-in-out infinite" }}
                >
                    {uwus[Math.floor(Math.random() * uwus.length)]}
                </div>
            </div>

            <div className="md:text-xl text-md p-4 max-w-4xl">
                Wamellow revolutionizes your experience with a plethora of features and extensive customization options, offering a superior alternative to popular bots like MEE6.

                <div className="flex mt-6 justify-center gap-2 text-xl">
                    <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 w-1/2 sm:w-min justify-center">
                        <HiPlus className="relative top-1" />
                        <span className="ml-2">Wamellow</span>
                    </Link>
                    <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 w-1/2 sm:w-min justify-center">
                        <BsDiscord className="relative top-1" />
                        <span className="ml-2">Support</span>
                    </Link>
                    {/* <Link href="/dashboard" className="flex border-2 dark:border-wamellow border-wamellow-100 dark:hover:border-wamellow-light hover:border-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200">
                        <span className="mr-2">Dashboard</span>
                        <HiArrowRight className="relative top-1" />
                    </Link> */}
                </div>

            </div>

            <div className="text-left lg:mt-24 mt-16 max-w-full w-full">
                <h2 className="lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-medium">Used by your mum</h2>
                <div className="md:text-xl text-md pt-4">
                    Wamellow is widely embraced in many servers, including those frequented by your mum.
                </div>

                <div className="relative flex overflow-x-hidden mt-[-26px]">
                    <div className="py-12 animate-marquee whitespace-nowrap flex gap-3">
                        {InnerMarquee}
                    </div>
                    <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap ml-3 flex gap-3">
                        {InnerMarquee}
                    </div>
                </div>

                <div className="relative flex overflow-x-hidden mt-[-72px]">
                    <div className="py-12 animate-marquee-reverse whitespace-nowrap flex gap-3">
                        {InnerMarquee}
                    </div>
                    <div className="absolute top-0 py-12 animate-marquee-reverse2 whitespace-nowrap ml-3 flex gap-3">
                        {InnerMarquee}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute bottom-10 w-full h-[200px]" style={{ background: "linear-gradient(90deg, var(--background-rgb) 0%, rgba(0,0,0,0) 4%, rgba(0,0,0,0) 96%, var(--background-rgb) 100%)" }} />
                </div>
                <span className="relative bottom-10 dark:text-neutral-500 text-neutral-400">{topGuilds.length} featured servers</span>
            </div>

            <div className="w-full rounded-md overflow-hidden mt-16 relative">
                <div>
                    <div className="min-w-full h-4 bg-red-500" />
                    <div className="min-w-full h-4 bg-orange-500" />
                    <div className="min-w-full h-4 bg-yellow-500" />
                    <div className="min-w-full h-4 bg-green-500" />
                    <div className="min-w-full h-4 bg-blue-500" />
                    <div className="min-w-full h-4 bg-violet-500" />
                </div>
                <div className="absolute top-3 left-3 opacity-90 text-left py-2 px-4 dark:bg-wamellow bg-wamellow-100 rounded-md overflow-hidden">
                    <div className="text-2xl font-semibold flex items-center gap-2 bg-gradient-to-r from-red-400 from-10% to-violet-400 to-90% bg-clip-text text-transparent">
                        We support LGBTQ+
                        <HiHeart className="text-[#d6829f]" />
                    </div>
                    <div className="font-medium opacity-80 sm:block hidden">Be yourself, love who you want to, and embrace your true identity</div>
                </div>
            </div>

        </div>
    );
}