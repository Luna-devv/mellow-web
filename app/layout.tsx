
import "./globals.css";

import { Metadata } from "next";

import { getBaseUrl } from "@/utils/urls";

import Header from "../components/Header";

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Wamellow - Next version of discord bots";
    const description = "Wamellow revolutionizes your experience with a plethora of free features and extensive customization options, offering a superior alternative to popular bots like MEE6.";

    return {
        metadataBase: new URL(getBaseUrl()),

        manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
            title: "Wamellow",
            startupImage: "/waya-v3.jpg",
            statusBarStyle: "black-translucent"
        },

        title: {
            default: title,
            template: "%s"
        },

        description: description,
        keywords: ["discord", "bot", "discord bot", "waya", "waya bot", "waya.one", "mwya", "wamellow", "mwlica", "lunish.nl", "Luna-devv", "mee6 alternative", "arcane alternative", "dyno alternative", "starboard", "ranks", "leaderboards", "text to speech", "tts", "free", "customizable"],
        themeColor: "#bc7ed4",

        alternates: {
            canonical: getBaseUrl()
        },

        openGraph: {
            title: {
                default: title,
                template: "%s on Wamellow"
            },
            description: description,
            type: "website",
            url: getBaseUrl(),
            images: `${getBaseUrl()}/waya-v3.jpg`
        },

        twitter: {
            card: "summary",
            site: "wamellow.com",
            title: title,
            description: description,
            images: `${getBaseUrl()}/waya-v3.jpg`
        },

        creator: "Luna (lunish.nl)",
        publisher: "Luna (lunish.nl)",

        robots: "index, follow"
    };
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Header>
            {children}
        </Header>
    );
}