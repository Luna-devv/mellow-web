import { notFound, redirect } from "next/navigation";

interface Props {
    params: { pathname: string }
}

export default function Home({ params }: Props) {

    switch (params.pathname) {
        case "support":
            return redirect("https://discord.com/invite/DNyyA2HFM9");
        case "vote":
            return redirect("https://top.gg/bot/1125449347451068437/vote");
    }

    notFound();
}