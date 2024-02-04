import { Avatar } from "@nextui-org/react";
import React from "react";
import { HiCheck } from "react-icons/hi";

import cn from "@/utils/cn";

interface Props {
    username: string;
    avatar: string;
    isBot?: boolean;
    isTalking?: boolean
}

export default function DiscordUser({ username, avatar, isBot, isTalking }: Props) {
    return (
        <div className="flex items-center space-x-2">
            <Avatar
                className={cn("h-6 w-6", isTalking && "outline-1.5 outline-green-500")}
                radius="full"
                src={avatar}
            />
            <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis" >
                {username}
            </div>
            {isBot && <div className="text-xxs text-white bg-blurple rounded h-4 px-1 flex items-center">
                <HiCheck />
                <span className="ml-1">BOT</span>
            </div>
            }
        </div>
    );
}