import { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Link from "next/link";
import { BsDiscord, BsQuestionLg } from "react-icons/bs";
import { HiChevronRight, HiLightningBolt, HiOutlineCheck, HiX } from "react-icons/hi";
import { IoMdInfinite } from "react-icons/io";

import Badge from "@/components/badge";
import ImageGrid from "@/components/image-grid";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ApiV1TopguildsGetResponse } from "@/typings";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const maybe = null;
const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const revalidate = 3600;

const fetchOptions = { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } };

export const generateMetadata = async (): Promise<Metadata> => {

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
            images: `${getBaseUrl()}/waya-v3.jpg`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.jpg`
        }
    };
};

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, fetchOptions).then((res) => res.json()) as ApiV1TopguildsGetResponse[];

    const buttons = (
        <>
            <Link href="/login?invite=true" className="flex text-neutral-200 bg-neutral-600 hover:bg-neutral-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 w-1/2">
                <BsDiscord className="relative top-1" />
                <span className="ml-2">Get started</span>
            </Link>
            <button className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 w-1/2 opacity-30 cursor-not-allowed" disabled>
                <HiLightningBolt className="relative top-1" />
                <span className="ml-2">Subscribe</span>
            </button>
        </>
    );

    const displayState = (is: string | number | boolean | null) => {
        if (typeof is === "boolean" || is === null) {
            if (is === true) return <HiOutlineCheck className="dark:text-violet-400 text-violet-600 w-6 h-6" />;
            if (is === false) return <HiX className="dark:text-red-400 text-red-600 w-6 h-6" />;
            if (is === null) return <BsQuestionLg className="text-orange-400 dark:text-orange-600 w-6 h-6" title="To be discussed" />;
        }

        if (is === Infinity) return <IoMdInfinite className="w-7 h-7" title="Infinite" />;
        return is;
    };

    return (
        <div className="flex items-center flex-col w-full">

            <div className="md:text-5xl text-4xl font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 flex gap-2 w-full">
                <h1 className={montserrat.className}>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep block md:hidden">Pro</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep hidden md:block">Professional</span>
                </h1>
                <HiLightningBolt className="text-pink-400 rotate-6" />
                <Badge text="Not available" />
            </div>

            {topGuilds && <ImageGrid images={topGuilds.map((guild) => ({ id: guild.name, url: guild.icon || "/discord.webp" }))} />}

            <div className="dark:bg-wamellow bg-wamellow-100 dark:text-neutral-300 text-neutral-700 mt-10 w-full p-4 rounded-xl text-xl">

                <div className="flex items-center py-4 border-b-2 dark:border-wamellow-light border-wamellow-100-light text-2xl font-semibold">
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 block md:hidden">Features</span>
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 hidden md:block">Pricing and Features</span>

                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent w-1/4 ">Free</span>

                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent w-1/4 block md:hidden">Pro</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent w-1/4 hidden md:block">Pro+ ULTRA HD</span>
                </div>

                {[
                    { title: "Price", free: "$0 /month", pro: "$3.21 /month" },
                    { title: "Custom commands", free: 30, pro: Infinity },
                    { title: "Stickymessages", free: 10, pro: 50 },
                    { title: "Custom footers", free: false, pro: true },
                    { title: "Welcome roles", free: 5, pro: 10 },
                    { title: "Welcome pings", free: 5, pro: 15 },
                    { title: "Level roles", free: 15, pro: 25 },
                    { title: "Spotify control", free: maybe, pro: true, url: "/profile/spotify" },
                    { title: "Custom rank sub-text", free: false, pro: true },
                    { title: "Display user as webhook", free: false, pro: true },
                    { title: "Passport bypass", free: false, pro: true },
                    { title: "Custom page color", free: false, pro: true },
                    { title: "Statistics & Analytics", free: false, pro: true },
                    { title: "Sex with me*", free: false, pro: false }
                ].map((item) => (
                    <div key={item.title} className="flex items-center py-4 border-b-2 dark:border-wamellow-light border-wamellow-100-light">
                        <span className="md:text-base text-sm font-medium w-2/4 md:pr-0 pr-4">{item.title}</span>
                        <span className="dark:text-neutral-200 text-neutral-700 font-medium w-1/4">
                            {displayState(item.free)}
                        </span>
                        <span className="dark:text-neutral-200 text-neutral-700 font-medium w-1/4 flex">
                            {displayState(item.pro)}
                            {item.url && <Link href={item.url} target="_blank" rel="noopener noreferrer" className="ml-auto mr-3 hover:underline italic text-sm text-neutral-500 hidden md:block relative top-0.5">Take me there {"->"}</Link>}
                        </span>
                    </div>
                ))}

                <div className="flex items-center pt-4">
                    <span className="text-sm dark:text-neutral-400 text-neutral-600 md:w-2/4">*Sex only with cute femboys from Vienna :3</span>
                    <div className="hidden md:flex w-2/4 gap-4">
                        {buttons}
                    </div>
                </div>

            </div>

            <div className="w-full flex">
                <Link href="/support" target="_blank" rel="noopener noreferrer" className="ml-auto mt-1 dark:text-violet-400/60 text-violet-600/60 hover:text-violet-400/80 dark:hover:text-violet-600/80 hover:underline duration-200 text-sm">Restore previous purchases</Link>
            </div>

            <div className="w-full mt-6 md:flex gap-4 items-center">
                <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-2">
                        <ImageReduceMotion url="/luna" size={64} alt="mwlica's profile picture" className="w-12 h-12 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-medium dark:text-neutral-200 text-neutral-800">@mwlica</span> <Badge text="Developer" />
                            </div>
                            <span className="dark:text-neutral-300 text-neutral-700">Cute femboy</span>
                        </div>
                    </span>
                    <HiChevronRight className="w-8 h-8" />
                </div>
                <span className={`${handwritten.className} text-2xl break-words block md:hidden mt-2`}>„buy it, buy it, buy it, buy it, buy it“</span>
                <span className={`${handwritten.className} text-2xl break-words hidden md:block`}>„buy it, buy it, buy it, buy it, buy it, buy it, buy it“</span>
            </div>

            <div className="p-2 fixed z-10 bottom-0 left-0 w-full md:hidden">
                <div className="dark:bg-wamellow-light bg-wamellow-100-light rounded-lg shadow-md w-full flex flex-col gap-2 items-center justify-center p-3">

                    <div className="flex gap-2 items-center">
                        <span className="dark:text-neutral-200 text-neutral-800 font-medium text-sm">Upgrade your guilds further!</span>
                        <Badge text="Not available" />
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

/*
            <div className="p-2 fixed z-10 bottom-0 left-0 w-full">
                <div className="bg-wamellow-light rounded-lg shadow-md w-full flex gap-2 items-center justify-center p-3">
                    {buttons}
                </div>
            </div>
 */