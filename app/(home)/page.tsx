
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";

import { ApiV1TopguildsGetResponse } from "@/typings";

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 1_000 * 60 * 60 } }).then((res) => res.json()) as ApiV1TopguildsGetResponse[];
    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];

    const InnerMarquee = (
        <>
            {topGuilds?.map((guild) => (
                <div className="dark:bg-wamellow bg-wamellow-100 py-4 px-5 flex items-center rounded-lg w-64 drop-shadow-md" key={Math.random().toString()}>
                    <Image src={guild.icon || "https://cdn.waya.one/r/discord.png"} width={46} height={46} alt="Server" className="rounded-lg" />
                    <div className="ml-3 text-sm">
                        <div className="text-lg text-slate-200">{guild.name.slice(0, 16)}{guild.name.length > 16 && "..."}</div>
                        <div>{guild.memberCount} members</div>
                    </div>
                </div>
            ))}

        </>
    );

    return (
        <div className="text-center flex items-center flex-col w-full">

            <div className="lg:text-6xl text-4xl flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words">
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {" of "}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                <div
                    id="uwu"
                    className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none"
                    style={{ animation: "ScaleBlink 1s ease-in-out infinite" }}
                >
                    {uwus[Math.floor(Math.random() * uwus.length)]}
                </div>
            </div>

            <div className="md:text-xl text-sm p-4 max-w-4xl">
                Wamellow revolutionizes your experience with a plethora of free features and extensive customization options, offering a superior alternative to popular bots like MEE6.

                <div className="flex mt-6 justify-center gap-2 text-xl">
                    <Link href="/login" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                        <HiPlus className="relative top-1" />
                        <span className="ml-2">Wamellow</span>
                    </Link>
                    <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                        <BsDiscord className="relative top-1" />
                        <span className="ml-2">Support</span>
                    </Link>
                </div>

            </div>

            <div className="text-left lg:mt-24 mt-16 max-w-full w-full">
                <h2 className="lg:text-4xl text-3xl dark:text-slate-100 text-slate-900 font-medium">Used by your mum</h2>
                <div className="md:text-xl text-sm pt-4 max-w-2xl">
                    Wamellow is widely embraced in various servers, including those frequented by your mum, and a wide range of joes.
                </div>

                <div className="relative flex overflow-x-hidden">
                    <div className="py-12 animate-marquee whitespace-nowrap flex gap-3">
                        {InnerMarquee}
                    </div>
                    <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap ml-3 flex gap-3">
                        {InnerMarquee}
                    </div>
                </div>

                <div className="relative bottom-32">
                    <div className="w-full h-20" style={{ background: "linear-gradient(90deg, rgb(24, 25, 28) 0%, rgba(0,0,0,0) 4%, rgba(0,0,0,0) 96%, rgb(24, 25, 28) 100%)" }} />
                </div>
                <span className="relative bottom-[120px] dark:text-neutral-500 text-neutral-400">{topGuilds.length} featured servers</span>
            </div>

        </div>
    );
}