import { Code } from "@nextui-org/react";
import { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiChevronRight, HiLightningBolt, HiUserAdd } from "react-icons/hi";

import Badge from "@/components/badge";
import ImageGrid from "@/components/image-grid";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ServerButton } from "@/components/server-button";
import ArrowPic from "@/public/arroww.webp";
import { ApiV1AiResponse } from "@/typings";
import cn from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const revalidate = 3600;

const fetchOptions = { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } };

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Supercharged Ai";
    const description = "Unlock complimentary access to a variety of free image generation models directly within your Discord server.";
    const url = getCanonicalUrl("ai");

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
    const models = await fetch(`${process.env.NEXT_PUBLIC_API}/ai`, fetchOptions).then((res) => res.json()) as ApiV1AiResponse[];

    const styles = {
        h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-400 font-bold underline decoration-violet-400"),
        h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-semibold")
    };

    return (
        <div className="flex items-center flex-col w-full">

            <div className="md:text-5xl text-4xl font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 flex gap-2 w-full">
                <h1 className={montserrat.className}>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep">Supercharged Ai</span>
                </h1>
                <HiLightningBolt className="text-pink-400 rotate-6" />
                <Badge text="Free" />
            </div>

            {models && <ImageGrid images={models.slice(0, 24).map((model) => ({ id: model.title, url: model.url || "/discord.webp" }))} />}

            <div className="md:text-xl text-lg lg:flex w-full mt-4">
                <span className="font-medium">
                    Unlock complimentary access to a variety of free image generation models directly within your Discord server. Powered by LuxuryLabs.
                </span>

                <div className="flex flex-col min-w-full lg:min-w-[420px]">

                    <div className="lg:ml-auto flex gap-2 mt-4 lg:mt-0">
                        <ServerButton
                            as={Link}
                            startContent={<HiUserAdd />}
                            className="w-1/2 lg:w-fit !text-xl !font-medium"
                            color="secondary"
                            href="/login?invite=true"
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

            <div className="lg:mt-14 mt-10" />

            <div className="w-full">
                <h2 className={styles.h2}>/image command</h2>
                <div className="my-8 max-w-2xl font-medium">
                    We recommend that you play around with each model yourself as this page uses the same query for everything, even non-anime models.
                    <br />
                    <br />
                    <Code className="select-all">query: anime girl, close up, intricate details, dramatic lighting, bloom, highly detailed, micro details</Code>
                    <Code className="select-all">negative-query: (poorly drawn face)++, (dark skin, tan skin)++, (character out of frame)1.3, bad quality, low-res, (monochrome)1.1, (grayscale)1.3, acne, skin blemishes, bad anatomy, text, error, missing fingers, extra limbs, missing limbs, cut off</Code>
                </div>
            </div>

            <article itemScope itemType="http://schema.org/Article" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">

                {models.map((item, i) => (
                    <div key={item.title + i} className="gap-10 items-center w-full relative max-w-lg hover:scale-105 duration-200">
                        <Image
                            alt=""
                            className="rounded-xl shadow-md w-full mt-2"
                            height={512}
                            itemProp="image"
                            loading="lazy"
                            src={item.url}
                            width={512}
                        />
                        <div className="absolute bottom-0 left-0 w-full">
                            <div className="bg-wamellow/80 backdrop-blur-md m-2 p-2 rounded-xl">
                                <h3 className={styles.h3}>{item.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </article>

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
                <span className={`${handwritten.className} text-2xl break-words block mt-2`}>„WHY IS THERE A TRAIN LMFAO“</span>
            </div>

        </div>
    );
}