import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { defaultCookieOptions } from "../route";
import { connect, disconnect, getAuthorizeUrl } from "./api";

const SOCIALS = ["spotify", "bluesky"];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ social: string; }>; }
) {
    const { social } = await params;

    if (!SOCIALS.includes(social)) {
        return Response.json({
            status: 400,
            message: "Invalid social"
        });
    }

    const verifier = `login-code-verifier-${social}`;
    const { searchParams } = new URL(request.url);
    const jar = await cookies();

    const logout = searchParams.get("logout");
    const session = jar.get("session");

    if (!session?.value) {
        redirect("/login?callback=" + encodeURIComponent(`/login/${social}${logout === "true" ? "?logout=true" : ""}`));
    }

    if (logout) {
        const res = await disconnect(social, session.value);

        if ("status" in res) {
            const data = { status: 500, message: res?.message || "An error occurred" };
            console.log(data);
            return Response.json(data);
        }

        redirect("/profile/connections");
    }

    const code = searchParams.get("code");

    if (!code) {
        const handle = searchParams.get("handle") || undefined;
        const res = await getAuthorizeUrl(social, handle);

        if ("status" in res) {
            const data = { status: 500, message: res?.message || "An error occurred" };
            console.log(data);
            return Response.json(data);
        }

        if (res.verifier) {
            jar.set(
                verifier,
                res.verifier,
                {
                    ...defaultCookieOptions,
                    expires: new Date(Date.now() + 1000 * 600)
                }
            );
        }

        redirect(res.url);
    }

    const issuer = searchParams.get("iss");

    const res = await connect(social, session.value, code, {
        verifier: jar.get(verifier)?.value,
        issuer: issuer ? decodeURIComponent(issuer) : undefined
    });

    jar.delete(verifier);

    if ("status" in res) {
        const data = { status: 500, message: res?.message || "An error occurred" };
        console.log(data);
        return Response.json(data);
    }

    redirect("/profile/connections?success=true");

}