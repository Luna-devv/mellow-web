"use client";

import { Avatar } from "@nextui-org/react";
import React, { FunctionComponent } from "react";
import { HiCheck } from "react-icons/hi";

import cn from "@/utils/cn";

interface Props {
    children: React.ReactNode;
    mode: "DARK" | "LIGHT";

    commandUsed?: {
        name: string;
        username: string;
        avatar: string;
        bot: boolean;
    }

    user: {
        username: string;
        avatar: string;
        bot: boolean;
    }
}

const DiscordMessage: FunctionComponent<Props> = ({ children, commandUsed, user, mode }) => {

    function formatTime(date: Date) {
        const timeString = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
        return `Today at ${timeString}`;
    }

    return (
        <div className={cn("group relative rounded-lg px-1 w-full", mode === "DARK" ? "text-neutral-100 hover:bg-neutral-800/40" : "text-neutral-900 hover:bg-neutral-200/40")}>

            {commandUsed ?
                <div className={cn("flex items-center gap-1 opacity-70 text-sm ml-4", mode === "DARK" ? "text-neutral-400" : "text-neutral-600")} >
                    <div className={cn("border-t-2 border-l-2 rounded-tl-md w-7 relative shrink-0 h-2.5 top-1", mode === "DARK" ? "text-neutral-600 border-neutral-600" : "text-neutral-400 border-neutral-400")} />
                    <div className="mx-0.5 flex items-center gap-1 font-semibold whitespace-nowrap overflow-hidden text-ellipsis shrink-0">
                        <Avatar
                            className="h-4 w-4"
                            radius="full"
                            src={commandUsed.avatar}
                        />
                        <span className={cn(mode === "DARK" ? "text-violet-400" : "text-violet-600")}>{commandUsed.username}</span>
                        {commandUsed.bot && <div className="text-xxs text-white bg-blurple rounded py-[1px] px-1 h-4 flex items-center">
                            <HiCheck />
                            <span className="ml-1">BOT</span>
                        </div>
                        }
                        used
                        <span className="text-blue-400">/{commandUsed.name}</span>
                    </div>
                </div>
                : null
            }

            <div className="flex flex-row items-start pointer-events-none [&>*]:pointer-events-auto">
                <div className="flex justify-start items-center w-[52px] shrink-0">
                    <Avatar
                        className="h-10 w-10 hover:cursor-pointer mt-1.5"
                        radius="full"
                        src={user.avatar}
                    />
                </div>

                <div className="flex-1 w-0">
                    <div className="flex items-center space-x-2">
                        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis hover:underline" >
                            {user.username}
                        </div>
                        {user.bot && <div className="text-xxs text-white bg-blurple rounded py-[1px] px-1 flex items-center">
                            <HiCheck />
                            <span className="ml-1">BOT</span>
                        </div>
                        }
                        <time
                            className="mt-[2px] text-xs opacity-70 font-light"
                            dateTime={new Date().toISOString()}
                        >
                            {formatTime(new Date())}
                        </time>
                    </div>

                    <div className="opacity-90 break-words hyphens-auto font-light flex flex-col text-bsm" lang="en">
                        {children}
                    </div>

                </div>
            </div>


        </div>
    );
};

export default DiscordMessage;