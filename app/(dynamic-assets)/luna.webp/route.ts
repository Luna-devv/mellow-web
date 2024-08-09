import { getUser } from "@/lib/discord/user";

export const revalidate = 691200; // 8 days

export async function GET() {
    const user = await getUser("821472922140803112");

    return await fetch(user?.avatarUrl
        ? user.avatarUrl + "?size=1024"
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    );
}