import { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiChevronRight, HiHome, HiUserAdd } from "react-icons/hi";

import ServerGrid from "@/components/guild-grid";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ServerButton } from "@/components/server-button";
import ArrowPic from "@/public/arroww.webp";
import { ApiV1TopguildsGetResponse } from "@/typings";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Pronouns";
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
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1TopguildsGetResponse[];

    return (
        <div className="flex items-center flex-col w-full">

            <div className="lg:text-7xl text-5xl flex font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 break-words w-full">
                <h1 className={montserrat.className}>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Pronouns</span>
                    {" in "}
                    <span className="underline decoration-blurple break-keep">discord</span>
                </h1>
            </div>

            <ServerGrid guilds={topGuilds} />

            <div className="md:text-xl text-lg lg:flex w-full mt-4">
                <div className="font-medium w-full grid grid-cols-2 md:flex flex-wrap h-min gap-2">
                    <ServerButton
                        as={Link}
                        href="/bot/pronouns"
                        isIconOnly
                    >
                        <HiHome />
                    </ServerButton>
                    <ServerButton
                        as={Link}
                        href="/bot/pronouns/pronouns"
                    >
                        Pronouns
                    </ServerButton>
                    <ServerButton
                        as={Link}
                        href="/bot/pronouns/genders"
                    >
                        Genders
                    </ServerButton>
                    <ServerButton
                        as={Link}
                        href="/bot/pronouns/sexualities"
                    >
                        Sexualities
                    </ServerButton>
                </div>

                <div className="flex flex-col min-w-full lg:min-w-[420px]">

                    <div className="lg:ml-auto flex gap-2 text-xl font-medium mt-4 lg:mt-0">
                        <ServerButton
                            as={Link}
                            startContent={<HiUserAdd />}
                            className="button-primary w-1/2 lg:w-fit !text-xl !font-medium"
                            href="https://top.gg/bot/912003493777268767/invite"
                            size="lg"
                        >
                            <span className="block sm:hidden">Invite</span>
                            <span className="hidden sm:block">Invite Wamellow</span>
                        </ServerButton>
                        <ServerButton
                            as={Link}
                            startContent={<BsDiscord />}
                            className="w-1/2 lg:w-fit !text-xl !font-medium"
                            href="/support"
                            size="lg"
                        >
                            <span className="block sm:hidden">Support</span>
                            <span className="hidden sm:block">Join support</span>
                        </ServerButton>
                    </div>


                    <span className={`lg:ml-auto flex gap-2 text-neutral-500 font-mediumr ${handwritten.className} mt-3 opacity-80 pl-20 lg:pr-20 rotate-2`}>
                        <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="h-5 w-5 relative top-px" draggable={false} />
                        Get started here in seconds
                    </span>

                </div>

            </div>


            <div className="lg:my-10 my-8 w-full">
                {children}
            </div>

            <div className="w-full mt-6">
                <div className="flex gap-4 items-center mb-2">
                    <span className="flex items-center gap-2">
                        <ImageReduceMotion url="/discord" size={64} alt="users's profile picture" className="w-12 h-12 rounded-full" />
                        <div>
                            <span className="text-xl font-medium dark:text-neutral-200 text-neutral-800">@deleted user</span> <br />
                            <span className="dark:text-neutral-300 text-neutral-700">Pronouns user</span>
                        </div>
                    </span>
                    <HiChevronRight className="w-8 h-8" />
                </div>
                <span className={`${handwritten.className} text-2xl break-words`}>„{"I have a lot of friends who have different preferred pronouns and identities and I think it's super sweet y'all have the feature that they can change their pronouns anytime so I put your bot in my servers and a friend may put it in theirs too 🥰"}“</span>
            </div>

        </div>
    );
}