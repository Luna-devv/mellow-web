import type { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { HiHome, HiUserAdd } from "react-icons/hi";

import Comment from "@/components/comment";
import ImageGrid from "@/components/image-grid";
import { Button } from "@/components/ui/button";
import { defaultFetchOptions } from "@/lib/api";
import ArrowPic from "@/public/icons/arroww.webp";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
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
    children: React.ReactNode;
}) {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as ApiV1TopguildsGetResponse[] | null;

    return (<>
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
                <Button
                    asChild
                    className="w-1/2 lg:w-fit text-lg"
                >
                    <Link
                        prefetch={false}
                        href="/bot/pronouns"
                    >
                        <HiHome />
                    </Link>
                </Button>
                <Button
                    asChild
                    className="w-1/2 lg:w-fit text-lg"
                >
                    <Link
                        prefetch={false}
                        href="/bot/pronouns/pronouns"
                    >
                        Pronouns
                    </Link>
                </Button>
                <Button
                    asChild
                    className="w-1/2 lg:w-fit text-lg"
                >
                    <Link
                        prefetch={false}
                        href="/bot/pronouns/genders"
                    >
                        Genders
                    </Link>
                </Button>
                <Button
                    asChild
                    className="w-1/2 lg:w-fit text-lg"
                >
                    <Link
                        prefetch={false}
                        href="/bot/pronouns/sexualities"
                    >
                        Sexualities
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col min-w-full lg:min-w-[420px]">

                <div className="lg:ml-auto flex gap-2 text-xl font-medium mt-4 lg:mt-0">
                    <Button
                        asChild
                        className="w-1/2 lg:w-fit text-lg font-medium"
                        variant="secondary"
                    >
                        <Link
                            prefetch={false}
                            href="https://discord.com/oauth2/authorize?client_id=912003493777268767&permissions=8&scope=bot%20applications.commands"
                        >
                            <HiUserAdd />
                            <span className="block sm:hidden">Invite</span>
                            <span className="hidden sm:block">Invite Pronouns</span>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="w-1/2 lg:w-fit text-lg"
                    >
                        <Link
                            prefetch={false}
                            href="/support"
                        >
                            <HiUserAdd />
                            <span className="block sm:hidden">Support</span>
                            <span className="hidden sm:block">Join Support</span>
                        </Link>
                    </Button>
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

    </>);
}