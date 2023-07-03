
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";

import { userStore } from "@/common/user";
import { widthStore } from "@/common/width";

export default function Home() {
    const width = widthStore((w) => w);
    const user = userStore((s) => s);

    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];
    const [uwu, setUwU] = useState<string>("");

    useEffect(() => {
        setUwU(uwus[Math.floor(Math.random() * uwus.length)]);
    }, []);

    const InnerMarquee = (
        <>
            {new Array(4).fill("").map(() => (
                <div className="dark:bg-wamellow bg-wamellow-100 py-4 px-5 flex items-center rounded-lg w-64 drop-shadow-md" key={Math.random().toString()}>
                    <Image src="https://cdn.waya.one/r/CAT.jpeg" width={46} height={46} alt="Server" className="rounded-lg" />
                    <div className="ml-3 text-sm">
                        <div className="text-lg text-slate-200">Someones</div>
                        <div>1,159 members</div>
                    </div>
                </div>
            ))}

        </>
    );

    return (
        <div className="text-center flex items-center flex-col w-full">

            <div className={`${width > 475 ? "text-6xl" : "text-5xl"} flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words`}>
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {width > 388 && " of "} {width < 475 && <br />}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                {width > 910 && <div className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none" style={{ animation: "ScaleBlink 1s ease-in-out infinite" }} onClick={() => setUwU(uwus[Math.floor(Math.random() * uwus.length)])}>{uwu}</div>}
            </div>

            <div className="text-xl p-4 max-w-4xl">
                Wamellow revolutionizes your experience with a plethora of free features and extensive customization options, offering a superior alternative to popular bots like MEE6.

                <div className="flex mt-6 justify-center gap-2">
                    <Link href="/login" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                        <HiPlus className="relative top-1" />
                        <span className="ml-2">{width > 410 ? "Add to Server" : "Invite"}</span>
                    </Link>
                    <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                        <BsDiscord className="relative top-1" />
                        <span className="ml-2">Support</span>
                    </Link>
                </div>

            </div>

            <div className="text-left mt-24 max-w-full">
                <h2 className="text-4xl dark:text-slate-100 text-slate-900 font-medium">Used by your mum</h2>
                <div className="text-xl pt-4 max-w-2xl">
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
                <span className="relative bottom-[120px] dark:text-neutral-500 text-neutral-400">8 servers</span>
            </div>












            <div className={`${width > 475 ? "text-6xl" : "text-5xl"} flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words`}>
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {width > 388 && " of "} {width < 475 && <br />}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                {width > 910 && <div className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none" style={{ animation: "ScaleBlink 1s ease-in-out infinite" }} onClick={() => setUwU(uwus[Math.floor(Math.random() * uwus.length)])}>{uwu}</div>}
            </div>

            <div className={`${width > 475 ? "text-6xl" : "text-5xl"} flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words`}>
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {width > 388 && " of "} {width < 475 && <br />}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                {width > 910 && <div className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none" style={{ animation: "ScaleBlink 1s ease-in-out infinite" }} onClick={() => setUwU(uwus[Math.floor(Math.random() * uwus.length)])}>{uwu}</div>}
            </div>

            <div className={`${width > 475 ? "text-6xl" : "text-5xl"} flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words`}>
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {width > 388 && " of "} {width < 475 && <br />}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                {width > 910 && <div className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none" style={{ animation: "ScaleBlink 1s ease-in-out infinite" }} onClick={() => setUwU(uwus[Math.floor(Math.random() * uwus.length)])}>{uwu}</div>}
            </div>

            <div className={`${width > 475 ? "text-6xl" : "text-5xl"} flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words`}>
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {width > 388 && " of "} {width < 475 && <br />}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                {width > 910 && <div className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none" style={{ animation: "ScaleBlink 1s ease-in-out infinite" }} onClick={() => setUwU(uwus[Math.floor(Math.random() * uwus.length)])}>{uwu}</div>}
            </div>

            <div className={`${width > 475 ? "text-6xl" : "text-5xl"} flex font-medium relative mb-1 dark:text-slate-100 text-slate-900 break-words`}>
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {width > 388 && " of "} {width < 475 && <br />}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                {width > 910 && <div className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none" style={{ animation: "ScaleBlink 1s ease-in-out infinite" }} onClick={() => setUwU(uwus[Math.floor(Math.random() * uwus.length)])}>{uwu}</div>}
            </div>

        </div>
    );
}