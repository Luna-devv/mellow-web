import { getUser } from "@/lib/discord/user";

export const revalidate = 691200; // 8 days

export async function GET(request: Request) {
    const user = await getUser("821472922140803112");

    request.headers.set("Cache-Control", "public, max-age=691200, immutable");

    return await fetch(user?.avatarUrl
        ? user.avatarUrl + "?size=256"
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    );
}