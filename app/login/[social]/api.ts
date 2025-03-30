import type { ApiError } from "@/typings";

export async function getAuthorizeUrl(social: string, handle?: string): Promise<{ url: string; verifier?: string; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/connections/${social}${handle ? `?handle=${handle}` : ""}`, {
        headers: {
            authorization: process.env.API_SECRET as string
        }
    });

    return res.json();
}

interface ConnectOptions {
    verifier: string;
    issuer: string;
}

export async function connect(social: string, session: string, code: string, options?: Partial<ConnectOptions>): Promise<{ success: boolean; } | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/connections/${social}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
            authorization: process.env.API_SECRET as string
        },
        body: JSON.stringify({
            code,
            ...(options || {})
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