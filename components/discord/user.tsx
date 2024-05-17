import { Avatar } from "@nextui-org/react";
import React from "react";

import cn from "@/utils/cn";

import DiscordAppBadge from "./app-badge";

interface Props {
    username: string;
    avatar: string;
    isBot?: boolean;
    isTalking?: boolean
}

export default function DiscordUser({
    username,
    avatar,
    isBot,
    isTalking
}: Props) {
    return (
        <div className="flex items-center space-x-2">
            <Avatar
                className={cn("h-6 w-6 shrink-0", isTalking && "outline-1.5 outline-green-500")}
                radius="full"
                src={avatar}
            />
            <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer" >
                {username}
            </div>
            {isBot &&
                <DiscordAppBadge />
            }
        </div>
    );
}