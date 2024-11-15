"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { HiChartBar, HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { Guild, guildStore } from "@/common/guilds";
import ImageUrlInput from "@/components/inputs/image-url-input";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import { ScreenMessage } from "@/components/screen-message";
import { Section, SubSection } from "@/components/section";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesLeaderboardGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

import { OverviewLink } from "../../../../components/overview-link";
import Permissions from "./permissions.component";
import ResetLeaderboard from "./reset.component";
import UpdatingLeaderboardCard from "./updating.component";
import DiscordWidget from "./widget.component";

export default function Home() {
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

    return (<>
        <div className="flex flex-col-reverse md:flex-row gap-6">
            <div>
                <OverviewLink
                    title="View Leaderboard"
                    message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                    url={`/leaderboard/${params.guildId}`}
                    icon={<HiChartBar />}
                />

                <ImageUrlInput
                    name="Banner"
                    url={url}
                    ratio="aspect-[4/1]"
                    dataName="banner"
                    description="Enter a url which should be the banner of the leaderboard web page. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                    defaultState={data.bannerUrl || ""}
                />
            </div>

            <Permissions
                className="w-full md:w-1/3 lg:w-1/4 shrink-0"
                guild={guild}
            />
        </div>

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
                    items={createSelectableItems(guild?.roles)}
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
                    items={createSelectableItems(guild?.roles)}
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
                items={createSelectableItems(guild?.channels, [])}
                description="Select channels which should not be counted."
                defaultState={data.blacklistChannelIds || []}
                max={500}
            />
        </div>

        <Section
            title="Updating"
        >
            These leaderboards will be sent in a channel and update roughly every 20 minutes.
        </Section>

        <div className="w-full grid gap-4 md:flex md:gap-0 md:items-center my-10">
            <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "messages")} type="messages" />
            <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "voiceminutes")} type="voiceminutes" />
            <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "invites")} type="invites" />
        </div>


        <Section
            title="Privacy"
        >
            Manage the privacy of the leaderboard.
        </Section>

        <DiscordWidget guild={guild as Guild} />

        <SubSection
            title="Removal"
            description="Reset the leaderboard to start fresh. This action cannot be undone"
        >
            <ResetLeaderboard guild={guild as Guild} />
        </SubSection>

    </>);
}