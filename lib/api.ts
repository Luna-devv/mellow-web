import { ApiError, ApiV1GuildsGetResponse, RouteErrorResponse } from "@/typings";

export const cacheOptions = {
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false
};

export const defaultFetchOptions = { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } };

export async function getData<T>(path: string, domain?: string) {
    const response = await fetch(`${domain || process.env.NEXT_PUBLIC_API}${path}`, {
        credentials: "include"
    });

    return response.json() as Promise<T | RouteErrorResponse>;
}

export async function getGuild(guildId?: string | null): Promise<ApiV1GuildsGetResponse | ApiError | undefined> {
    if (!guildId) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    return res.json();
}