import { Metadata } from "next";
import Image from "next/image";
import { HiUsers } from "react-icons/hi";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import decimalToRgb from "@/utils/decimalToRgb";
import { getCanonicalUrl } from "@/utils/urls";

import { getDesign, getGuild, getPagination } from "./api";
import Side from "./side.component";

interface LeaderboardProps {
    params: { guildId: string },
    children: React.ReactNode;
}

export const revalidate = 60 * 60;

export const generateMetadata = async ({
    params
}: LeaderboardProps): Promise<Metadata> => {
    const guild = await getGuild(params.guildId);

    const title = `${guild?.name || "Unknown"}'s Leaderboard`;
    const description = `Effortlessly discover the most active chatters, voice timers, and acknowledge top inviters. Explore the vibrant community dynamics of the ${guild?.name || "unknown"} discord server right from your web browser.`;
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
            images: guild?.icon ? `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.webp?size=256` : "/discord.png"
        },
        twitter: {
            card: "summary",
            title,
            description
        },
        robots: guild.name ? "index, follow" : "noindex"
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

            <div className="relative mb-12 w-full">
                <div className="h-32 md:h-64 overflow-hidden rounded-xl" style={{ background: `url(${design?.banner})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    {!design?.banner &&
                        <Image src="/paint.jpg" width={3840 / 2} height={2160 / 2} alt="" />
                    }
                </div>

                <div style={{ backgroundColor: "var(--background-rgb)" }} className="text-lg flex gap-5 items-center absolute bottom-[-44px] md:bottom-[-34px] left-[-6px] md:left-10 py-4 px-5 rounded-tr-3xl md:rounded-3xl">
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
                        value: ""
                    },
                    {
                        name: "Voicetime",
                        value: "voiceminutes"
                    },
                    {
                        name: "Invites",
                        value: "invites"
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
                    <Side guildId={params.guildId} design={design} pagination={pagination} />
                </div>

            </div>

        </div>
    );
}