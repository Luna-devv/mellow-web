import { PermissionFlagsBits } from "discord-api-types/v10";
import { useMemo } from "react";
import { HiExclamation } from "react-icons/hi";

import type { Guild } from "@/common/guilds";
import DiscordChannel from "@/components/discord/channel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ApiV1GuildsChannelsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";

interface Props {
    className: string;
    guild: Guild | undefined;
}

const MAX_CHANNELS = 4 as const;

export default function Permissions({
    className,
    guild
}: Props) {
    const channels = useMemo(
        () => guild?.channels?.filter((channel) => (BigInt(channel.permissions) & PermissionFlagsBits.ViewChannel) === BigInt(0)) || [],
        [guild?.channels]
    );

    if (!channels.length) return <></>;

    return (
        <div
            className={cn("p-4 rounded-xl w-1/4 bg-wamellow h-fit relative", className)}
        >
            <h3 className="text-lg font-medium text-neutral-200">
                Missing Access Permission
            </h3>

            <Channels channels={channels} />
        </div>
    );
}

function Channels({
    channels
}: {
    channels: ApiV1GuildsChannelsGetResponse[];
}) {
    return (<>
        <p className="text-sm opacity-75 mb-3">
            Wammellow cannot track activity in {channels.length} channels as it is missing permissions.
        </p>

        <div className="flex flex-col gap-1">
            {channels.map((c, i) => {
                if (i >= MAX_CHANNELS) return null;
                return (
                    <div
                        className="flex justify-between items-center"
                        key={"lbperms-" + c.id}
                    >
                        <DiscordChannel
                            type="text"
                            name={c.name}
                            isTruncated
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HiExclamation className="text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Missing View Channel</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            })}
        </div>

        {channels.length > MAX_CHANNELS && (
            <Tooltip>
                <TooltipTrigger>
                    <p className="text-sm opacity-75 relative bottom-1 mt-2">
                        +{channels.length - MAX_CHANNELS} more
                    </p>
                </TooltipTrigger>
                <TooltipContent>
                    {channels.slice(MAX_CHANNELS).map((channel) => "#" + channel.name).join(", ")}
                </TooltipContent>
            </Tooltip>
        )}
    </>);
}