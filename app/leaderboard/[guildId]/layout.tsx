import { Image } from "@nextui-org/react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { HiAnnotation, HiLink, HiUsers, HiVolumeUp } from "react-icons/hi";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import paintPic from "@/public/paint.webp";
import decimalToRgb from "@/utils/decimalToRgb";
import { getCanonicalUrl } from "@/utils/urls";

import { getDesign, getGuild, getPagination } from "./api";
import Side from "./side.component";

export interface LeaderboardProps {
    params: { guildId: string },
    children: React.ReactNode;
}

export const revalidate = 60 * 60;

export const generateMetadata = async ({
    params
}: LeaderboardProps): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);

    const title = `${guild?.name || "Unknown"}'s Leaderboard`;
    const description = `Discover the most active chatters, voice timers, and top inviters. ${guild?.name ? `Explore the community of the ${guild.name} discord server right from your web browser.` : ""}`;
    const url = getCanonicalUrl("leaderboard", params.guildId);

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
                url: `https://4099-2001-871-21c-d364-74bb-b3f8-c7d7-1ffe.ngrok-free.app/leaderboard/${params.guildId}/open-graph.png`,
                width: 1200,
                height: 630,
                type: "image/png"
            }
        },
        twitter: {
            card: "summary_large_image",
            title,
            description
        },
        robots: guild?.name ? "index, follow" : "noindex"
    };
};

export default async function RootLayout({
    params,
    children
}: LeaderboardProps
) {

    const guildPromise = getGuild(params.guildId);
    const designPromise = getDesign(params.guildId);
    const paginationPromise = getPagination(params.guildId);

    const [guild, design, pagination] = await Promise.all([guildPromise, designPromise, paginationPromise]).catch(() => []);

    const backgroundRgb = decimalToRgb(design?.backgroundColor || 0);
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    const cookieStore = cookies();
    const currentCircular = cookieStore.get("lbc")?.value;

    return (
        <div className="w-full">

            {design?.backgroundColor &&
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
                    src={design?.banner || paintPic.src}
                    width={3840 / 2}
                    height={2160 / 2}
                />

                <div
                    className="text-lg flex gap-5 items-center absolute bottom-[-44px] md:bottom-[-34px] left-[12px] md:left-10 py-4 px-5 rounded-3xl z-20 backdrop-blur-3xl backdrop-brightness-75 shadow-md"
                >
                    <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`} size={128} alt="Server icon" className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40" />
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                        <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
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

                <div itemScope itemType="https://schema.org/ItemList" className="md:w-3/4 md:mr-6">
                    <h2 itemProp="name" className="display-hidden sr-only">Top 10 users in {guild?.name}</h2>
                    <link itemProp="itemListOrder" href="https://schema.org/ItemListOrderDescending" />

                    {children}

                </div>

                <div className="md:w-1/4 mt-8 md:mt-0">
                    <Side guildId={params.guildId} design={design} pagination={pagination} currentCircular={currentCircular as undefined} />
                </div>

            </div>

        </div>
    );
}