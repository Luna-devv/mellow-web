"use client";

import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiChartBar, HiMail } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import Badge from "@/components/badge";
import SelectMenu from "@/components/inputs/SelectMenu";
import Modal from "@/components/modal";

import OverviewLinkComponent from "../../../components/OverviewLinkComponent";

export default function Home() {
    const web = webStore((w) => w);
    const user = userStore((s) => s);
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

            <div className="flex items-center">

                <div>
                    <div className="text-sm mb-0.5">Posting updates {guild?.follownewsChannel?.name && "into"}</div>
                    {guild?.follownewsChannel?.name && <div className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">#{guild?.follownewsChannel?.name}</div>}
                    <button onClick={() => setModal(true)} className="flex dark:text-violet-400/60 dark:hover:text-violet-400/90 text-violet-600/60 hover:text-violet-600/90 duration-200">
                        <HiMail className="relative top-1" />
                        <span className="ml-2">{guild?.follownewsChannel?.name ? "Change" : "Set"} channel</span>
                    </button>
                </div>

            </div>

            <Modal
                title="Wamellow updates"
                show={modal && !!guild}
                onClose={() => setModal(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/follow-updates`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("token") as string
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

            <hr className="mt-6 mb-2 dark:border-wamellow-light border-wamellow-100-light" />
            <span className="dark:text-neutral-500 text-neutral-400 text-sm flex">
                This option will assign a channel to be the text input method for in-voicechat text to speech.
                <Badge text="Beta" />
            </span>

            <div className="lg:flex gap-6 mt-5">
                <div className="lg:w-1/2">
                    <SelectMenu
                        name="Text to Speech channel"
                        url={`/guilds/${params.guildId}`}
                        dataName="ttsChannelId"
                        items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id }; })}
                        description="Select a channel what channel should be used for tts."
                        defaultState={guild?.ttsChannelId}
                        showClear
                    />
                </div>
                <Accordion
                    className="lg:w-1/2"
                    defaultExpandedKeys={["1"]}
                    disableAnimation={web.reduceMotions}
                >
                    <AccordionItem
                        key="1"
                        aria-label="how this works"
                        title="How this works"
                    >
                        Users who are currently in a voice channel can send messages to this tts channel and the bot will then read the message out loud in vc. Note that the bot can only be in one voice channel at a time.
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

            <hr className="mt-6 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

            <div>Hey {user?.username}, thanks for testing out the early version of this bot :)</div>
            <div>There will be more exciting stuff coming soon&trade;</div>

            <div className="flex mt-2">
                <Button
                    as={Link}
                    href="/support"
                    startContent={<BsDiscord />}
                >
                    Join our server for updates
                </Button>
            </div>

        </div>
    );
}