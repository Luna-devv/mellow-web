import { defaultFetchOptions } from "@/lib/api";
import {
    ApiV1GuildsModulesLeaderboardGetResponse,
    ApiV1GuildsTopmembersGetResponse,
    ApiV1GuildsTopmembersPaginationGetResponse,
    RouteErrorResponse
} from "@/typings";

export async function getDesign(guildId: string): Promise<ApiV1GuildsModulesLeaderboardGetResponse | RouteErrorResponse | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/leaderboard`,
        defaultFetchOptions
    );

    return res.json();
}

export async function getTopMembers(guildId: string, options: { page: number, type: string }): Promise<ApiV1GuildsTopmembersGetResponse[] | RouteErrorResponse | undefined> {
    if (options.type !== "messages" && options.type !== "voiceminutes" && options.type !== "invites") return [];

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members?type=${options.type}&page=${options.page - 1}`,
        {
            ...defaultFetchOptions,
            next: { revalidate: 60 }
        }
    );

    return res.json();
}

export async function getPagination(guildId: string): Promise<ApiV1GuildsTopmembersPaginationGetResponse | RouteErrorResponse | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members/pagination`,
        defaultFetchOptions
    );

    return res.json();
}