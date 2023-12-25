import { ApiV1GuildsGetResponse, ApiV1GuildsModulesLeaderboardGetResponse, ApiV1GuildsTopmembersGetResponse, ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";

export async function getGuild(guildId: string): Promise<ApiV1GuildsGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const guild = await res.json();
    return guild;
}

export async function getDesign(guildId: string): Promise<ApiV1GuildsModulesLeaderboardGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/leaderboard`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const design = await res.json();
    return design;
}

export async function getTopMembers(guildId: string, options: { page: number, type: string }): Promise<ApiV1GuildsTopmembersGetResponse[]> {
    if (options.type !== "messages" && options.type !== "voiceminutes" && options.type !== "invites") return [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members?type=${options.type}&page=${options.page - 1}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    const members = await res.json();
    return members;
}

export async function getPagination(guildId: string): Promise<ApiV1GuildsTopmembersPaginationGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members/pagination`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const pagination = await res.json();
    return pagination;
}