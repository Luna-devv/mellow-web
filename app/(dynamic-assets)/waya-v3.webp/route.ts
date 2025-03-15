import { getUser } from "@/lib/discord/user";

export const revalidate = 691200; // 8 days

export async function GET() {
    const user = await getUser(process.env.CLIENT_ID as string);

    const avatar = await fetch(user?.avatarUrl
        ? user.avatarUrl + "?size=256"
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    )
        .then((r) => r.arrayBuffer());

    return new Response(
        avatar,
        {
            headers: {
                "Cache-Control": "public, s-maxage=691200, immutable"
            }
        }
    );
}