import React from "react";
import { HiVolumeUp } from "react-icons/hi";

interface Props {
    name: string;
    children?: React.ReactNode;
}

export default function DiscordChannelVoice({ name, children }: Props) {
    return (
        <div className="text-medium text-neutral-400">
            <span className="flex items-center gap-1">
                <HiVolumeUp />
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