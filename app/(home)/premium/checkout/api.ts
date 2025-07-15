import type { ApiError } from "next/dist/server/api-utils";

interface CheckoutResponse {
    url: string;
}

export async function createCheckout(session: string, donationQuantity: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/billing/checkout`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`
        },
        body: JSON.stringify({ donationQuantity })
    });

    const res = await response.json() as CheckoutResponse | ApiError;

    if ("message" in res || !res.url) throw new Error("message" in res && res.message ? res.message : "unknown error");
    return res.url;
}