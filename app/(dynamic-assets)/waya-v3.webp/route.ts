import { getUser } from "@/lib/discord/user";

export const revalidate = 691200; // 8 days

export async function GET() {
    const user = await getUser(process.env.CLIENT_ID as string);

    return await fetch(user?.avatarUrl
        ? user.avatarUrl + "?size=1024"
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    );
}