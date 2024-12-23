import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { BsQuestionLg } from "react-icons/bs";
import { HiLightningBolt, HiOutlineCheck, HiUserAdd, HiX } from "react-icons/hi";
import { IoMdInfinite } from "react-icons/io";

import Comment from "@/components/comment";
import ImageGrid from "@/components/image-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultFetchOptions } from "@/lib/api";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const montserrat = Montserrat({ subsets: ["latin"] });
const maybe = null;

const items = [
    { title: "Price", free: "$0 /month", pro: "$3.99 /month" },
    { title: "Custom commands", free: 30, pro: Infinity },
    { title: "Social notifications", free: 30, pro: Infinity },
    { title: "Dailyposts", free: 30, pro: Infinity },
    // { title: "Stickymessages", free: 10, pro: 50 },
    // { title: "Custom footers", free: false, pro: true },
    { title: "Welcome roles", free: 5, pro: 10 },
    { title: "Welcome pings", free: 5, pro: 15 },
    // { title: "Level roles", free: 15, pro: 25 },
    { title: "Spotify control", free: maybe, pro: true, url: "/profile/spotify" },
    { title: "Custom /rank sub-text", free: false, pro: true },
    // { title: "Display user as webhook", free: false, pro: true },
    { title: "Passport bypass", free: false, pro: true },
    // { title: "Custom page color", free: false, pro: true },
    // { title: "Statistics & Analytics", free: false, pro: true },
    { title: "Crosspost social notifications", free: false, pro: true }
];

export const revalidate = 3600;

export const generateMetadata = (): Metadata => {

    const title = "Professional experience";
    const description = "Get epic Pro+ ULTRA HD features for wamellow to upgrade your servers to a whole new experience and unlock tons of premium features.";
    const url = getCanonicalUrl("pro");

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
        <div className="flex items-center flex-col w-full">

            <div className="md:text-5xl text-4xl font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 flex gap-2 items-center w-full">
                <h1 className={cn("flex gap-4", montserrat.className)}>
                    <span className="hidden md:block">Wamellow</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep block md:hidden">Pro</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep hidden md:block">Professional</span>
                </h1>
                <HiLightningBolt className="text-pink-400 rotate-6" />
                <Badge
                    className="ml-auto mt-1.5"
                    size="lg"
                    variant="flat"
                    radius="rounded"
                >
                    Not available
                </Badge>
            </div>

            {topGuilds &&
                <ImageGrid images={topGuilds
                    .sort((a, b) => b.memberCount - a.memberCount)
                    .map((guild) => ({
                        id: guild.id,
                        url: guild.icon || "/discord.webp",
                        link: getCanonicalUrl("leaderboard", guild.id)
                    }))}
                />
            }

            <div className="dark:bg-wamellow bg-wamellow-100 dark:text-neutral-300 text-neutral-700 mt-10 w-full p-4 rounded-xl text-xl divide-y divide-wamellow">

                <div className="flex items-center py-4 text-2xl font-semibold">
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 block md:hidden">Features</span>
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 hidden md:block">Pricing and Features</span>

                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent w-1/4 ">Free</span>

                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent w-1/4 block md:hidden">Pro</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent w-1/4 hidden md:block">Pro+ ULTRA HD</span>
                </div>

                {items.map((item) => (
                    <div key={item.title} className="flex items-center py-4">
                        <span className="md:text-base text-sm font-medium w-2/4 md:pr-0 pr-4">{item.title}</span>
                        <span className="dark:text-neutral-200 text-neutral-700 font-medium w-1/4">
                            {displayState(item.free)}
                        </span>
                        <span className="dark:text-neutral-200 text-neutral-700 font-medium w-1/4 flex">
                            {displayState(item.pro)}
                            {item.url && <Link href={item.url} target="_blank" className="ml-auto mr-3 hover:underline italic text-sm text-neutral-500 hidden md:block relative top-0.5">Take me there {"->"}</Link>}
                        </span>
                    </div>
                ))}

                <div className="flex items-center pt-4">
                    <div className="w-1/2" />
                    <div className="hidden md:flex w-1/2 gap-4">
                        <Subscribe />
                    </div>
                </div>

            </div>

            <div className="w-full flex">
                <Link
                    className="ml-auto mt-1 dark:text-violet-400/60 text-violet-600/60 hover:text-violet-400/80 dark:hover:text-violet-600/80 hover:underline duration-200 text-sm"
                    href="/support"
                    target="_blank"
                >
                    Restore previous purchases
                </Link>
            </div>

            <Comment
                username="@mwlica"
                avatar="/luna.webp"
                bio="Cute femboy"
                content="buy it, buy it, buy it, buy it, buy it, buy it"
            />

            <div className="p-2 fixed z-10 bottom-0 left-0 w-full md:hidden">
                <div className="dark:bg-wamellow bg-wamellow-100 backdrop-blur-xl backdrop-brightness-50 rounded-lg shadow-md w-full flex flex-col gap-2 items-center justify-center p-3">

                    <div className="flex gap-2 items-center">
                        <span className="dark:text-neutral-200 text-neutral-800 font-medium text-sm">Upgrade your guilds further!</span>
                        <Badge
                            variant="flat"
                            radius="rounded"
                        >
                            Not available
                        </Badge>
                    </div>

                    <button className="flex dark:text-violet-400 text-violet-600 bg-violet-600/30 hover:bg-violet-600/10 py-2 px-4 rounded-md duration-200 justify-center gap-2 w-full opacity-30 cursor-not-allowed" disabled>
                        <HiLightningBolt className="relative top-1" />
                        <span className="ml-2">Subscribe</span>
                    </button>

                </div>
            </div>

        </div>
    );
}

function displayState(is: string | number | boolean | null) {
    if (typeof is === "boolean" || is === null) {
        if (is === true) return <HiOutlineCheck className="dark:text-violet-400 text-violet-600 w-6 h-6" />;
        if (is === false) return <HiX className="dark:text-red-400 text-red-600 w-6 h-6" />;
        if (is === null) return <BsQuestionLg className="text-orange-400 dark:text-orange-600 w-6 h-6" title="To be discussed" />;
    }

    if (is === Infinity) return <IoMdInfinite className="w-7 h-7" title="Infinite" />;
    return is;
}

function Subscribe() {
    return (<>
        <Button asChild>
            <Link
                className="w-1/2"
                prefetch={false}
                href="/invite"
                target="_blank"
            >
                <HiUserAdd />
                Invite Wamellow
            </Link>
        </Button>
        <Button
            asChild
            variant="secondary"
        >
            <Link
                className="w-1/2"
                prefetch={false}
                href="https://ko-fi.com/mwlica"
                target="_blank"
            >
                <HiLightningBolt />
                Subscribe
            </Link>
        </Button>
    </>);
}