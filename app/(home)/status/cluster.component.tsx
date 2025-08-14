import Image from "next/image";
import type { ReactNode } from "react";
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
                <Row name="uptime">
                    {cluster.uptime}
                </Row>
                <Row name="memory">
                    {intl.format(cluster.memory)}mb
                </Row>
                <Row name="users">
                    {intl.format(cluster.users)}
                </Row>
                <Row name="servers" className="w-1/5">
                    {intl.format(cluster.guilds)}
                </Row>
            </div>

            <Badge
                className={cn(cluster.ping > 0 && "max-w-1/6")}
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


function Row({ name, children, className }: { name: string; children: ReactNode; className?: string; }) {
    return (
        <div className={cn("md:w-1/5", className)}>
            {children}
            <span className="text-muted-foreground mr-1 text-sm">{" "}{name}</span>
        </div>
    );
}