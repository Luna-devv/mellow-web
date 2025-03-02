import { cn } from "@/utils/cn";

import { UserAvatar } from "../ui/avatar";
import DiscordAppBadge from "./app-badge";

interface Props {
    username: string;
    avatar: string;
    isBot?: boolean;
    isTalking?: boolean;
}

export default function DiscordUser({
    username,
    avatar,
    isBot,
    isTalking
}: Props) {
    return (
        <div className="flex items-center space-x-2">
            <UserAvatar
                alt={`${username}'s avatar`}
                className={cn("size-6 shrink-0", isTalking && "outline-1.5 outline-green-500")}
                src={avatar}
                username={username}
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