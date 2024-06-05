import "./globals.css";

import { Divider } from "@nextui-org/react";
import { Metadata, Viewport } from "next";
import { Montserrat, Outfit } from "next/font/google";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CookiesProvider } from "next-client-cookies/server";
import { SiKofi } from "react-icons/si";

import Header from "@/components/header";
import TopggIcon from "@/components/icons/topgg";
import LoginButton from "@/components/login-button";
import cn from "@/utils/cn";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";
import { StoreLastPage } from "./store-lastpage";

const outfit = Outfit({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#8957ff",
    initialScale: 0.85
};

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Wamellow: Next-gen of Discord Bots & Apps";
    const description = "Engage with leaderboards, starboards, and welcoming atmosphere. Dive into anime discussions, enjoy free /image AI and unleash the power of Text-To-Speech.";

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

        description,
        keywords: [
            "discord", "bot", "app", "intefration", "discord bot", "discord app", "discord application", "app list", "waya", "waya bot", "waya.one", "mwya", "mellow", "wamellow", "mwlica", "lunish", "Luna-devv", "mee6 alternative",
            "arcane alternative", "dyno alternative", "starboard", "ranks", "leaderboard", "lb", "leaderboards", "text to speech", "captcha", "passport", "verification", "verify",
            "captcha.bot", "security", "tts", "text to speech", "free", "customizable", "next-gen", "next generation", "ai", "ai images", "nsfw detection", "moderation", "anime",
            "nekos", "waifus", "chat to speech", "accessibility", "aphonia", "dysphonia", "mute", "liapew", "wumpus", "wumpus store", "wumpus bots", "youtube notifications", "youtube notifis", "youtube to discord"
        ],

        alternates: {
            canonical: getBaseUrl()
        },

        openGraph: {
            title: {
                default: title,
                template: "%s on Wamellow"
            },
            description,
            type: "website",
            url: getBaseUrl(),
            images: `${getBaseUrl()}/waya-v3.jpg?v=2`
        },

        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.jpg?v=2`
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
    const cookieStore = cookies();

    return (
        <CookiesProvider>
            <html
                suppressHydrationWarning
                data-theme="dark"
                lang="en"
                className="dark flex justify-center min-h-screen max-w-screen overflow-x-hidden"
            >

                <Script defer data-domain="wamellow.com" src="https://analytics.wamellow.com/js/script.js" />

                <body
                    className={cn("w-full max-w-7xl !overflow-visible", outfit.className)}
                    style={{ overflow: "visible" }}
                >
                    <div id="bg" className="absolute top-0 right-0 w-screen h-screen -z-10" />

                    <nav className="p-4 flex items-center gap-2 text-base font-medium dark:text-neutral-300 text-neutral-700 select-none h-20">
                        <Link
                            aria-label="Go to Wamellow's homepage"
                            className={cn("font-semibold flex items-center mr-2", montserrat.className)}
                            href="/?utm_source=wamellow.com&utm_medium=header"
                        >
                            <Image src="/waya-v3-small.webp" width={64} height={64} alt="" className="rounded-full mr-2 w-8 h-8 shrink-0" />
                            <span className="text-xl dark:text-neutral-100 text-neutral-900 hidden sm:block">Wamellow</span>
                        </Link>

                        <Divider
                            className="h-10 rotate-6 mx-1"
                            orientation="vertical"
                        />

                        <div className="flex gap-1">
                            <Link
                                href="https://ko-fi.com/mwlica"
                                className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-3 rounded-md duration-200 hidden sm:flex items-center gap-2 group"
                            >
                                <SiKofi className="group-hover:text-[#ff6c6b] duration-200 mt-0.5" />
                                Donate
                            </Link>
                            <Link href="/vote" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-3 rounded-md duration-200 flex items-center gap-2 group">
                                <TopggIcon className="group-hover:text-[#ff3366] duration-200 h-5 w-5 mt-0.5" />
                                Vote
                            </Link>
                        </div>

                        {cookieStore.get("hasSession")?.value === "true" ?
                            <Header className="ml-auto" />
                            :
                            <LoginButton />
                        }
                    </nav>

                    <Provider>
                        {children}
                    </Provider>

                    <StoreLastPage />

                </body>
            </html>
        </CookiesProvider>
    );
}