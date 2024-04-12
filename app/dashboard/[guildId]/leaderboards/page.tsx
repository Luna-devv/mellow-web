"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { HiChartBar, HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { Guild, guildStore } from "@/common/guilds";
import ImageUrlInput from "@/components/inputs/image-url-input";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import TextInput from "@/components/inputs/text-input";
import { ScreenMessage } from "@/components/screen-message";
import Section from "@/components/section";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesLeaderboardGetResponse } from "@/typings";

import OverviewLinkComponent from "../../../../components/OverviewLinkComponent";
import ResetLeaderboard from "./reset.component";
import UpdatingLeaderboardCard from "./updating.component";

export default function Home() {
    const cookies = useCookies();

    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/leaderboard` as const;

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesLeaderboardGetResponse>(url),
        {
            enabled: !!params.guildId,
            ...cacheOptions,
            refetchOnMount: true
        }
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

    return (
        <div>

            <OverviewLinkComponent
                title="View Leaderboard"
                message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                url={`/leaderboard/${params.guildId}`}
                icon={<HiChartBar />}
            />

            {cookies.get("devTools") &&
                <div className={"flex gap-4 border-2 border-violet-400 p-4 mb-4 rounded-lg"}>

                    <div className="lg:w-1/2 flex gap-2 w-full">

                        <div className="w-1/2">
                            <TextInput
                                name="Text"
                                url={url}
                                dataName="textColor"
                                description="Color used for text."
                                type="color"
                                defaultState={data.textColor ?? 0xe5e5e5}
                                resetState={0xe5e5e5}
                            />
                        </div>

                        <div className="w-1/2">
                            <TextInput
                                name="Accent"
                                url={url}
                                dataName="accentColor"
                                description="Color used for secondary text."
                                type="color"
                                defaultState={data.accentColor ?? 0x8b5cf6}
                                resetState={0x8b5cf6}
                            />
                        </div>

                    </div>

                    <div className="w-1/2">
                        <TextInput
                            name="Background"
                            url={url}
                            dataName="backgroundColor"
                            description="Color used for the background."
                            type="color"
                            defaultState={data.backgroundColor ?? 0x0d0f11}
                            resetState={0x0d0f11}
                        />
                    </div>

                </div>
            }

            <ImageUrlInput
                name="Banner"
                url={url}
                ratio="aspect-[4/1]"
                dataName="banner"
                description="Enter a url which should be the banner of the leaderboard web page. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                defaultState={data.banner || ""}
            />

            <Section
                title="Roles"
            >
                Select roles which should be assigned to the top members. (left to right - 1st to 3rd place)
            </Section>

            <div className="lg:flex gap-3 mt-5">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Top messager roles"
                        url={url}
                        dataName="roles.messages"
                        items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }))}
                        description="Select roles which should be assigned to the top message members."
                        defaultState={data.roles?.messages || []}
                        max={3}
                    />
                </div>
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Top voice roles"
                        url={url}
                        dataName="roles.voiceminutes"
                        items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }))}
                        description="Select roles which should be assigned to the top voice members."
                        defaultState={data.roles?.voiceminutes || []}
                        max={3}
                    />
                </div>
            </div>

            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Blacklisted channels"
                    url={url}
                    dataName="blacklistChannelIds"
                    items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id }))}
                    description="Select channels which should not be able to be counted."
                    defaultState={data.blacklistChannelIds || []}
                    max={500}
                />
            </div>

            <Section
                title="Updating leaderboards"
            >
                These leaderboards will be sent in a channel and update roughly every 20 minutes.
            </Section>

            <div className="w-full grid gap-4 md:flex md:gap-0 md:items-center my-10">
                <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "messages")} type="messages" />
                <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "voiceminutes")} type="voiceminutes" />
                <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "invites")} type="invites" />
            </div>


            <Section
                title="Danger zone"
            >
                Reset the leaderboard to start fresh. This action cannot be undone.
            </Section>

            <ResetLeaderboard guild={guild as Guild} />

        </div >
    );
}