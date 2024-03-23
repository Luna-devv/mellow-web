import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSession, deleteSession } from "./api";

const defaultCookieOptions = {
    secure: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://"),
    httpOnly: true,
    sameSite: "none",
    domain: process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4)
} as const;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cookieStore = cookies();

    const logout = searchParams.get("logout");
    const session = cookieStore.get("session");

    if (logout) {

        if (!session?.value) {
            redirect("/");
        }

        const res = await deleteSession(session.value);

        if (
            (res !== true || typeof res !== "boolean" && "statusCode" in res) &&
            res?.statusCode !== 401
        ) {
            const data = { statusCode: 500, message: res?.message || "An error occurred" };
            console.log(data);
            return Response.json(data);
        }

        // delete didn't work somehow lol
        cookieStore.set(
            "session",
            "undefined",
            defaultCookieOptions
        );

        cookieStore.set(
            "hasSession",
            "false",
            {
                ...defaultCookieOptions,
                httpOnly: false
            }
        );

        redirect("/");
    }

    const invite = searchParams.get("invite");
    const code = searchParams.get("code");

    if (!code) {
        redirect(`${process.env.NEXT_PUBLIC_LOGIN}${invite ? "+bot" : ""}`);
    }

    const lastpage = cookieStore.get("lastpage");

    const res = await createSession(code, session?.value);

    if (!res || "statusCode" in res) {
        const data = { statusCode: 500, message: res?.message || "An error occurred" };
        console.log(data);
        return Response.json(data);
    }

    cookieStore.set(
        "session",
        res.session,
        defaultCookieOptions
    );

    cookieStore.set(
        "hasSession",
        "true",
        {
            ...defaultCookieOptions,
            httpOnly: false
        }
    );

    redirect(lastpage?.value || "/");

}