import type { ApiError } from "@/typings";

export async function getAuthorizeUrl(social: string): Promise<{ url: string; verifier?: string; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/connections/${social}`, {
        headers: {
            authorization: process.env.API_SECRET as string
        }
    });

    return res.json();
}

export async function connect(social: string, session: string, code: string, verifier?: string): Promise<{ success: boolean; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/${social}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
            authorization: process.env.API_SECRET as string
        },
        body: JSON.stringify({
            code,
            verifier
        })
    });

    return res.json();
}

export async function disconnect(social: string, session: string): Promise<{ success: boolean; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/${social}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
            authorization: process.env.API_SECRET as string
        }
    });

    return res.json();
}