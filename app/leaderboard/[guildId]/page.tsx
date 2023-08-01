import { Metadata } from "next";
import Image from "next/image";

import ErrorBanner from "@/components/Error";
import { ListTab } from "@/components/List";
import { ApiV1GuildsGetResponse, ApiV1GuildsModulesLeaderboardGetResponse, ApiV1GuildsTopmembersGetResponse } from "@/typings";
import decimalToRgb from "@/utils/decimalToRgb";
import { getCanonicalUrl } from "@/utils/urls";

import PageComponent from "./PageComponent";
import SideComponent from "./SideComponent";

interface LeaderboardProps { params: { guildId: string }, searchParams: { page: string, type: string } }
type Types = "messages" | "voiceminutes" | "invites";

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
        headers: { Authorization: process.env.API_SECRET as string }
        // next: { revalidate: 60 * 60 }
    });

    const design = await res.json();
    return design;
}

async function getTopMembers(guildId: string, options: { page: number, type: string }): Promise<ApiV1GuildsTopmembersGetResponse[]> {
    if (options.type && options.type !== "voiceminutes" && options.type !== "invites") return [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members?type=${options.type || "messages"}&page=${options.page}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    const members = await res.json();
    return members;
}

export const generateMetadata = async ({
    params
}: LeaderboardProps): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);

    const title = `${guild?.name}'s Leaderboard`;
    const description = `Easily access and view the top chatters, voice timers, and inviters from ${guild?.name} in the web.`;
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
        }
    };
};

export default async function Home({ params, searchParams }: LeaderboardProps) {
    const guildPromise = getGuild(params.guildId);
    const membersPromise = getTopMembers(params.guildId, { page: parseInt(searchParams.page || "0"), type: searchParams.type });
    const designPromise = getDesign(params.guildId);

    const [guild, members, design] = await Promise.all([guildPromise, membersPromise, designPromise]).catch(() => []);

    const backgroundRgb = decimalToRgb(design?.backgroundColor || 0);
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

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

                <div style={{ backgroundColor: "var(--background-rgb)" }} className="text-lg flex items-center absolute bottom-[-44px] md:bottom-[-34px] left-[-6px] md:left-10 py-4 px-5 rounded-tr-3xl md:rounded-3xl">
                    <Image src={guild?.icon ? `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.webp?size=64` : "/discord.png"} width={64} height={64} alt="Server" className="rounded-full h-14 w-14 mr-3" />
                    <div>
                        <div className="text-xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                        <div className="text-sm">{intl.format(guild?.memberCount || 0)} members</div>
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

                <div className="md:w-3/4 md:mr-6">
                    {
                        (guild?.id && (!searchParams.type || searchParams.type === "voiceminutes" || searchParams.type === "invites")) ?
                            (members || []).sort((a, b) => (b?.activity?.[searchParams.type as Types] ?? 0) - (a?.activity?.[searchParams.type as Types] ?? 0)).map((member) =>
                                <div
                                    key={member.id}
                                    className={`${design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60" : "dark:bg-wamellow bg-wamellow-100"} mb-4 rounded-md p-3 flex items-center`}
                                >

                                    <Image src={member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.webp?size=56` : "/discord.png"} width={56} height={56} alt="User" className="rounded-full h-12 w-12 mr-3" />
                                    <div>
                                        <div className="text-xl font-medium dark:text-neutral-200 text-neutral-800">{member.globalName || member.username || "Unknown user"}</div>
                                        <div className="text-sm dark:text-neutral-300 text-neutral-700">@{member.username}</div>
                                    </div>

                                    <div className="ml-auto flex text-xl font-medium dark:text-neutral-200 text-neutral-800">
                                        <span>{typeof member.activity?.[searchParams.type as Types || "messages"] === "number" ? intl.format(member.activity?.[searchParams.type as Types || "messages"]) : member.activity?.[searchParams.type as Types || "messages"]}</span>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="0.9em"
                                            viewBox={searchParams.type === "invites" ? "0 0 640 512" : "0 0 448 512"}
                                            className="ml-1 relative"
                                            style={{ top: searchParams.type === "messages" ? 0 : 4 }}
                                            fill="#d4d4d4"
                                        >
                                            {(searchParams.type === "messages" || !searchParams.type) && <path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />}
                                            {searchParams.type === "voiceminutes" && <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z" />}
                                            {searchParams.type === "invites" && <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />}
                                        </svg>

                                    </div>

                                </div>
                            )
                            :
                            <ErrorBanner
                                message={!guild?.id ? "Not Found" : "Invalid leaderboard type"}
                            />
                    }

                    <div className="flex h-10 w-full mt-5">
                        <PageComponent searchParams={searchParams} membersLength={members?.length || 0} />
                    </div>

                </div>

                <div className="md:w-1/4 mt-8 md:mt-0">
                    <SideComponent guildId={params.guildId} design={design} />
                </div>

            </div>

        </div>
    );
}