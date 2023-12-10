"use client";

import { HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { ScreenMessage } from "@/components/screen-message";

export default function NotFound() {
    const guild = guildStore((g) => g);

    return (
        <ScreenMessage
            title="Nothing to see here.."
            description="Seems like you got a little lost, huh?"
            href={`/dashboard/${guild?.id}`}
            button="Go back to overview"
            icon={<HiViewGridAdd />}
        />
    );
}