"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import { HiChartBar, HiMail } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import Modal from "@/components/modal";
import Section from "@/components/section";

import OverviewLinkComponent from "../../../components/OverviewLinkComponent";

export default function Home() {
    const cookies = useCookies();
    const guild = guildStore((g) => g);

    const [modal, setModal] = useState(false);
    const [followchannel, setFollowchannel] = useState<string>();

    const params = useParams();

    return (
        <div>

            <OverviewLinkComponent
                title="View Leaderboard"
                message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                url={`/leaderboard/${params.guildId}`}
                icon={<HiChartBar />}
            />

            <div>
                <div className="text-sm mb-0.5">Posting updates {guild?.follownewsChannel?.name && "into"}</div>
                {guild?.follownewsChannel?.name && <div className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">#{guild?.follownewsChannel?.name}</div>}
                <button onClick={() => setModal(true)} className="flex dark:text-violet-400/60 dark:hover:text-violet-400/90 text-violet-600/60 hover:text-violet-600/90 duration-200">
                    <HiMail className="relative top-1" />
                    <span className="ml-2">{guild?.follownewsChannel?.name ? "Change" : "Set"} channel</span>
                </button>
            </div>

            <Modal
                title="Wamellow updates"
                show={modal && !!guild}
                onClose={() => setModal(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/follow-updates`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            channelId: followchannel
                        })
                    });
                }}
                onSuccess={() => {
                    guildStore.setState((g) => {
                        if (!g) return g;

                        g.follownewsChannel = {
                            name: g?.channels?.find((c) => c.id === followchannel)?.name,
                            id: followchannel
                        };

                        return g;
                    });
                }}
            >
                <SelectMenu
                    name="Channel"
                    dataName="channelId"
                    items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id }; })}
                    description="Select a channel where updates should be send into."
                    defaultState={guild?.follownewsChannel?.id}
                    onSave={(o) => {
                        setFollowchannel(o.value as string);
                    }}
                />
            </Modal>

            <Section
                title="Text to Speech"
            >
                Let users to send messages to a channel and have the bot read it out loud in voice chat.
            </Section>

            <div className="lg:flex gap-6 mt-5">
                {guild?.tts && guild?.channels?.length &&
                    <div className="lg:w-1/2 space-y-8">
                        <SelectMenu
                            name="Chat to Speech channel"
                            url={`/guilds/${params.guildId}`}
                            dataName="channelId"
                            items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id }))}
                            description="Select a channel what channel should be used for tts."
                            defaultState={guild?.tts.channelId}
                            showClear
                        />
                        <SelectMenu
                            name="Usage logs"
                            url={`/guilds/${params.guildId}`}
                            dataName="logChannelId"
                            items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id }))}
                            description="Select a channel where usage logs should be psoted into."
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
                            url={`/guilds/${params.guildId}`}
                            dataName="announceUser"
                            description="If I should say who is currently speaking via tts."
                            defaultState={guild?.tts.announceUser || false}
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
                        Users who are currently in a voice channel can send messages to this tts channel and the bot will then read the message out loud in vc. Note that the bot can only be in one voice channel at a time.

                        <iframe
                            className="mt-6 aspect-video rounded-lg"
                            width={"100%"}
                            src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                            title="Wamellow Text to Speech tutorial"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
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