import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { connectSpotify, disconnectSpotify } from "./api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const jar = await cookies();

    const logout = searchParams.get("logout");
    const session = jar.get("session");

    if (!session?.value) {
        redirect("/login?callback=" + encodeURIComponent(`/login/spotify${logout === "true" ? "?logout=true" : ""}`));
    }

    if (logout) {

        const res = await disconnectSpotify(session.value);

        if (
            (res !== true || typeof res !== "boolean" && "statusCode" in res) &&
            res?.statusCode !== 401
        ) {
            const data = { statusCode: 500, message: res?.message || "An error occurred" };
            console.log(data);
            return Response.json(data);
        }

        redirect("/?spotify_login_success=true");
    }

    const code = searchParams.get("code");

    if (!code) {
        redirect(`${process.env.NEXT_PUBLIC_API}/connections/spotify`);
    }

    const res = await connectSpotify(code, session.value);

    if (
        (res !== true || typeof res !== "boolean" && "statusCode" in res) &&
        res?.statusCode !== 401
    ) {
        const data = { statusCode: 500, message: res?.message || "An error occurred" };
        console.log(data);
        return Response.json(data);
    }

    redirect("/?spotify_login_success=true");

}