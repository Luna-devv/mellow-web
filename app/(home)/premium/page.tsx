import type { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsQuestionLg } from "react-icons/bs";
import { HiArrowRight, HiLightningBolt, HiOutlineCheck, HiOutlineInformationCircle, HiUser, HiUserGroup, HiX } from "react-icons/hi";
import { IoMdInfinite } from "react-icons/io";

import Comment from "@/components/comment";
import ImageGrid from "@/components/image-grid";
import { OverviewLink } from "@/components/overview-link";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { InputBaseAdornment, InputBaseAdornmentButton } from "@/components/ui/input-base";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultFetchOptions } from "@/lib/api";
import type User from "@/lib/discord/user";
import { getUser } from "@/lib/discord/user";
import ArrowPic from "@/public/icons/arroww.webp";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import { Subscribe } from "./subscribe.component";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

const bots = ["1125449347451068437", "985213199248924722", "1097907896987160666"].map((userId) => getUser(userId));

const items = [
    { title: "Price", free: "€0 /forever", premium: "€4 /month" },

    { title: "Your Benefits", icon: <HiUser /> },
    { title: "Text to Speech", free: Infinity, premium: Infinity, unit: "chars /month" },
    { title: "TTS Translations", free: 10_000, premium: 100_000, unit: "chars /month" },
    { title: "Bypass voting", free: false, premium: true, tooltip: <OtherBotsTooltip /> },
    { title: "Bypass passport", free: false, premium: true },
    { title: "Premium role", free: false, premium: true, url: "/support" },
    // { title: "Spotify control", free: maybe, premium: true, url: "/profile/connections" },
    { title: "Fast support", free: true, premium: true },

    { title: "For Your Server", icon: <HiUserGroup /> },
    { title: "Social notifications", free: 30, premium: Infinity },
    { title: "Custom commands", free: 30, premium: Infinity },
    { title: "Dailyposts", free: 4, premium: 20 },
    { title: "Welcome pings", free: 5, premium: 15 },
    { title: "Welcome roles", free: 5, premium: 10 },
    { title: "Notification styles", free: false, premium: true },
    { title: "Notification crosspost", free: false, premium: true }
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
                    images={
                        topGuilds
                            .sort((a, b) => b.memberCount - a.memberCount)
                            .map((guild) => ({
                                id: guild.id,
                                url: (guild.icon || "/discord.webp").replace("gif", "webp"),
                                link: getCanonicalUrl("leaderboard", guild.id)
                            }))
                    }
                />
            ) }

            <div className="dark:bg-wamellow bg-wamellow-100 dark:text-neutral-300 text-neutral-700 mt-10 w-full rounded-xl overflow-hidden">

                <div className="flex items-center pb-4 text-2xl p-4 font-semibold bg-wamellow">
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 block md:hidden">Features</span>
                    <span className="dark:text-neutral-100 text-neutral-900 w-2/4 hidden md:block">Pricing and Features</span>
                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent w-1/4 ">Free</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent w-1/4">Premium</span>
                </div>

                <div className="p-4 pt-0">
                    {items.map((item) => (
                        (item.free !== undefined && item.premium !== undefined)
                            ? <div key={item.title} className="flex items-center py-4 border-b border-wamellow">
                                <div className="md:text-base text-sm font-medium w-2/4 md:pr-0 pr-4 flex gap-1">
                                    {item.title}
                                    {item.tooltip && (
                                        <Tooltip>
                                            <InputBaseAdornment>
                                                <InputBaseAdornmentButton asChild>
                                                    <TooltipTrigger>
                                                        <HiOutlineInformationCircle />
                                                    </TooltipTrigger>
                                                </InputBaseAdornmentButton>
                                            </InputBaseAdornment>
                                            <TooltipContent>
                                                {item.tooltip}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                                <span className="text-xl dark:text-neutral-200 text-neutral-700 font-medium w-1/4 flex items-end">
                                    {displayState(item.free, item.unit)}
                                </span>
                                <span className="text-xl dark:text-neutral-200 text-neutral-700 font-medium w-1/4 flex items-end">
                                    {displayState(item.premium, item.unit)}
                                    {item.url && (
                                        <Link
                                            href={item.url}
                                            target="_blank"
                                            className="ml-auto mr-3 hover:underline italic text-sm text-muted-foreground hidden md:block relative bottom-0.5"
                                        >
                                            Take me there <HiArrowRight className="inline ml-1 mb-px" />
                                        </Link>
                                    )}
                                </span>
                            </div>
                            : <div key={item.title}>
                                <Badge className="flex items-center gap-2 md:text-muted-foreground text-xs font-semibold pb-1 rounded-t-none">
                                    {item.icon}
                                    {item.title}
                                </Badge>
                            </div>
                    ))}

                    <div className="hidden md:flex items-center pt-4">
                        <div className="w-1/2 text-sm text-neutral-400 flex justify-between pr-4">
                            <div />
                            <div className={cn("text-medium text-neutral-500 font-medium rotate-2 flex items-center gap-1 mt-4", handwritten.className)}>
                                extra monthly donation
                                <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="size-5 -scale-x-100 mb-1.5 rotate-6" draggable={false} />
                            </div>
                        </div>
                        <div className="flex w-1/2 gap-4">
                            <Subscribe />
                        </div>
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

    if (typeof is === "number") {
        return (<>
            {is === Infinity ? <IoMdInfinite className="w-7 h-7" title="Infinite" /> : is.toLocaleString()}
            <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </>);
    }

    return is;
}

async function OtherBotsTooltip() {
    const resolved = await Promise.all(bots) as User[];

    return (
        <div className="font-normal text-muted-foreground flex items-center">
            Applies at
            {" "}
            {resolved.map((user) => (
                <div key={user.id} className="font-semibold text-neutral-300 flex items-center">
                    <UserAvatar
                        key={"avt-" + user.id}
                        alt={user.username}
                        className="ml-1.5 mr-0.5 size-4"
                        src={user.avatarUrl || "/discord.webp"}
                    />
                    {user.username}
                </div>
            ))}
        </div>
    );
}