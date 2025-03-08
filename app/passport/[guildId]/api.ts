import type { ApiError } from "@/typings";

export async function getPassport(guildId: string): Promise<{ enabled: boolean; } | ApiError | undefined> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/passport-verification`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    return res.json();
}