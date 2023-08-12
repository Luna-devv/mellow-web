"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiChartBar, HiMail } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import SelectMenu from "@/components/inputs/SelectMenu";
import Modal from "@/components/Modal";

import OverviewLinkComponent from "../../../components/OverviewLinkComponent";

export default function Home() {
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

                {/* <button onClick={() => setModal(true)} className="ml-auto flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 h-fit">
                    <HiMail className="relative top-1" />
                    <span className="ml-2">Change updates channel</span>
                </button> */}

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
                    __defaultState={guild?.follownewsChannel?.id}
                    onSave={(o) => {
                        setFollowchannel(o.value as string);
                    }}
                />
            </Modal>

            <hr className="mt-6 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

            <div>Hey {user?.username}, thanks for testing out the early version of this bot :)</div>
            <div>There will be more exciting stuff coming soon&trade;</div>

            <div className="flex mt-2">
                <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 ">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Join our server for updates</span>
                </Link>
            </div>

        </div>
    );
}