import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { BsQuestionLg } from "react-icons/bs";
import { HiLightningBolt, HiOutlineCheck, HiX } from "react-icons/hi";
import { IoMdInfinite } from "react-icons/io";

import Comment from "@/components/comment";
import ImageGrid from "@/components/image-grid";
import { OverviewLink } from "@/components/overview-link";
import { Badge } from "@/components/ui/badge";
import { defaultFetchOptions } from "@/lib/api";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import { Subscribe } from "./subscribe.component";

const montserrat = Montserrat({ subsets: ["latin"] });
const maybe = null;

const items = [
    { title: "Price", free: "€0 /forever", premium: "€4 /month" },
    { title: "TTS Translations", free: 10_000, premium: 100_000, unit: "chars" },
    { title: "Custom commands", free: 30, premium: Infinity },
    { title: "Social notifications", free: 30, premium: Infinity },
    { title: "Dailyposts", free: 4, premium: 20 },
    { title: "Welcome roles", free: 5, premium: 10 },
    { title: "Welcome pings", free: 5, premium: 15 },
    { title: "Spotify control", free: maybe, premium: true, url: "/profile/connections" },
    { title: "Bypass passport", free: false, premium: true },
    { title: "Bypass Voting", free: false, premium: true },
    { title: "Crosspost social notifications", free: false, premium: true },
    { title: "Fast Support", free: true, premium: true }
];

export const revalidate = 3600;

export const generateMetadata = (): Metadata => {

    const title = "Premium (˶˃ ᵕ ˂˶)";
    const description = "Get epic premium+ ULTRA HD features for wamellow to upgrade your servers to a whole new experience and unlock tons of premium features.";
    const url = getCanonicalUrl("premium");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/waya-v3.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.webp`
        }
    };
};

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions).then((res) => res.json()) as ApiV1TopguildsGetResponse[];

    return (
        <div className="w-full">

            <div className="md:text-5xl text-4xl font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 flex gap-2 items-center w-full">
                <h1 className={cn("flex gap-4", montserrat.className)}>
                    <span className="hidden md:block">Wamellow</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep">Premium</span>
                </h1>
                <span className="text-pink-400 rotate-2 ml-2">
                    (˶˃ ᵕ ˂˶)
                </span>
            </div>

            {topGuilds && (
                <ImageGrid
                    images={topGuilds
                        .sort((a, b) => b.memberCount - a.memberCount)
                        .map((guild) => ({
                            id: guild.id,
                            url: (guild.icon || "/discord.webp").replace("gif", "webp"),
                            link: getCanonicalUrl("leaderboard", guild.id)
                        }))}
                />
            ) }

            <div className="dark:bg-wamellow bg-wamellow-100 dark:text-neutral-300 text-neutral-700 mt-10 w-full p-4 rounded-xl text-xl divide-y divide-wamellow">

                <div className="flex items-center pb-4 text-2xl font-semibold">
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 block md:hidden">Features</span>
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 hidden md:block">Pricing and Features</span>
                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent w-1/4 ">Free</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent w-1/4">Premium</span>
                </div>

                {items.map((item) => (
                    <div key={item.title} className="flex items-center py-4">
                        <span className="md:text-base text-sm font-medium w-2/4 md:pr-0 pr-4">{item.title}</span>
                        <span className="dark:text-neutral-200 text-neutral-700 font-medium w-1/4">
                            {displayState(item.free, item.unit)}
                        </span>
                        <span className="dark:text-neutral-200 text-neutral-700 font-medium w-1/4 flex">
                            {displayState(item.premium, item.unit)}
                            {item.url && <Link href={item.url} target="_blank" className="ml-auto mr-3 hover:underline italic text-sm text-neutral-500 hidden md:block relative top-0.5">Take me there {"->"}</Link>}
                        </span>
                    </div>
                ))}

                <div className="hidden md:flex items-center pt-4">
                    <div className="w-1/2 text-sm text-neutral-400 flex justify-between pr-4">
                        <div />
                        extra monthly donation
                    </div>
                    <div className="flex w-1/2 gap-4">
                        <Subscribe />
                    </div>
                </div>

            </div>

            <div className="w-full flex items-center gap-2">
                <Link
                    className="ml-auto text-violet-400/60 hover:text-violet-500/80 hover:underline duration-200 text-sm"
                    href="/terms/payment"
                    target="_blank"
                >
                    Terms apply
                </Link>
                •
                <Link
                    className="text-violet-400/60 hover:text-violet-500/80 hover:underline duration-200 text-sm"
                    href="/support"
                    target="_blank"
                >
                    Restore previous purchases
                </Link>
            </div>

            <Comment
                username="@mwlica"
                avatar="/luna.webp"
                bio="Developer"
                content="my goal isn't to make profit, but rather to create something that people will love — but I also have to cover server costs, and buy food"
            />

            <OverviewLink
                className="mt-10"
                title="Donate one-time instead"
                message="Support me and the project by donating to me on Ko-fi (˶˃ ᵕ ˂˶)"
                url="https://ko-fi.com/mwlica"
                icon={<HiLightningBolt />}
            />

            <div className="p-2 fixed z-10 bottom-0 left-0 w-full md:hidden">
                <div className="dark:bg-wamellow bg-wamellow-100 backdrop-blur-lg backdrop-brightness-50 rounded-lg shadow-md w-full flex flex-col gap-2 items-center justify-center p-3">

                    <div className="flex gap-2 items-center">
                        <span className="dark:text-neutral-200 text-neutral-800 font-medium text-sm">Upgrade your experience further!</span>
                        <Badge
                            variant="flat"
                            radius="rounded"
                        >
                            €4 /month
                        </Badge>
                    </div>

                    <Subscribe />
                </div>
            </div>

        </div>
    );
}

function displayState(is: string | number | boolean | null, unit?: string) {
    if (typeof is === "boolean" || is === null) {
        if (is === true) return <HiOutlineCheck className="dark:text-violet-400 text-violet-600 w-6 h-6" />;
        if (is === false) return <HiX className="dark:text-red-400 text-red-600 w-6 h-6" />;
        if (is === null) return <BsQuestionLg className="text-orange-400 dark:text-orange-600 w-6 h-6" title="To be discussed" />;
    }

    if (is === Infinity) return <IoMdInfinite className="w-7 h-7" title="Infinite" />;
    if (typeof is === "number") return <>{is.toLocaleString()} {unit}</>;
    return is;
}