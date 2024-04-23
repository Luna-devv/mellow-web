import { Image } from "@nextui-org/react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { HiAnnotation, HiLink, HiUsers, HiVolumeUp } from "react-icons/hi";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { getGuild } from "@/lib/api";
import paintPic from "@/public/paint.webp";
import decimalToRgb from "@/utils/decimalToRgb";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";

import { getDesign, getPagination } from "./api";
import Side from "./side.component";

export interface Props {
    params: { guildId: string };
    children: React.ReactNode;
}

export const revalidate = 60 * 60;

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);
    const name = guild && "name" in guild ? guild.name : "Unknown";

    const title = `${name}'s Leaderboard`;
    const description = `Discover the most active chatters, voice timers, and top inviters. ${name ? `Explore the community of the ${name} discord server right from your web browser.` : ""}`;
    const url = getCanonicalUrl("leaderboard", params.guildId);

    const date = new Date();
    const cacheQuery = `${date.getDate()}${date.getHours()}`;

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
            images: {
                url: getCanonicalUrl("leaderboard", params.guildId, `open-graph.png?ca=${cacheQuery}`),
                width: 1200,
                height: 630,
                type: "image/png"
            }
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: {
                url: getCanonicalUrl("leaderboard", params.guildId, `open-graph.png?ca=${cacheQuery}`),
                alt: title
            }
        },
        robots: name ? "index, follow" : "noindex"
    };
};

export default async function RootLayout({
    params,
    children
}: Props) {

    const guildPromise = getGuild(params.guildId);
    const designPromise = getDesign(params.guildId);
    const paginationPromise = getPagination(params.guildId);

    const [guild, design, pagination] = await Promise.all([guildPromise, designPromise, paginationPromise]).catch(() => []);

    const guildExists = guild && "id" in guild;

    const backgroundRgb = design && "backgroundColor" in design && design.backgroundColor
        ? decimalToRgb(design.backgroundColor || 0)
        : undefined;

    const cookieStore = cookies();
    const currentCircular = cookieStore.get("lbc")?.value;

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

            <div className="relative mb-14 w-full">
                <Image
                    alt=""
                    className="w-full object-cover"
                    classNames={{ img: "h-36 md:h-64", blurredImg: "h-40 md:h-72 -top-5" }}
                    isBlurred
                    src={design && "bannerUrl" in design && design.bannerUrl ? design.bannerUrl : paintPic.src}
                    width={3840 / 2}
                    height={2160 / 2}
                />

                <div
                    className="text-lg flex gap-5 items-center absolute bottom-[-44px] md:bottom-[-34px] left-[12px] md:left-8 py-4 px-5 rounded-3xl z-20 backdrop-blur-3xl backdrop-brightness-75 shadow-md"
                >
                    <ImageReduceMotion
                        alt="Server icon"
                        className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40"
                        url={guildExists ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : "/discord"}
                        size={128}
                    />

                    <div className="flex flex-col gap-1">
                        <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium max-w-md truncate">
                            {guildExists ? guild.name : "Unknown Server"}
                        </div>
                        <div className="text-sm font-semibold flex items-center gap-1">
                            <HiUsers /> {guildExists ? intl.format(guild?.memberCount) : 0}

                            <Image src="https://cdn.discordapp.com/emojis/875797879401361408.webp?size=32" width={18} height={18} alt="boost icon" className="ml-2" />
                            <span className="ml-2">Level {guildExists ? guild?.premiumTier : 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Messages",
                        value: "",
                        icon: <HiAnnotation />
                    },
                    {
                        name: "Voicetime",
                        value: "voiceminutes",
                        icon: <HiVolumeUp />
                    },
                    {
                        name: "Invites",
                        value: "invites",
                        icon: <HiLink />
                    }
                ]}
                url={`/leaderboard/${params.guildId}`}
                searchParamName="type"
                disabled={!guild}
            >
                {/* {searchParams.type === "voiceminutes" ? pagination.voiceminutes : intl.format(pagination[searchParams.type] || 0)} {searchParams.type} */}
            </ListTab>

            <div className="md:flex">

                <div
                    itemScope
                    itemType="https://schema.org/ItemList"
                    className="lg:w-3/4 md:w-2/3 w-full md:mr-6"
                >
                    {guildExists && <h2 itemProp="name" className="display-hidden sr-only">Top 10 users in {guild?.name}</h2>}
                    <link itemProp="itemListOrder" href="https://schema.org/ItemListOrderDescending" />

                    {children}

                </div>

                <div className="lg:w-1/4 md:w-1/3 mt-8 md:mt-0">
                    <Side
                        guild={guild}
                        design={design}
                        pagination={pagination}
                        currentCircular={currentCircular as undefined}
                    />
                </div>

            </div>

        </div >
    );
}