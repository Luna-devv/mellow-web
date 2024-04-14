import React from "react";
import { HiHashtag, HiVolumeUp } from "react-icons/hi";

interface Props {
    type: "text" | "voice";
    name: string;
    children?: React.ReactNode;
}

export default function DiscordChannel({
    type,
    name,
    children
}: Props) {
    return (
        <div className="text-medium text-neutral-400">
            <span className="flex items-center gap-1">
                {type === "text"
                    ? <HiHashtag />
                    : <HiVolumeUp />
                }
                {name}
            </span>
            {children &&
                <div className="ml-6 mt-2 flex flex-col gap-3">
                    {children}
                </div>
            }
        </div>
    );
}