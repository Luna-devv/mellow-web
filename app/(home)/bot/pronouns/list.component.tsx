import Link from "next/link";
import { HiAcademicCap } from "react-icons/hi";

import Ad from "@/components/ad";
import type { PronounsResponse } from "@/typings";

interface Props {
    res: PronounsResponse;
    type: string;
}

export default function List({ res, type }: Props) {
    return (
        <div>
            <div className="w-full flex items-center justify-between mb-2">
                <span className="text-3xl font-semibold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep">{type}</span>
                <span>{res.content.length} avaliable</span>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4">
                <div className="rounded-md overflow-hidden sm:w-1/2 lg:w-3/4 dark:bg-wamellow bg-wamellow-100 p-2 divide-y divide-wamellow" >
                    {res.content
                        .sort((a, b) => a.localeCompare(b))
                        ?.map((element, i) => (
                            <div key={element} className="flex items-center justify-between py-2 px-3" >
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
                        url="https://discord.com/oauth2/authorize?client_id=985213199248924722&scope=bot&permissions=3197952"
                        color="green"
                    />
                    <Ad
                        title="Textional Voice"
                        description="Record and transcribe voice channels in real-time for moderators with voice-to-text bot."
                        url="https://discord.com/oauth2/authorize?client_id=1097907896987160666&scope=bot&permissions=2147486720"
                        color="red"
                    />
                    <span className="text-neutral-500 flex flex-wrap items-center gap-1">
                        All bots are owned by <Link className="hover:underline" href="http://shi.gg">shi.gg</Link>
                        <HiAcademicCap />
                    </span>
                </div>
            </div>

        </div>
    );
}