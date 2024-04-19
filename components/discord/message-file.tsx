import { Fira_Code } from "next/font/google";
import React from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp } from "react-icons/hi";

const firacode = Fira_Code({ subsets: ["latin"] });

interface Props {
    mode: "DARK" | "LIGHT";
    duration: number;
}

export default function DiscordMessageFile({
    duration,
    mode
}: Props) {
    return (
        <div className={`w-full ${mode === "DARK" ? "text-neutral-200" : "text-neutral-800"} font-light p-3 rounded mt-2`} style={{ backgroundColor: mode === "DARK" ? "rgb(40, 42, 46)" : "rgb(242, 243, 245)" }}>

            <div className="flex gap-2 w-full max-w-full items-center">
                <svg width={24 * 1.2} height={40 * 1.2}>
                    <image xlinkHref="/voicefile.svg" width={24 * 1.2} height={40 * 1.2} />
                </svg>

                <div className="flex flex-col">
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">hello_world.mp3</span>
                    <span className="text-xxs font-medium text-neutral-400">420.69 KB</span>
                </div>
            </div>

            <div className={`${firacode.className} font-medium text-sm bg-neutral-900 text-neutral-400 w-full flex gap-2 py-1 px-2 items-center rounded-md mt-2`}>
                <BsFillPlayFill className="h-7 w-7 cursor-pointer hover:text-neutral-300" />
                <span className="text-neutral-300">00:{Math.round(duration / 3)}/00:{duration}</span>
                <div className="bg-neutral-600 h-2 w-full rounded-full overflow-hidden cursor-pointer">
                    <div className="bg-blurple h-full w-1/3 rounded-full" />
                </div>
                <HiVolumeUp className="h-7 w-7 cursor-pointer  hover:text-neutral-300" />
            </div>

        </div>
    );
}