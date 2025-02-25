"use client";

import { ChannelType } from "discord-api-types/v10";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { guildStore } from "@/common/guilds";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import Switch from "@/components/inputs/switch";
import { ScreenMessage } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { type ApiV1GuildsModulesAutomodGetResponse, AutomodType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

const AUTOMOD_TYPES = Object
    .values(AutomodType)
    .filter((type) => typeof type === "string");

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/automod` as const;
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesAutomodGetResponse>(url),
        {
            enabled: !!params.guildId,
            ...cacheOptions
        }
    );

    const enabled = data && !("message" in data) && Object.values(data.status).some(Boolean);

    const edit = useCallback(
        <K extends keyof ApiV1GuildsModulesAutomodGetResponse>(key: K, value: ApiV1GuildsModulesAutomodGetResponse[K]) => {
            if (!data || "message" in data) return;

            queryClient.setQueryData<ApiV1GuildsModulesAutomodGetResponse>(url, () => ({
                ...data,
                [key]: value
            }));
        },
        [data]
    );

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                top="0rem"
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    return (<>
        {AUTOMOD_TYPES.map((type) => (
            <Switch
                key={type}
                name={`Block ${type.replace(/^\w/, (c) => c.toUpperCase())}`}
                description={`Prevent ${type.replace(/s$/, "")} links from being sent.`}
                url={`${url}/${type}`}
                dataName="enabled"
                defaultState={data.status[type] || false}
                onSave={(value) => {
                    data.status[type] = value;
                    edit("status", data.status);
                }}
            />
        ))}

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Whitelist channels"
                    url={url}
                    dataName="whitelistChannelIds"
                    items={createSelectableItems(guild?.channels, [], [ChannelType.GuildCategory, ChannelType.GuildText, ChannelType.GuildAnnouncement])}
                    description="Select channels where messages should not be moderated in."
                    defaultState={data.whitelistChannelIds}
                    max={50}
                    disabled={!enabled}
                />
            </div>
            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Whitelist roles"
                    url={url}
                    dataName="whitelistRoleIds"
                    items={createSelectableItems(guild?.roles)}
                    description="Select roles by who messages should not be moderated for."
                    defaultState={data.whitelistRoleIds}
                    max={20}
                    disabled={!enabled}
                />
            </div>
        </div>
    </>);
}