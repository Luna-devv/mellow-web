import { Chip } from "@nextui-org/react";
import Image from "next/image";
import { ReactNode } from "react";
import { FaCrown } from "react-icons/fa6";
import { HiLightningBolt } from "react-icons/hi";

import cn from "@/utils/cn";

import { ApiCluster } from "./api";

export function Cluster(cluster: ApiCluster) {
    return (
        <div
            className="p-4 bg-wamellow rounded-lg space-y-2 outline-violet-400 duration-200 h-fit"
            id={"cluster-" + cluster.id}
        >
            <div className="sm:flex items-center">
                <div className="flex gap-1 items-center">
                    <Icon ping={cluster.ping} />
                    <span className="text-neutral-100 text-lg font-medium">
                        {cluster.name}
                    </span>

                    <span className="text-neutral-300">
                        #{cluster.id}
                    </span>
                </div>

                {cluster.id === 0
                    ? <Chip
                        className="mt-1 sm:mt-0 ml-auto"
                        startContent={<FaCrown className="ml-1" />}
                        color="warning"
                        variant="flat"
                    >
                        master, {cluster.ping}ms
                    </Chip>
                    : <Chip
                        className={cn("ml-auto", cluster.ping > 0 && "text-neutral-400 bg-wamellow")}
                        startContent={<HiLightningBolt className="ml-1" />}
                        variant="flat"
                        color={cluster.ping < 0 ? "danger" : "default"}
                    >
                        {cluster.ping}ms
                    </Chip>
                }
            </div>

            <div>
                <Row name="memory">
                    {cluster.memory}mb
                </Row>
                <Row name="guilds">
                    {cluster.guilds}
                </Row>
                <Row name="users">
                    {cluster.users}
                </Row>
            </div>
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

function Row({ name, children }: { name: string; children: ReactNode; }) {
    return (
        <div>
            <span className="text-neutral-300 font-medium">{children}</span>
            {" "}{name}
        </div>
    );
}