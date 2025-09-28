import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createCheckout } from "./api";

export async function GET(request: Request) {
    if (request.url.includes("rsc")) return new Response(null, { status: 204 });

    const { searchParams } = new URL(request.url);
    const jar = await cookies();

    const session = jar.get("session");
    if (!session?.value) {
        redirect("/login?callback=" + encodeURIComponent("/" + request.url.split("/").slice(3).join("/")));
    }

    const donationQuantity = Number.parseInt(searchParams.get("donation") || "0", 10);
    const referer = request.headers.get("referer") || "";

    const url = await createCheckout(session.value, donationQuantity, referer)
        .catch((error) => error);

    if (url instanceof Error) {
        console.log(url);
        return new Response(url.message, { status: 400 });
    }

    redirect(url);
}