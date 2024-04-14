import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiChartBar, HiCheck, HiLightningBolt, HiLockClosed, HiStar, HiUsers, HiX } from "react-icons/hi";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListFeature } from "@/components/list";
import Notice, { NoticeType } from "@/components/notice";
import OverviewLinkComponent from "@/components/OverviewLinkComponent";
import { ServerButton } from "@/components/server-button";
import { getGuild } from "@/lib/api";
import paintPic from "@/public/paint.webp";
import decimalToRgb from "@/utils/decimalToRgb";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";

import { getPassport } from "./api";
import Verify from "./verify.component";

interface Props {
    params: { guildId: string };
    searchParams: { page: string, type: string };
}

export const revalidate = 60;

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);
    const name = guild && "name" in guild ? guild.name : "Unknown";

    const title = `Verify in ${name}`;
    const description = `Easily verify yourself in ${name} with a simple and safe captcha in the web to gain access all channels.`;
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
            images: guild && "icon" in guild && guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256` : "/discord.png"
        },
        twitter: {
            card: "summary",
            title,
            description
        }
    };
};

export default async function Home({ params }: Props) {
    const guildPromise = getGuild(params.guildId);
    const passportPromise = getPassport(params.guildId);

    const [guild, passport] = await Promise.all([guildPromise, passportPromise]);

    const guildExists = guild && "id" in guild;

    const backgroundRgb = typeof passport === "object" && "backgroundColor" in passport && passport.backgroundColor
        ? decimalToRgb(passport.backgroundColor || 0)
        : undefined;

    return (
        <div className="w-full">

            {backgroundRgb &&
                <style>
                    {`
                        :root {
                            --background-rgb: rgb(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b});
                        }
                    `}
                </style>
            }

            {typeof passport === "object" && "message" in passport &&
                <Notice type={NoticeType.Error} message={passport.message} />
            }

            {guild && "id" in guild && guild?.id === "1125063180801036329" &&
                <Notice type={NoticeType.Info} message="This is a demo server to test out passport verification." >
                    <ServerButton
                        as={Link}
                        color="secondary"
                        href="https://discord.gg/2nrK8DfjPt"
                        target="_blank"
                        startContent={<BsDiscord />}
                    >
                        Join Server
                    </ServerButton>
                </Notice>
            }

            <div className="grid md:flex gap-6">

                <div className="w-full md:max-w-[384px] overflow-hidden rounded-xl dark:bg-wamellow bg-wamellow-100 relative">

                    <Image
                        alt=""
                        className="w-full object-cover h-[216px]"
                        src={guild && "banner" in guild && guild.banner ? `https://cdn.discordapp.com/banners/${guild?.id}/${guild?.banner}?size=512` : paintPic.src}
                        width={960}
                        height={540}
                    />
                    <div className="absolute top-0 w-full h-[216px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgb(22, 19, 31) 100%)" }} />

                    <div
                        className="text-lg flex gap-5 items-center absolute top-[146px] rounded-3xl z-20 left-[4px] md:left-1.5 py-4 px-5 backdrop-blur-3xl backdrop-brightness-90 shadow-md"
                    >
                        <ImageReduceMotion
                            alt="Server icon"
                            className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40"
                            url={guildExists ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : "/discord"}
                            size={128}
                        />

                        <div className="flex flex-col gap-1">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium max-w-64 truncate">
                                {guildExists ? guild.name : "Unknown Server"}
                            </div>
                            <div className="text-sm font-semibold flex items-center gap-1">
                                <HiUsers /> {guildExists ? intl.format(guild?.memberCount) : 0}

                                <Image src="https://cdn.discordapp.com/emojis/875797879401361408.webp?size=32" width={18} height={18} alt="boost icon" className="ml-2" />
                                <span className="ml-2">Level {guildExists ? guild?.premiumTier : 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mx-4 mb-4 mt-10 font-medium">

                        <span className="text-sm font-bold dark:text-neutral-400 text-neutral-600">GET ACCESS TO</span>
                        <ul>
                            {[
                                "Secure server",
                                `${guild && "memberCount" in guild ? intl.format(guild?.memberCount) : 0} members`
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

                        {
                            guild && "id" in guild &&
                            passport === true &&
                            <Verify
                                guild={guild}
                            />
                        }

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