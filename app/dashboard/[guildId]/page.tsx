"use client";

import { guildStore } from "@/common/guilds";
import Switch from "@/components/inputs/switch";
import { Section } from "@/components/section";
import { useParams } from "next/navigation";
import { HiChartBar } from "react-icons/hi";

import { BotStyle } from "./style.component";
import { TTSSettings } from "./tts.component";
import FollowUpdates from "./updates.component";
import { OverviewLink } from "../../../components/overview-link";

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

        <BotStyle />

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
            label="Embed message links"
            endpoint={`/guilds/${params.guildId}`}
            k="embedLinks"
            description="Reply with the original content of a message if a message link is sent."
            defaultState={guild?.embedLinks || false}
        />

    </>);
}