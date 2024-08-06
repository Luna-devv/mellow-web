"use client";

import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import { useCookies } from "next-client-cookies";
import { ReactNode, useEffect, useMemo, useState } from "react";

import DumbTextInput from "@/components/inputs/dumb-text-input";
import { intl } from "@/utils/numbers";

import { ApiV1StatusGetResponse } from "./api";

export function Side({
    status
}: {
    status:ApiV1StatusGetResponse;
}) {
    const cookies = useCookies();
    const [guildId, setGuildId] = useState<string>("");

    const clusterId = useMemo(() => findClusterId(guildId || "", status.clusters.length), [guildId]);

    useEffect(() => {
        if (!/^\d{15,20}$/.test(guildId)) return;

        const element = document.getElementById("cluster-" + clusterId);
        if (!element) return;

        element.classList.add("outline");
        return () => element.classList.remove("outline");
    }, [clusterId]);

    return (
        <div className="flex flex-col gap-5">
            <Accordion
                variant="shadow"
                className="bg-wamellow"
                selectionMode="multiple"
                defaultExpandedKeys={["1"]}
                disableAnimation={cookies.get("reduceMotions") === "true"}
            >
                <AccordionItem
                    key="1"
                    aria-label="about"
                    title="Performance & Usage"
                    classNames={{ content: "mb-2 space-y-4" }}
                >
                    <Row name="Uptime">
                        {status.clusters[0].uptime}
                    </Row>
                    <Row name="Latency avg">
                        {~~(status.clusters.reduce((prev, cur) => prev + cur.ping, 0) / status.clusters.length)}ms
                    </Row>
                    <Row name="Memory">
                        {intl.format(~~(status.clusters.reduce((prev, cur) => prev + cur.memory, 0)))}mb
                    </Row>
                </AccordionItem>
            </Accordion>

            <div>
                <DumbTextInput
                    name="Find your Server's Cluster"
                    placeholder="Copy & Paste your Server Id"
                    value={guildId}
                    setValue={setGuildId}
                    description={/^\d{15,20}$/.test(guildId) ? `Your guild is on cluster #${clusterId}.` : ""}
                />

                Discord bots are divided into clusters or shards, which are logical processes running on the CPU, akin to multithreading.
            </div>
        </div>
    );
}

function Row({ name, children }: { name: string; children: ReactNode; }) {
    return (
        <div className="flex items-center justify-between">
            {name}
            <Chip
                className="select-none"
                radius="sm"
            >
                {children}
            </Chip>
        </div>
    );
}

function findClusterId(guildId: string, totalShards: number) {
    return Number((BigInt(guildId) >> BigInt(22))) % totalShards;
}