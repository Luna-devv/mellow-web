"use client";

import { Code } from "@nextui-org/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { guildStore } from "@/common/guilds";
import MultiSelectMenu from "@/components/inputs/MultiSelectMenu";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import Notice, { NoticeType } from "@/components/notice";
import { ScreenMessage } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesNsfwModerationGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/nsfw-image-scanning` as const;

    const [data, setData] = useState<ApiV1GuildsModulesNsfwModerationGetResponse | RouteErrorResponse>();

    const { isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesNsfwModerationGetResponse>(url),
        {
            enabled: !!params.guildId,
            onSuccess: (d) => setData(d),
            ...cacheOptions,
            refetchOnMount: true
        }
    );

    const handleSwitchToggle = (enabled: boolean) => {
        if (!data) return;
        const updatedLocalData = { ...data, enabled };
        setData(updatedLocalData);
    };

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

    return (
        <>

            <Notice
                type={NoticeType.Info}
                message="Images could be false positives of false negatives, this will not replace human moderation."
            />

            <Switch
                name="NSFW image moderation enabled."
                url={url}
                dataName="enabled"
                defaultState={data.enabled || false}
                disabled={false}
                onSave={handleSwitchToggle}
            />

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <SelectMenu
                        name="Logging channel"
                        url={url}
                        dataName="logChannelId"
                        items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                        description="Select the channel where the logs should be send into."
                        defaultState={data.logChannelId}
                        disabled={!data.enabled}
                    />
                </div>
                <div className="lg:w-1/2">
                    <SelectMenu
                        name="Punishment"
                        url={url}
                        dataName="punishment"
                        items={[
                            {
                                name: "Nothing",
                                value: 0
                            },
                            {
                                name: "Ban member",
                                value: 1
                            },
                            {
                                name: "Kick member",
                                value: 2
                            },
                            {
                                name: "Delete message",
                                value: 3
                            }
                        ]}
                        description="Select what should happen if a user sets images containing nsfw."
                        defaultState={data.punishment}
                        disabled={!data.enabled}
                    />
                </div>
            </div>



            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Whitelist channels"
                        url={url}
                        dataName="logChannelId"
                        items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }))}
                        description="Select channels where images should not be scanned in."
                        defaultState={data.whitelistChannelIds}
                        disabled={!data.enabled}
                    />
                </div>
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Whitelist roles"
                        url={url}
                        dataName="logChannelId"
                        items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, color: r.color }))}
                        description="Select roles by who images should not be scanned for."
                        defaultState={data.whitelistRoleIds}
                        disabled={!data.enabled}
                    />
                </div>
            </div>

            <span className="mb-2" >
                Members with the <Code color="secondary">Manage Messages</Code> permission bypass the NSFW image scanning automatically. <br />
            </span>

        </>
    );
}