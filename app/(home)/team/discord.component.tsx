import { getGuild } from "@/lib/discord/guild";
import { cn } from "@/utils/cn";
import { intl } from "@/utils/numbers";
import Image from "next/image";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

export async function DiscordServer({
    guildId
}: {
    guildId: string;
}) {
    const guild = await getGuild(guildId);
    const widget = await guild?.fetchWidget();

    if (!guild) return <></>;

    return (
        <Link
            className={cn(
                "flex items-center gap-3 p-4 bg-wamellow rounded-xl cursor-default",
                "duration-100 outline-violet-500 hover:outline cursor-pointer"
            )}
            href={widget?.instant_invite || "/support"}
            target="_blank"
        >
            <Image
                alt={guild.name}
                className="rounded-lg shrink-0 aspect-square"
                height={52}
                width={52}
                src={guild.iconUrl || "/discord.webp"}
            />

            <div className="space-y-0.5">

                <div className="flex items-center gap-4">
                    <span className="text-lg text-neutral-200 font-medium -mb-0.5">
                        {guild.name}
                    </span>
                </div>

                <div className="flex gap-3">
                    <span className="text-violet-400" >
                        discord.gg/{widget?.instant_invite?.split("/invite/")[1]}
                    </span>
                    —
                    <span>
                        {intl.format(widget?.presence_count || 0)} online
                    </span>
                </div>

            </div>

            <HiExternalLink className="ml-auto w-5 h-5" />
        </Link>
    );
}