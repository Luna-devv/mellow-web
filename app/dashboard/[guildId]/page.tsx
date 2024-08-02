"use client";

import { useParams } from "next/navigation";
import { HiChartBar } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import Switch from "@/components/inputs/switch";
import { Section } from "@/components/section";

import { OverviewLink } from "../../../components/overview-link";
import FollowUpdates from "../updates.component";
import { TTSSettings } from "./tts.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    return (<>
        <OverviewLink
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

        <TTSSettings />

        <Section
            title="Miscs"
        >
            Small tools that improve chatting to insanity.
        </Section>

        <Switch
            name="Embed message links"
            badge="Experimental"
            url={`/guilds/${params.guildId}`}
            dataName="tts.embedLinks"
            description="Reply with the original content of a message if a message link is sent."
            defaultState={guild?.embedLinks || false}
        />

    </>);
}