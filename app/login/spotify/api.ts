import type { ApiError } from "@/typings";

export async function connectSpotify(code: string, session: string): Promise<{ success: boolean; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/spotify`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
            authorization: process.env.API_SECRET as string
        },
        body: JSON.stringify({
            code
        })
    });

    return res.json();
}

export async function disconnectSpotify(session: string): Promise<{ success: boolean; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/spotify`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
            authorization: process.env.API_SECRET as string
        }
    });

    return res.json();
}