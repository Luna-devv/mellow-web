import { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiHome, HiUserAdd } from "react-icons/hi";

import { ClientButton } from "@/components/client";
import Comment from "@/components/comment";
import ImageGrid from "@/components/image-grid";
import { defaultFetchOptions } from "@/lib/api";
import ArrowPic from "@/public/icons/arroww.webp";
import { ApiV1TopguildsGetResponse } from "@/typings";
import cn from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const revalidate = 3600;

export const generateMetadata = (): Metadata => {

    const title = "Pronouns: Describe yourself in Discord";
    const description = "Let your community describe themself with a wide variety of supported Pronouns, Sexualities and Genders.";
    const url = getCanonicalUrl("bot", "pronouns");

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
            images: `${getBaseUrl()}/pronouns-bot.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/pronouns-bot.webp`
        }
    };
};

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as ApiV1TopguildsGetResponse[] | null;

    return (
        <div>

            <div className="lg:text-7xl text-5xl flex font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 break-words w-full">
                <h1 className={montserrat.className}>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Pronouns</span>
                    {" in "}
                    <span className="underline decoration-blurple break-keep">discord</span>
                </h1>
            </div>

            {
                topGuilds &&
                <ImageGrid images={topGuilds
                    .sort((a, b) => b.memberCount - a.memberCount)
                    .map((guild) => ({
                        id: guild.id,
                        url: guild.icon || "/discord.webp",
                        link: getCanonicalUrl("leaderboard", guild.id)
                    }))}
                />
            }

            <div className="md:text-xl text-lg lg:flex w-full mt-4">
                <div className="font-medium w-full grid grid-cols-2 md:flex flex-wrap h-min gap-2">
                    <ClientButton
                        as={Link}
                        href="/bot/pronouns"
                    >
                        <HiHome />
                    </ClientButton>
                    <ClientButton
                        as={Link}
                        href="/bot/pronouns/pronouns"
                    >
                        Pronouns
                    </ClientButton>
                    <ClientButton
                        as={Link}
                        href="/bot/pronouns/genders"
                    >
                        Genders
                    </ClientButton>
                    <ClientButton
                        as={Link}
                        href="/bot/pronouns/sexualities"
                    >
                        Sexualities
                    </ClientButton>
                </div>

                <div className="flex flex-col min-w-full lg:min-w-[420px]">

                    <div className="lg:ml-auto flex gap-2 text-xl font-medium mt-4 lg:mt-0">
                        <ClientButton
                            as={Link}
                            startContent={<HiUserAdd />}
                            className="button-primary w-1/2 lg:w-fit !text-xl !font-medium"
                            href="https://discord.com/oauth2/authorize?client_id=912003493777268767&permissions=8&scope=bot%20applications.commands"
                            size="lg"
                        >
                            <span className="block sm:hidden">Invite</span>
                            <span className="hidden sm:block">Invite Pronouns</span>
                        </ClientButton>
                        <ClientButton
                            as={Link}
                            startContent={<BsDiscord />}
                            className="w-1/2 lg:w-fit !text-xl !font-medium"
                            href="/support"
                            size="lg"
                        >
                            <span className="block sm:hidden">Support</span>
                            <span className="hidden sm:block">Join support</span>
                        </ClientButton>
                    </div>


                    <span className={cn(handwritten.className, "lg:ml-auto flex gap-2 text-neutral-500 font-mediumr mt-3 opacity-80 pl-20 lg:pr-20 rotate-2")}>
                        <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="h-5 w-5 relative top-px" draggable={false} />
                        Get started here in seconds
                    </span>

                </div>

            </div>


            <div className="lg:my-10 my-8 w-full">
                {children}
            </div>

            <Comment
                username="@deleted user"
                bio="Pronouns user"
                avatar="/discord.webp"
                content="I have a lot of friends who have different preferred pronouns and identities and I think it's super sweet y'all have the feature that they can change their pronouns anytime so I put your bot in my servers and a friend may put it in theirs too 🥰"
            />

        </div >
    );
}