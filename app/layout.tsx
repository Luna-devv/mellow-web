
import "./globals.css";

import { Metadata, Viewport } from "next";
import { Montserrat, Outfit } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { SiKofi } from "react-icons/si";

import Header from "@/components/header";
import TopggIcon from "@/components/icons/topgg";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";

const outfit = Outfit({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#945682",
    initialScale: 0.85
};

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

        description,
        keywords: ["discord", "bot", "app", "intefration", "discord bot", "waya", "waya bot", "waya.one", "mwya", "mellow", "wamellow", "mwlica", "lunish.nl", "Luna-devv", "mee6 alternative", "arcane alternative", "dyno alternative", "starboard", "ranks", "leaderboard", "lb", "leaderboards", "text to speech", "captcha", "passport", "verification", "verify", "captcha.bot", "security", "tts", "text to speech", "free", "customizable", "next-gen", "next generation", "ai", "ai images", "nsfw detection", "moderation", "anime", "nekos", "waifus", "chat to speech", "liapew"],

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
    return (
        <html lang="en" className="dark flex justify-center min-h-screen max-w-screen overflow-x-hidden">

            <Script defer data-domain="wamellow.com" src="https://analytics.wamellow.com/js/script.js" />

            <body className={`${outfit.className} w-full max-w-7xl`}>
                <div id="bg" className="absolute top-0 right-0 w-screen h-screen -z-10" />

                <div className="absolute left-0 bg-gradient-to-r from-indigo-400 to-pink-400 h-8 w-full flex items-center justify-center text-white font-medium text-sm">
                    <div className="hidden md:block">
                        Please note that this is an <span className="underline decoration-dotted break-word">early alpha version</span> of the bot and the website!
                    </div>
                    <div className="block md:hidden">
                        This is an <span className="underline decoration-dotted break-word">early alpha version</span>!
                    </div>
                </div>

                <nav className="p-4 flex items-center gap-2 text-base font-medium dark:text-neutral-300 text-neutral-700 select-none mt-7 h-20">
                    <Link href="/" className={`${montserrat.className} font-semibold flex items-center mr-2`}>
                        <Image src="/waya-v3-small.webp" width={64} height={64} alt="" className="rounded-full mr-2 w-8 h-8" />
                        <span className="text-xl dark:text-neutral-100 text-neutral-900">Wamellow</span>
                    </Link>

                    <div className="hidden sm:flex gap-1">
                        <Link href="https://lunish.nl/kofi" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center gap-2 group">
                            <SiKofi className="group-hover:text-[#ff6c6b] duration-200" /> Support us
                        </Link>
                        <Link href="/vote" className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center gap-2 group">
                            <TopggIcon className="group-hover:text-[#ff3366] duration-200 h-5 w-5" /> Vote
                        </Link>
                    </div>

                    <Header className="ml-auto" />
                </nav>

                <Provider>
                    {children}
                </Provider>

            </body>
        </html>
    );
}