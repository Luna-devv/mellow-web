import { Button } from "@nextui-org/react";
import { Metadata } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { HiArrowLeft, HiHome, HiPlus } from "react-icons/hi";

import { Footer } from "@/components/footer";
import Notice from "@/components/notice";
import { ScreenMessage, SupportButton } from "@/components/screen-message";
import { ServerButton } from "@/components/server-button";
import { getPageAnalytics } from "@/lib/analytics";
import { getGuild } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { truncate } from "@/utils/truncate";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import { getUpload, getUploads } from "../api";
import Side from "./side.component";

export interface Props {
    params: { uploadId: string };
    children: React.ReactNode;
}

export const revalidate = 3600;

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const upload = await getUpload(params.uploadId);
    const prompt = "prompt" in upload
        ? truncate(upload.prompt.split(" ").map((str) => str.replace(/^\w/, (char) => char.toUpperCase())).join(" "), 24)
        : null;

    const title = prompt ? `${prompt} - /image Ai` : "Free /image Ai for Discord";
    const description = `Amazing AI generated images ${"model" in upload ? `using the ${upload.model}` : ""}, created using Wamellow's versatile /image command for Discord.`.replace(/ +/g, " ");
    const images = "id" in upload ? `https://r2.wamellow.com/ai-image/${upload.id}.webp` : `${getBaseUrl()}/waya-v3.webp`;
    const url = getCanonicalUrl("ai-gallery", params.uploadId);

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
            images
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images
        }
    };
};

export default async function RootLayout({
    params,
    children
}: Props) {
    const upload = await getUpload(params.uploadId);

    const [guild, uploads, analytics] = await Promise.all([
        "guildId" in upload ? getGuild(upload.guildId) : undefined,
        "model" in upload ? getUploads({ query: upload.prompt, nsfw: upload.nsfw }) : undefined,
        getPageAnalytics("/ai-gallery/" + params.uploadId)
    ]);

    return (
        <div className="w-full space-y-12">

            <div className="md:flex">

                <div className="lg:w-3/4 md:w-2/3 w-full md:mr-6">
                    {"id" in upload ?
                        children
                        :
                        <ScreenMessage
                            top="4rem"
                            title="Something went wrong!"
                            description={upload.message}
                            buttons={<>
                                <ServerButton
                                    as={Link}
                                    href="/"
                                    startContent={<HiHome />}
                                >
                                    Go back to Home
                                </ServerButton>
                                <SupportButton />
                            </>}
                        >
                            <NextImage src={SadWumpusPic} alt="" height={141} width={124} />
                        </ScreenMessage>
                    }
                </div>

                <div className="lg:w-1/4 md:w-1/3 mt-8 md:mt-0">
                    <Side
                        upload={upload}
                        guild={guild}
                        analytics={analytics}
                    />
                </div>

            </div>

            <div>
                <h2 className="text-3xl font-bold mb-4 text-neutral-200">More like this /image</h2>
                <span className="relative bottom-3">
                    Images that are similiar to the one you{"'"}re viewing.
                </span>

                {uploads && "results" in uploads ?
                    <div className="flex flex-wrap gap-4 mt-2">
                        {uploads.results
                            .map((upload) => (
                                <Link
                                    key={upload.id}
                                    className="h-24 w-24"
                                    href={`/ai-gallery/${upload.id}`}
                                >
                                    <NextImage
                                        alt={upload.prompt}
                                        className="rounded-lg"
                                        height={128}
                                        src={`https://r2.wamellow.com/ai-image/${upload.id}.webp`}
                                        width={128}
                                    />
                                </Link>
                            ))}
                        <Link
                            className="h-24 w-24 border-2 dark:border-wamellow border-wamellow-100 p-4 flex justify-center items-center rounded-lg drop-shadow-md overflow-hidden relative duration-100 outline-violet-500 hover:outline"
                            href="/login?invite=true"
                            prefetch={false}
                            target="_blank"
                        >
                            <HiPlus />
                        </Link>
                    </div>
                    :
                    <Notice message={uploads?.message || "Something went wrong..."} />
                }

            </div>

            <Button
                className="!mt-5"
                as={Link}
                href="/ai-gallery"
                startContent={<HiArrowLeft />}
            >
                View all Uploads
            </Button>

            <Footer className="mt-10" />

        </div>
    );
}