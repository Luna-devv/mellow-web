import React from "react";
import { HiChevronDown } from "react-icons/hi";

interface Props {
    name: string;
    children: React.ReactNode;
}

export default function DiscordChannelCategory({ name, children }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <span className="uppercase font-medium text-xs flex items-center gap-0.5 text-neutral-400/80 relative right-4">
                <HiChevronDown />
                {name}
            </span>
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </div>
    );
}