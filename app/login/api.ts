import { User } from "@/common/user";
import { RouteErrorResponse } from "@/typings";

interface UserSessionCreate extends User {
    session: string;
}

export async function createSession(code: string, session?: string): Promise<UserSessionCreate | RouteErrorResponse | undefined> {

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        authorization: process.env.API_SECRET as string
    };

    if (session) headers.Cookie = `session=${session}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            code
        })
    });

    return res.json();
}

export async function deleteSession(session: string): Promise<true | RouteErrorResponse | undefined> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        method: "DELETE",
        headers: {
            "Cookie": `session=${session}`,
            authorization: process.env.API_SECRET as string
        }
    });

    return res.json();
}