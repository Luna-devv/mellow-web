import { getBaseUrl } from "@/utils/urls";

const domain = getBaseUrl().split("://")[1];

export const defaultCookieOptions = {
    secure: getBaseUrl().startsWith("https://"),
    httpOnly: false,
    sameSite: "lax",
    domain: "." + (domain.startsWith("dev.") ? domain.replace(/^dev\./, "") : domain),
    get expires() {
        return new Date(Date.now() + 1_000 * 60 * 60 * 24 * 28);
    }
} as const;