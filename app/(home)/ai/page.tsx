import { Chip } from "@nextui-org/react";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiUserAdd } from "react-icons/hi";

import { getUploads } from "@/app/ai-gallary/api";
import Notice from "@/components/notice";
import { ServerButton } from "@/components/server-button";
import CommandPic from "@/public/image-command.webp";
import cn from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const montserrat = Montserrat({ subsets: ["latin"] });

export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => {

    const title = "Free /image Ai for Discord";
    const description = "Summon the enchantment of AI generated images to your Discord server with our versatile /image command, featuring over 40+ distinct SD and 10+ SDXL models.";
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
    const uploads = await getUploads();

    const styles = {
        h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-400 font-bold underline decoration-violet-400"),
        h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-semibold")
    };

    return (
        <div className="flex items-center flex-col w-full">

            <div className="flex flex-col gap-4 w-full items-center mb-20">
                <Chip
                    color="secondary"
                    variant="flat"
                    size="lg"
                >
                    <span className="font-semibold text-lg">
                        Free, duh
                    </span>
                </Chip>

                <h1 className={cn(montserrat.className, "lg:text-7xl md:text-6xl text-5xl font-semibold dark:text-neutral-100 text-neutral-900 break-words flex flex-col items-center gap-4")}>
                    <div>
                        <span className="underline decoration-blurple break-keep">Create Artwork</span>
                        {" with "}
                    </div>
                    <div className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Wamellow AI</div>
                </h1>

                <span className="text-lg text-center font-medium max-w-xl mb-4">
                    Create amazing artwork of animies and more or view {"length" in uploads ? uploads.length - 1 : "..."}+ uploads of our free /image Ai models directly within your Discord server.
                </span>

                <div className="flex gap-2 lg:mt-0">
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
            </div>

            <article itemScope itemType="http://schema.org/Article" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
                {Array.isArray(uploads) ?
                    uploads
                        .map((item, i) => (
                            <Link
                                key={item.id + i}
                                className="gap-10 items-center w-full relative max-w-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                                href={`/ai-gallary/${item.id}`}
                            >
                                <Image
                                    alt=""
                                    className="rounded-xl shadow-md w-full mt-2"
                                    height={512}
                                    itemProp="image"
                                    loading="lazy"
                                    src={`https://r2.wamellow.com/ai-image/${item.id}.webp`}
                                    width={512}
                                />
                                <div className="absolute bottom-0 left-0 w-full z-20">
                                    <div className="bg-wamellow backdrop-blur-xl backdrop-brightness-[.25] m-2 p-2 rounded-xl space-y-2">
                                        <Chip
                                            color="secondary"
                                            variant="flat"
                                        >
                                            /image
                                        </Chip>
                                        <h3 className={styles.h3}>{item.model}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))
                    :
                    <Notice message={uploads.message || "Something went wrong..."} />
                }
            </article>

            <Image
                alt="/image command usage"
                className="w-full rounded-md shadow-md"
                height={438}
                src={CommandPic}
                width={1723}
            />

        </div >
    );
}