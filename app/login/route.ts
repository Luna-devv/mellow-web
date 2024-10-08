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

        cookieStore.set(
            "session",
            "",
            {
                expires: new Date(0),
                domain: process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1]
            }
        );

        cookieStore.set(
            "hasSession",
            "",
            {
                expires: new Date(0),
                domain: process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1]
            }
        );

        redirect("/");
    }

    const invite = searchParams.get("invite");
    const code = searchParams.get("code");

    if (!code) {
        const callback = searchParams.get("callback");
        const lastpage = cookieStore.get("lastpage");

        redirect(`${process.env.NEXT_PUBLIC_LOGIN}${invite ? "+bot" : ""}&state=${encodeURIComponent(callback || lastpage?.value || "/")}`);
    }

    const res = await createSession(code, session?.value);
    let redirectUrl = getRedirectUrl(searchParams);

    if (!res || "statusCode" in res) {
        const data = { statusCode: 500, message: res?.message || "An error occurred" };
        console.log(data);

        redirectUrl += "?error=" + JSON.stringify(data);
        redirect(redirectUrl);
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

    redirect(redirectUrl);
}

function getRedirectUrl(searchParams: URLSearchParams) {
    const guildId = searchParams.get("guild_id");
    if (guildId) return `/dashboard/${guildId}`;

    const redirectUrl = decodeURIComponent(searchParams.get("state") || "/");
    if (redirectUrl.includes("://")) return "/";

    return redirectUrl;
}