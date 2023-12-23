import { CircularProgress } from "@nextui-org/react";
import { Metadata } from "next";
import Image from "next/image";
import { HiHome, HiUsers } from "react-icons/hi";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { ScreenMessage } from "@/components/screen-message";
import { ApiV1GuildsGetResponse, ApiV1GuildsModulesLeaderboardGetResponse, ApiV1GuildsTopmembersGetResponse } from "@/typings";
import cn from "@/utils/cn";
import decimalToRgb from "@/utils/decimalToRgb";
import { getCanonicalUrl } from "@/utils/urls";

import Pagination from "./pagination.component";
import SideComponent from "./side.component";

interface LeaderboardProps { params: { guildId: string }, searchParams: { page: string, type: "messages" | "voiceminutes" | "invites" } }

export const revalidate = 60 * 60;

async function getGuild(guildId: string): Promise<ApiV1GuildsGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const guild = await res.json();
    return guild;
}

async function getDesign(guildId: string): Promise<ApiV1GuildsModulesLeaderboardGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/leaderboard`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const design = await res.json();
    return design;
}

async function getTopMembers(guildId: string, options: { page: number, type: string }): Promise<ApiV1GuildsTopmembersGetResponse[]> {
    if (options.type && options.type !== "voiceminutes" && options.type !== "invites") return [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members?type=${options.type || "messages"}&page=${options.page - 1}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    const members = await res.json();
    return members;
}

async function getPagination(guildId: string, options: { type: string }): Promise<{ pages: number; members: number }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members/pagination?type=${options.type || "messages"}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const pagination = await res.json();
    return pagination;
}

export const generateMetadata = async ({
    params
}: LeaderboardProps): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);

    const title = `${guild?.name || "Unknown"}'s Leaderboard`;
    const description = `Effortlessly discover the most active chatters, voice timers, and acknowledge top inviters. Explore the vibrant community dynamics of the ${guild?.name || "unknown"} discord server right from your web browser.`;
    const url = getCanonicalUrl("leaderboard", params.guildId);

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: guild?.icon ? `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.webp?size=256` : "/discord.png"
        },
        twitter: {
            card: "summary",
            title,
            description
        },
        robots: guild.name ? "index, follow" : "noindex"
    };
};

export default async function Home({ params, searchParams }: LeaderboardProps) {
    const guildPromise = getGuild(params.guildId);
    const membersPromise = getTopMembers(params.guildId, { page: parseInt(searchParams.page || "1"), type: searchParams.type });
    const designPromise = getDesign(params.guildId);
    const paginationPromise = getPagination(params.guildId, { type: searchParams.type });

    const [guild, members, design, pagination] = await Promise.all([guildPromise, membersPromise, designPromise, paginationPromise]).catch(() => []);

    const backgroundRgb = decimalToRgb(design?.backgroundColor || 0);
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    const candisplay = guild?.id && Array.isArray(members) && (!searchParams.type || searchParams.type === "voiceminutes" || searchParams.type === "invites");

    return (
        <div className="w-full">

            {design?.backgroundColor &&
                <style>
                    {`
                        :root {
                            --background-rgb: rgb(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b});
                        }
                    `}
                </style>
            }

            <div className="relative mb-12 w-full">
                <div className="h-32 md:h-64 overflow-hidden rounded-xl" style={{ background: `url(${design?.banner})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    {!design?.banner &&
                        <Image src="/paint.jpg" width={3840 / 2} height={2160 / 2} alt="" />
                    }
                </div>

                <div style={{ backgroundColor: "var(--background-rgb)" }} className="text-lg flex gap-5 items-center absolute bottom-[-44px] md:bottom-[-34px] left-[-6px] md:left-10 py-4 px-5 rounded-tr-3xl md:rounded-3xl">
                    <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`} size={128} alt="Server icon" className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40" />
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                        <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
                    </div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Messages",
                        value: ""
                    },
                    {
                        name: "Voicetime",
                        value: "voiceminutes"
                    },
                    {
                        name: "Invites",
                        value: "invites"
                    }
                ]}
                url={`/leaderboard/${params.guildId}`}
                searchParamName="type"
                disabled={!guild}
            />

            <div className="md:flex">

                <div itemScope itemType="https://schema.org/ItemList" className="md:w-3/4 md:mr-6">

                    <h2 itemProp="name" className="display-hidden sr-only">Top 10 users in {guild?.name}</h2>
                    <link itemProp="itemListOrder" href="https://schema.org/ItemListOrderDescending" />

                    {candisplay ?
                        members.sort((a, b) => (b?.activity?.[searchParams.type] ?? 0) - (a?.activity?.[searchParams.type] ?? 0)).map((member, i) =>
                            <div
                                key={"leaderboard-" + searchParams.type + member.id + i}
                                className={cn("mb-4 rounded-md p-3 flex items-center", design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60" : "dark:bg-wamellow bg-wamellow-100")}
                            >
                                <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}`} size={128} alt={`${member.username}'s profile picture`} className="rounded-full h-12 w-12 mr-3" />
                                <div>
                                    <div className="text-xl font-medium dark:text-neutral-200 text-neutral-800">{member.globalName || member.username || "Unknown user"}</div>
                                    <div className="text-sm dark:text-neutral-300 text-neutral-700">@{member.username}</div>
                                </div>

                                <div className="ml-auto flex text-xl font-medium dark:text-neutral-200 text-neutral-800">
                                    <span>{searchParams.type === "voiceminutes" ? member.activity?.formattedVoicetime : intl.format(member.activity?.[searchParams.type || "messages"])}</span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="0.9em"
                                        viewBox={searchParams.type === "invites" ? "0 0 640 512" : "0 0 448 512"}
                                        className={cn("ml-1 relative", searchParams.type === "voiceminutes" && "ml-2")}
                                        style={{ top: searchParams.type === "messages" ? 0 : 4 }}
                                        fill="#d4d4d4"
                                    >
                                        {(searchParams.type === "messages" || !searchParams.type) && <path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />}
                                        {searchParams.type === "voiceminutes" && <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z" />}
                                        {searchParams.type === "invites" && <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />}
                                    </svg>

                                </div>

                                <CircularProgress
                                    className="ml-4"
                                    aria-label="progress"
                                    size="lg"
                                    color="secondary"
                                    classNames={{
                                        svg: "drop-shadow-md"
                                    }}
                                    value={(member.activity[searchParams.type || "messages"] * 100) / members[i - 1]?.activity[searchParams.type || "messages"] || 100}
                                    showValueLabel={true}
                                />

                            </div>
                        )
                        :
                        <ScreenMessage
                            title="Nothing to see here.."
                            description="Seems like you got a little lost, huh?"
                            href="/"
                            button="Go back home"
                            top="0rem"
                            icon={<HiHome />}
                        />
                    }

                    {guild?.id && <Pagination key={searchParams.type} guildId={params.guildId} searchParams={searchParams} data={pagination} />}
                </div>

                <div className="md:w-1/4 mt-8 md:mt-0">
                    <SideComponent guildId={params.guildId} design={design} />
                </div>

            </div>

        </div>
    );
}