"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { HiChartBar } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import { Section } from "@/components/section";

import OverviewLinkComponent from "../../../components/OverviewLinkComponent";
import FollowUpdates from "../updates.component";

export default function Home() {
    const cookies = useCookies();
    const guild = guildStore((g) => g);

    const params = useParams();

    return (
        <div>

            <OverviewLinkComponent
                title="View Leaderboard"
                message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                url={`/leaderboard/${params.guildId}`}
                icon={<HiChartBar />}
            />

            <FollowUpdates />

            <Section
                title="Text to Speech"
            >
                Let users to send messages to a channel and have wamellow read it out loud in voice chat.
            </Section>

            <div className="lg:flex gap-6 mt-5">
                {guild?.tts && guild?.channels?.length &&
                    <div className="lg:w-1/2 space-y-6">
                        <SelectMenu
                            name="Chat to Speech channel"
                            url={`/guilds/${params.guildId}`}
                            dataName="channelId"
                            items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.filter((mp) => mp === "ViewChannel").join(", ") }))}
                            description="Select a channel what channel should be used for tts."
                            defaultState={guild?.tts.channelId}
                            showClear
                        />
                        <SelectMenu
                            name="Usage logs"
                            url={`/guilds/${params.guildId}`}
                            dataName="logChannelId"
                            items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }))}
                            description="Select a channel where usage logs should be posted into."
                            defaultState={guild?.tts.logChannelId}
                            showClear
                        />
                        <SelectMenu
                            name="Priority role"
                            url={`/guilds/${params.guildId}`}
                            dataName="priorityRoleId"
                            items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, color: r.color }))}
                            description="People with this role bypass the queue and speak immediately."
                            defaultState={guild?.tts.priorityRoleId}
                            showClear
                        />
                        <Switch
                            name="Announce user"
                            badge="Experimental"
                            url={`/guilds/${params.guildId}`}
                            dataName="announceUser"
                            description="If I should say who is currently speaking via tts."
                            defaultState={guild?.tts.announceUser || false}
                        />
                        <NumberInput
                            className="pt-7"
                            name="Max message length"
                            description="The maximum length of a message that can be spoken."
                            url={`/guilds/${params.guildId}`}
                            dataName="maxLength"
                            defaultState={guild?.tts.maxLength || 4000}
                            max={4000}
                        />
                    </div>
                }
                <Accordion
                    className="lg:w-1/2"
                    defaultExpandedKeys={["1"]}
                    disableAnimation={cookies.get("reduceMotions") === "true"}
                >
                    <AccordionItem
                        key="1"
                        aria-label="how this works"
                        title="How this works"
                    >
                        Users who are currently in a voice channel can send messages to this tts channel and wamellow will then read the message out loud in vc. Note that wamellow can only be in one voice channel at a time.

                        <iframe
                            className="mt-6 aspect-video rounded-lg"
                            width={"100%"}
                            src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                            title="Wamellow Text to Speech tutorial"
                            allow="autoplay; clipboard-write; ENCRYPTION_TOKENed-media; picture-in-picture; web-share"
                        />
                    </AccordionItem>
                    <AccordionItem
                        key="2"
                        aria-label="how to blacklist users"
                        title="How to blacklist users"
                    >
                        <div>Blacklist a user using discord channel permissions</div>
                        <br />
                        <Link
                            href="https://cdn.waya.one/r/YcU2CC.gif"
                            target="_blank"
                        >
                            <Image
                                alt="blacklist a user with discord channel permissions"
                                className="rounded-md"
                                height={945 / 2}
                                src="https://cdn.waya.one/r/YcU2CC.gif"
                                width={1040 / 2}
                            />
                        </Link>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
    );
}