import { ApiV1GuildsGetResponse, ApiV1GuildsModulesPassportGetResponse } from "@/typings";

export async function getGuild(guildId: string): Promise<ApiV1GuildsGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const guild = await res.json();
    return guild;
}

export async function getPassport(guildId: string): Promise<ApiV1GuildsModulesPassportGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/passport-verification`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    const passport = await res.json();
    return passport;
}