import { Tooltip } from "@nextui-org/react";
import { HiExclamation } from "react-icons/hi";

import { Guild } from "@/common/guilds";
import DiscordChannel from "@/components/discord/channel";
import { ApiV1GuildsChannelsGetResponse } from "@/typings";
import cn from "@/utils/cn";

interface Props {
    className: string;
    guild: Guild | undefined;
}

const MAX_CHANNELS = 4;

export default function Permissions({
    className,
    guild
}: Props) {

    const channels = guild?.channels
        ?.filter((c) => c.missingPermissions.includes("ViewChannel")) || [];

    if (!channels.length) return <></>;

    return (
        <div
            className={cn("p-4 rounded-xl w-1/4 bg-wamellow h-fit relative", className)}
        >
            <h3 className="text-lg font-medium text-neutral-200">
                {channels.length
                    ? "Missing Access Permission"
                    : "Permissions are all set! 🎉"
                }
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
    return (
        <>
            <p className="text-sm opacity-75 mb-3">
                Wammellow cannot track acivity in {channels.length} channels as it is missing permission.
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
                            <Tooltip
                                content={"Missing View Channel"}
                                placement="right"
                                className="bg-[#030206]"
                                closeDelay={0}
                            >
                                <span>
                                    <HiExclamation className="text-red-500" />
                                </span>
                            </Tooltip>
                        </div>
                    );
                })}
            </div>

            {
                channels.length > MAX_CHANNELS &&
                <p className="text-sm opacity-75 relative bottom-1 mt-2">
                    +{channels.length - MAX_CHANNELS} more
                </p>
            }
        </>
    );
}