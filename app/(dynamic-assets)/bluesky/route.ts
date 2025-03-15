import { redirect } from "next/navigation";

export const revalidate = 691200; // 8 days

export function GET(request: Request) {
    if (!request.headers.get("user-agent")?.includes("Discordbot/2.0")) {
        redirect("https://www.reddit.com/r/BlueskySocial/comments/1jbjmc4/like_bluesky_posts_inside_of_discord_with_wamellow/");
    }

    redirect("/wamellow-bluesky-like.webp");
}