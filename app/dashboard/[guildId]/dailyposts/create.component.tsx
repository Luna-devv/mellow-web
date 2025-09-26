"use client";

import { useMemo, useState } from "react";
import { HiPencil } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { type ApiV1GuildsModulesDailypostsGetResponse, DailypostType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

import { generateHourArray, typeToName } from "./util";

export const Style = {
    Compact: 1,
    Big: 2
} as const;

interface Props {
    style: typeof Style[keyof typeof Style];
    add: (dailypost: ApiV1GuildsModulesDailypostsGetResponse) => void;
    set: (id: string) => void;
}

export function CreateDailypost({
    style,
    add,
    set
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const channels = guildStore((g) => g?.channels);

    const [open, setOpen] = useState(false);
    const [type, setType] = useState<DailypostType>(DailypostType.Anime);
    const [hours, setHours] = useState<number[]>([]);
    const [channelId, setChannelId] = useState<string | null>(null);

    const date = useMemo(() => new Date(), []);
    const hoursArray = useMemo(() => generateHourArray(date), []);

    return (<>
        {style === Style.Compact
            ?
            <Button
                className="rounded-full h-8"
                onClick={() => setOpen(true)}
            >
                <HiPencil />
                Create
            </Button>
            :
            <Button
                variant="secondary"
                onClick={() => setOpen(true)}
            >
                <HiPencil />
                Create a new Dailypost
            </Button>
        }

        <Modal<ApiV1GuildsModulesDailypostsGetResponse>
            className="!overflow-visible"
            title="Create new dailypost"
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/dailyposts`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        channelId,
                        runtimeHours: hours,
                        type,
                        query: type === DailypostType.Anime
                            ? "sfw/waifu"
                            : null
                    })
                });
            }}
            onSuccess={(tag) => {
                add(tag);
                set(tag.id);

                setChannelId(null);
            }}
            isDisabled={!hours.length || !type || !channelId}
        >
            <SelectMenu
                name="Channel"
                dataName="channelId"
                items={createSelectableItems(channels, ["ViewChannel", "SendMessages", "AttachFiles"])}
                description="Select a channel where dailyposts should be send into."
                onSave={(o) => {
                    setChannelId(o.value as string);
                }}
            />

            <MultiSelectMenu
                name="Run at"
                items={hoursArray}
                description="Select one or multiple hours when posts should be made."
                onSave={(o) => {
                    setHours(o.map((i) => i.value as number));
                }}
            />

            <SelectMenu
                name="Type"
                dataName="type"
                items={
                    Object.entries(DailypostType)
                        .filter(([key]) => key.length > 2)
                        .map(([, value]) => ({ name: typeToName(parseInt(value as string)), value }))
                }
                description="Select what type of content should be posted daily."
                onSave={(o) => {
                    setType(o.value as number);
                }}
            />
        </Modal>
    </>);
}