import Image from "next/image";
import { HiLightningBolt } from "react-icons/hi";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { intl } from "@/utils/numbers";

import type { ApiCluster } from "./api";

export function Cluster(cluster: ApiCluster) {
    return (
        <div
            className="w-full md:flex gap-4 space-y-2 md:space-y-0 justify-between items-center p-4 bg-wamellow rounded-lg outline-violet-400 duration-200 h-min"
            id={"cluster-" + cluster.id}
        >
            <div className="sm:flex items-center w-1/6">
                <div className="flex gap-1 items-center">
                    <Icon ping={cluster.ping} />
                    <span className="text-neutral-100 text-lg font-medium">
                        {cluster.name}
                    </span>

                    <span className="text-neutral-300">
                        #{cluster.id}
                    </span>
                </div>
            </div>

            <div className="md:flex w-2/3 justify-between text-primary-foreground">
                <div className="md:w-1/4">
                    <span className="text-muted-foreground mr-1 text-xs">Uptime:</span>
                    {cluster.uptime}
                </div>
                <div className="md:w-1/4">
                    <span className="text-muted-foreground mr-1 text-xs">Memory:</span>
                    {intl.format(cluster.memory)}mb
                </div>
                <div className="md:w-1/4">
                    <span className="text-muted-foreground mr-1 text-xs">Users:</span>
                    {intl.format(cluster.users)}
                </div>
                <div className="md:w-1/5">
                    <span className="text-muted-foreground mr-1 text-xs">Guilds:</span>
                    {intl.format(cluster.guilds)}
                </div>
            </div>

            <Badge
                className={cn(cluster.ping > 0 && "text-neutral-400 bg-wamellow max-w-1/6")}
                variant={cluster.ping < 0 ? "destructive" : "default"}
                radius="rounded"
            >
                <HiLightningBolt />
                {cluster.ping}ms
            </Badge>
        </div>
    );
}

function Icon({ ping }: { ping: number; }) {
    const emoteId = ping > 0
        ? "949003338186383491"
        : "949003440091201587";

    return (
        <Image
            alt="online"
            className="size-7"
            src={`https://cdn.discordapp.com/emojis/${emoteId}.webp?size=32&quality=lossless`}
            width={32}
            height={32}
        />
    );
}