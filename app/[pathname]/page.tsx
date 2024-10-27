import { notFound, redirect } from "next/navigation";

interface Props {
    params: Promise<{ pathname: string }>
}

const fetchOptions = { next: { revalidate: 60 * 60 } };
const utm = "?utm_source=wamellow.com&utm_medium=redirect";

export default async function Home({ params }: Props) {
    const { pathname } = await params;

    switch (pathname) {
        case "support": return redirect("https://discord.com/invite/DNyyA2HFM9");
        case "vote": return redirect("https://top.gg/bot/1125449347451068437/vote" + utm);
        case "wumpus": return redirect("https://wumpus.store/bot/1125449347451068437" + utm);
        case "invite":
        case "add":
        case "get": return redirect("/login?invite=true");
        case "logout": return redirect("/login?logout=true");
        case "docs":
        case "guides": return redirect("/docs/index");
        case "ai": return redirect("/ai-gallery");
        case "tts": return redirect("https://youtube.com/watch?v=NS5fZ1ltovE");
        case "disable-commands": return redirect("https://youtube.com/watch?v=ehc0_whydu8");
        case "youtube": {
            const res = await fetch("http://100.65.0.1:5001/?channel_id=UClWBeVcz5LUmcCN1gHG_GCg", fetchOptions)
                .then((res) => res.json())
                .catch(() => null) as { videoUrl: string } | null;

            return redirect(res?.videoUrl || "https://www.youtube.com/channel/UClWBeVcz5LUmcCN1gHG_GCg");
        }
    }

    notFound();
}