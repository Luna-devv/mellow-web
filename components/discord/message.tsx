"use client";

import { cn } from "@/utils/cn";
import React from "react";

import DiscordAppBadge from "./app-badge";
import { UserAvatar } from "../ui/avatar";

interface Props {
    children: React.ReactNode;
    mode: "DARK" | "LIGHT";

    commandUsed?: {
        name: string;
        username: string;
        avatar: string;
        bot: boolean;
    };

    user: {
        username: string;
        avatar: string;
        bot: boolean;
    };
}

export default function DiscordMessage({
    children,
    commandUsed,
    user,
    mode
}: Props) {
    return (
        <div className={cn("group relative rounded-lg px-1 w-full", mode === "DARK" ? "text-neutral-100" : "text-neutral-900")}>

            {commandUsed
                ? <div className={cn("flex items-center gap-1 opacity-70 text-sm ml-4", mode === "DARK" ? "text-neutral-400" : "text-neutral-600")} >
                    <div
                        className={cn(
                            "border-t-2 border-l-2 rounded-tl-md w-7 relative shrink-0 h-2.5 top-1",
                            mode === "DARK" ? "text-neutral-600 border-neutral-600" : "text-neutral-400 border-neutral-400")
                        }
                    />
                    <div className="mx-0.5 flex items-center gap-1 font-semibold whitespace-nowrap overflow-hidden text-ellipsis shrink-0">
                        <UserAvatar
                            alt={`${commandUsed.username}'s avatar`}
                            className="size-4"
                            src={commandUsed.avatar}
                            username={commandUsed.username}
                        />
                        <span className={mode === "DARK" ? "text-violet-400" : "text-violet-600"}>
                            {commandUsed.username}
                        </span>
                        {commandUsed.bot &&
                            <DiscordAppBadge />
                        }
                        used
                        <span className="text-blue-400">/{commandUsed.name}</span>
                    </div>
                </div>
                : null
            }

            <div className="flex flex-row items-start pointer-events-none [&>*]:pointer-events-auto">
                <div className="flex justify-start items-center w-[52px] shrink-0">
                    <UserAvatar
                        alt={`${user.username}'s avatar`}
                        className="size-10 hover:cursor-pointer mt-1"
                        src={user.avatar}
                        username={user.username}
                    />
                </div>

                <div className="flex-1 w-0">
                    <div className="flex items-center space-x-2">
                        <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis hover:underline cursor-pointer" >
                            {user.username}
                        </div>
                        {user.bot &&
                            <DiscordAppBadge />
                        }
                        <time
                            className="mt-[2px] text-xs opacity-50 truncate"
                            dateTime={new Date(1_019_060_317).toISOString()}
                        >
                            {formatTime(new Date(1_019_060_317))}
                        </time>
                    </div>

                    <div className="opacity-90 break-words hyphens-auto font-light flex flex-col text-bsm" lang="en">
                        {children}
                    </div>

                </div>
            </div>

        </div>
    );
}

function formatTime(date: Date) {
    const timeString = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        timeZone: "Europe/Vienna"
    });

    return `Today at ${timeString}`;
}