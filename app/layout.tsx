
import "./globals.css";

import { Metadata } from "next";

import { getBaseUrl } from "@/utils/urls";

import Header from "../components/Header";

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Wamellow: Next-gen of discord bots";
    const description = "Experience the next-gen revolution with Wamellow, offering a list of features and extensive customization, providing a superior alternative to popular bots.";

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
        keywords: ["discord", "bot", "discord bot", "waya", "waya bot", "waya.one", "mwya", "wamellow", "mwlica", "lunish.nl", "Luna-devv", "mee6 alternative", "arcane alternative", "dyno alternative", "starboard", "ranks", "leaderboards", "text to speech", "tts", "free", "customizable", "next-gen", "next generation"],
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