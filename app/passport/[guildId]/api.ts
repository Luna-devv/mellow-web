import { ApiError, ApiV1GuildsModulesPassportGetResponse } from "@/typings";

export async function getPassport(guildId: string): Promise<ApiV1GuildsModulesPassportGetResponse | true | ApiError | undefined> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/passport-verification`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    const passport = await res.json();
    return passport;
}