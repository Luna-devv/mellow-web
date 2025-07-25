import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Lexend, Noto_Sans_JP, Outfit } from "next/font/google";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CookiesProvider } from "next-client-cookies/server";

import { Header } from "@/components/header";
import { LoginButton } from "@/components/login-button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });
const notosansJP = Noto_Sans_JP({ subsets: ["cyrillic", "vietnamese"], variable: "--font-noto-sans-jp" });

const lexend = Lexend({ subsets: ["latin"] });

// TODO: get automatically from top.gg
const reviews = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "wamellow",
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "100",
        bestRating: "5"
    }
};

export const viewport: Viewport = {
    themeColor: "#8957ff",
    initialScale: 0.9
};

export const generateMetadata = (): Metadata => {

    const title = "Wamellow: Next-gen of Discord Bots & Apps";
    const description = "Engage with leaderboards, starboards, and welcoming atmosphere. Dive into anime discussions, enjoy free chat aI and unleash the power of Text-To-Speech.";

    return {
        metadataBase: new URL(getBaseUrl()),

        manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
            title: "Wamellow",
            startupImage: "/waya-v3.webp",
            statusBarStyle: "black-translucent"
        },

        title: {
            default: title,
            template: "%s"
        },

        description,

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
            images: `${getBaseUrl()}/waya-v3.webp?v=3`
        },

        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.webp?v=3`
        },

        other: {
            google: "notranslate"
        },

        creator: "Luna (shi.gg)",
        publisher: "Luna (shi.gg)",

        robots: "index, follow"
    };
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <CookiesProvider>
            <html
                suppressHydrationWarning
                data-theme="dark"
                lang="en"
                className="dark flex justify-center max-w-screen overflow-x-hidden"
            >
                <Script defer data-domain="wamellow.com" src="https://analytics.wamellow.com/js/script.outbound-links.js" />

                <Script
                    id="reviews"
                    type="application/ld+json"
                >
                    {JSON.stringify(reviews)}
                </Script>

                <body
                    className={cn("w-full max-w-7xl overflow-x-hidden xl:!overflow-visible", outfit.variable, notosansJP.variable)}
                    style={{ overflow: "visible" }}
                >
                    <div id="bg" className="absolute top-0 right-0 w-screen h-screen -z-50" />
                    <Noise />

                    <NavBar />

                    <Provider>
                        {children}
                    </Provider>

                </body>
            </html>
        </CookiesProvider>
    );
}

function Noise() {
    return (
        <svg
            className="absolute top-0 left-0 w-screen h-full -z-40 blur-[1px] saturate-0"
            viewBox='0 0 142 158'
            xmlns='http://www.w3.org/2000/svg'
        >
            <filter id='noiseFilter'>
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="9"
                    numOctaves="1"
                    stitchTiles="stitch"
                    result="turbulence"

                />
                <feComponentTransfer>
                    <feFuncR type="table" tableValues="-1 0.2" />
                    <feFuncG type="table" tableValues="-1 0.2" />
                    <feFuncB type="table" tableValues="-1 0.2" />
                </feComponentTransfer>
            </filter>

            <rect
                className="w-screen h-screen"
                filter='url(#noiseFilter)'
            />
        </svg>
    );
}

async function NavBar() {
    const jar = await cookies();

    return (
        <nav className="p-4 flex items-center gap-2 text-base text-neutral-300 select-none h-20 relative">
            <Link
                aria-label="Go to Wamellow's homepage"
                className={cn("font-semibold flex items-center shrink-0", lexend.className)}
                href="/"
            >
                <Image src="/waya-v3.webp" width={64} height={64} alt="" className="rounded-full size-8 shrink-0 mr-3" />
                <span className="text-xl dark:text-neutral-100 text-neutral-900 hidden sm:block">Wamellow</span>
            </Link>

            <Separator
                className="h-10 rotate-6 mx-3"
                orientation="vertical"
            />

            <div className="flex shrink-0 gap-4">
                <Link
                    href="/docs/index"
                    className="hover:text-neutral-100 duration-100"
                >
                    Documentation
                </Link>
                <Link
                    href="/premium"
                    className="hidden sm:block hover:text-neutral-100 duration-100"
                >
                    Premium
                </Link>
            </div>

            {jar.get("session")?.value
                ? <Header />
                : <LoginButton className="ml-auto" />
            }
        </nav>
    );
}