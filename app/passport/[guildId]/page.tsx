import { Metadata } from "next";
import Image from "next/image";
import { BsDiscord } from "react-icons/bs";
import { HiChartBar, HiCheck, HiLightningBolt, HiLockClosed, HiStar, HiX } from "react-icons/hi";

import ErrorBanner from "@/components/Error";
import ImageReduceMotion from "@/components/ImageReduceMotion";
import { ListFeature } from "@/components/List";
import OverviewLinkComponent from "@/components/OverviewLinkComponent";
import { ApiV1GuildsGetResponse, ApiV1GuildsModulesPassportGetResponse } from "@/typings";
import decimalToRgb from "@/utils/decimalToRgb";
import { getCanonicalUrl } from "@/utils/urls";

import VerifyComponent from "./VerifyComponent";

interface PassportProps { params: { guildId: string }, searchParams: { page: string, type: string } }

async function getGuild(guildId: string): Promise<ApiV1GuildsGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    const guild = await res.json();
    return guild;
}

async function getPassport(guildId: string): Promise<ApiV1GuildsModulesPassportGetResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/passport-verification`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 }
    });

    const passport = await res.json();
    return passport;
}

export const generateMetadata = async ({
    params
}: PassportProps): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);

    const title = `Verify in ${guild.name}`;
    const description = `Easily verify yourself in ${guild.name} with a simple and safe captcha in the web to gain access all channels.`;
    const url = getCanonicalUrl("passport", params.guildId);

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256` : "/discord.png"
        },
        twitter: {
            card: "summary",
            title,
            description
        }
    };
};

export default async function Home({ params }: PassportProps) {
    const guildPromise = getGuild(params.guildId);
    const passportPromise = getPassport(params.guildId);

    const [guild, passport] = await Promise.all([guildPromise, passportPromise]);

    const backgroundRgb = decimalToRgb(passport.backgroundColor || 0);
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    return (
        <div className="w-full">

            {passport.backgroundColor &&
                <style>
                    {`
                        :root {
                            --background-rgb: rgb(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b});
                        }
                    `}
                </style>
            }

            {typeof passport === "object" && "statusCode" in passport &&
                <ErrorBanner message={(passport as Record<string, string>).message} removeButton />
            }

            <div className="grid md:flex gap-6">

                <div className="w-full md:max-w-[384px] overflow-hidden rounded-xl dark:bg-wamellow bg-wamellow-100 relative">

                    <div className="mb-8 h-[216px]" style={{ background: "url(/paint.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} />
                    <div className="absolute top-0 w-full h-[216px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, var(--wamellow-rgb) 100%)" }} />

                    <div className="text-lg flex gap-2 items-center absolute top-[156px] ml-4">
                        <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} size={128} alt="Server icon" className="rounded-xl h-16 w-16" />
                        <div>
                            <div className="text-xl dark:text-neutral-200 text-neutral-800 font-semibold">{guild?.name || "Unknown Server"}</div>
                            <div className="text-sm flex items-center gap-2"> <Image src="https://cdn.discordapp.com/emojis/924058182626721802.webp" width={18} height={18} alt="member icon" />{intl.format(guild.memberCount)} members </div>
                            <div className="text-sm flex items-center gap-2"> <Image src="https://cdn.discordapp.com/emojis/875797879401361408.webp" width={18} height={18} alt="boost icon" />Level {guild.premiumTier}</div>
                        </div>
                    </div>

                    <div className="mx-4 mb-4">

                        <span className="text-sm font-semibold dark:text-neutral-400 text-neutral-600">GET ACCESS TO</span>
                        <ul>
                            {[
                                "Secure server",
                                `${intl.format(guild.memberCount)} members`,
                                `${guild.channelCount} channels`
                            ].map((name) => (
                                <li key={name} className="flex gap-1 items-center">
                                    <HiCheck className="text-violet-400" />
                                    {name}
                                </li>
                            ))}
                            <li className="flex gap-1 items-center" title="The cake is a lie">
                                <HiX className="text-red-400" />
                                Cakes
                            </li>
                        </ul>

                        <VerifyComponent guild={guild} />

                    </div>

                </div>

                <div>

                    <div className="w-full h-min overflow-hidden rounded-xl dark:bg-wamellow bg-wamellow-100 py-4 px-5">

                        <div className="mb-4 text-neutral-100 font-semibold text-xl">Modern, Simple, Wamellow 👋</div>
                        <ListFeature
                            items={[
                                { icon: <HiLockClosed />, title: "Secure", description: "Unrivaled user privacy with our top-notch verification systems.", color: 0xa84b56 },
                                { icon: <BsDiscord />, title: "Integration", description: "Unparalleled Discord integration, setting us apart from the rest.", color: 0x4752c4 },
                                { icon: <HiStar />, title: "Easy", description: "The most user-friendly and visually appealing verification process.", color: 0x7f43d8 },
                                { icon: <HiLightningBolt />, title: "Fast", description: "Welcome new members swiftly with the fastest verification method available.", color: 0xff9156 }
                            ]}
                        />
                        <div className="mt-4 text-sm text-neutral-500">*We actually have no idea what to put here</div>
                    </div>

                    <OverviewLinkComponent
                        className="mt-6"
                        title="View Leaderboard"
                        message="Easily access and view the top chatters, voice timers, and inviters from this server."
                        url={`/leaderboard/${params.guildId}`}
                        icon={<HiChartBar />}
                    />

                </div>

            </div>

        </div>
    );
}