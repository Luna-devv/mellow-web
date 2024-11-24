import { Chip } from "@nextui-org/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { FaCrown } from "react-icons/fa";

import type { ApiNode } from "./api";

export function Node({ index, node }: { index: number; node: ApiNode; }) {
    return (
        <div
            className="p-4 bg-wamellow rounded-lg space-y-2 outline-violet-400 duration-200 h-fit"
            id={"node-" + node.id}
        >
            <div className="flex items-center gap-1">
                <Icon id={node.id.split("-")[0]} />
                <span className="text-neutral-100 text-lg font-medium">
                    {node.id}
                </span>

                <span className="text-neutral-300">
                    #{index}
                </span>

                {node.id.endsWith("-lun-1") &&
                    <Chip
                        className="ml-auto hidden sm:flex"
                        startContent={<FaCrown className="ml-1" />}
                        color="warning"
                        variant="flat"
                    >
                        master
                    </Chip>
                }
            </div>

            <div>
                <Row name="uptime">
                    {node.uptime}
                </Row>
                <Row name="memory">
                    {node.memory}mb
                </Row>
                <Row name="usage">
                    {node.usage}%
                </Row>
                <Row name="streams">
                    {node.players}
                </Row>
            </div>
        </div>
    );
}

function Icon({ id }: { id: string; }) {
    return (
        <Image
            alt={`${id} country flag`}
            className="p-0.5 size-7 rounded-full"
            src={`/icons/${id}.webp`}
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