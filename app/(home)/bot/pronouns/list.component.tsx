import Link from "next/link";
import { HiAcademicCap } from "react-icons/hi";

import Ad from "@/components/ad";
import { PronounsResponse } from "@/typings";
import cn from "@/utils/cn";

export default async function List({ res, type }: { res: PronounsResponse, type: string }) {

    return (
        <div>
            <div className="w-full flex items-center justify-between mb-2">
                <span className="text-3xl font-semibold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep">{type}</span>
                <span>{res.content.length} avaliable</span>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4">
                <div className="rounded-md overflow-hidden sm:w-1/2 lg:w-3/4" >
                    {res.content?.map((element, i) => (
                        <div key={element} className={cn("flex items-center justify-between py-2 px-3", i % 2 === 0 ? "dark:bg-wamellow bg-wamellow-100" : "dark:bg-wamellow/75 bg-wamellow-100/75")}>
                            <span>{element}</span>
                            <span className="italic text-sm">{(i + 1).toString().padStart(2, "0")}</span>
                        </div>
                    ))}
                </div>

                <div className="sm:w-1/2 lg:w-1/4 flex flex-col gap-2">
                    <Ad />
                    <Ad
                        title="Auditional Text"
                        description="Convert your text into either a MP3 file or let the bot speak the text in your current voice channel and choose from 18 different voices."
                        url="https://discord.com/oauth2/authorize?client_id=1097907896987160666&scope=bot&permissions=2147486720"
                        color="green"
                    />
                    <Ad
                        title="Textional Voice"
                        description="Record and transcribe voice channels in real-time for moderators with voice-to-text bot."
                        url="https://discord.com/oauth2/authorize?client_id=1097907896987160666&scope=bot&permissions=2147486720"
                        color="red"
                    />
                    <span className="text-neutral-500 flex flex-wrap items-center gap-1">
                        All bots are owned by <Link className="hover:underline" href="https://lunish.nl" aria-label="Wamellow's developer">lunish.nl</Link>
                        <HiAcademicCap />
                    </span>
                </div>
            </div>

        </div>
    );
}