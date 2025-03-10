import type { User } from "@/common/user";
import type { ApiError } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

interface UserSessionCreate extends User {
    session: string;
}

export async function createSession(code: string): Promise<UserSessionCreate | ApiError | undefined> {

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        authorization: process.env.API_SECRET as string
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            code,
            redirectUri: getCanonicalUrl("login")
        })
    });

    return res.json();
}