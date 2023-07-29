
import "./globals.css";

import { Metadata } from "next";

import { getBaseUrl } from "@/utils/urls";

import Header from "../components/Header";

export const metadata: Metadata = {
    metadataBase: new URL(getBaseUrl()),

    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        title: "Wamellow",
        startupImage: "/waya-legacy1.png",
        statusBarStyle: "black-translucent"
    },

    title: {
        default: "Wamellow - Next version of discord bots",
        template: "%s | Wamellow"
    },

    description: "Wamellow revolutionizes your experience with a plethora of free features and extensive customization options, offering a superior alternative to popular bots like MEE6.",
    keywords: ["discord", "waya", "mwya", "wamellow", "waya bot", "discord bot", "bot"],
    themeColor: "#bc7ed4",

    alternates: {
        canonical: getBaseUrl()
    },

    openGraph: {
        title: {
            default: "Wamellow - Next version of discord bots",
            template: "%s on Wamellow"
        },
        description: "Wamellow revolutionizes your experience with a plethora of free features and extensive customization options, offering a superior alternative to popular bots like MEE6.",
        type: "website",
        url: getBaseUrl(),
        images: "https://wamellow.com/waya-legacy1.png"
    },

    twitter: {
        card: "summary",
        site: "wamellow.com",
        title: "Wamellow - Next version of discord bots",
        description: "Wamellow revolutionizes your experience with a plethora of free features and extensive customization options, offering a superior alternative to popular bots like MEE6."
    },

    creator: "Luna (lunish.nl)",
    publisher: "Luna (lunish.nl)",

    robots: "index, follow"
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