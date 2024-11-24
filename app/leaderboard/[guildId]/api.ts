import { type ApiRequestOptions, defaultFetchOptions } from "@/lib/api";
import type { ApiError,
    ApiV1GuildsModulesLeaderboardGetResponse,
    ApiV1GuildsTopmembersGetResponse,
    ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";

export async function getDesign(guildId: string): Promise<ApiV1GuildsModulesLeaderboardGetResponse | ApiError | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/leaderboard`,
        defaultFetchOptions
    );

    return res.json();
}

export async function getTopMembers(guildId: string, params: { page: number; type: string; }, options?: ApiRequestOptions): Promise<ApiV1GuildsTopmembersGetResponse[] | ApiError | undefined> {
    if (params.type !== "messages" && params.type !== "voiceminutes" && params.type !== "invites") return [];

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members?type=${params.type}&page=${params.page - 1}`,
        {
            ...defaultFetchOptions,
            next: options?.force
                ? { revalidate: 0 }
                : { revalidate: 60 }
        }
    );

    return res.json();
}

export async function getPagination(guildId: string): Promise<ApiV1GuildsTopmembersPaginationGetResponse | ApiError | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/top-members/pagination`,
        defaultFetchOptions
    );

    return res.json();
}