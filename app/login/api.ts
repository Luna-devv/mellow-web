import { User } from "@/common/user";
import { RouteErrorResponse } from "@/typings";

interface UserSessionCreate extends User {
    session: string;
}

export async function createSession(code: string): Promise<UserSessionCreate | RouteErrorResponse | undefined> {

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        authorization: process.env.API_SECRET as string
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ code })
    });

    return res.json();
}