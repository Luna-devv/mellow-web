import { Chip } from "@nextui-org/react";
import { Metadata } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { HiHome, HiPlus } from "react-icons/hi";

import Footer from "@/components/footer";
import Notice from "@/components/notice";
import { ScreenMessage, SupportButton } from "@/components/screen-message";
import { ServerButton } from "@/components/server-button";
import { getGuild } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import { getUpload, getUploads } from "../api";
import Side from "./side.component";

export interface Props {
    params: { uploadId: string };
    children: React.ReactNode;
}

export const revalidate = 60 * 60;

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const upload = await getUpload(params.uploadId);

    const title = "Free /image Ai for Discord";
    const description = `View an amazing AI generated image ${"model" in upload ? `using the ${upload.model}` : ""} created with our versatile /image command. ${"prompt" in upload ? `Using the prompt: ${upload.prompt}` : ""}`.replace("  ", " ");
    const images = "id" in upload ? `https://r2.wamellow.com/ai-image/${upload.id}.webp` : `${getBaseUrl()}/waya-v3.jpg`;
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
    const guild = "guildId" in upload ? await getGuild(upload.guildId) : undefined;
    const uploads = "model" in upload ? await getUploads({ model: upload.model }) : undefined;

    return (
        <div className="w-full space-y-12">

            <div className="md:flex">

                <div className="md:w-3/4 md:mr-6">
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

                <div className="md:w-1/4 mt-8 md:mt-0">
                    <Side
                        upload={upload}
                        guild={guild}
                    />
                </div>

            </div>

            <div>
                <h2 className="text-3xl font-bold mb-4 text-neutral-200">More like this /image</h2>
                <span className="relative bottom-4 mb-4">
                    Images that were also generated with the <Chip>{"model" in upload ? upload.model : "..."}</Chip> model.
                </span>
                {Array.isArray(uploads) ?
                    <div className="flex flex-wrap gap-4">
                        {uploads
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
                            href="/login?invite=true"
                            target="_blank"
                            className="h-24 w-24 border-2 dark:border-wamellow border-wamellow-100 p-4 flex justify-center items-center rounded-lg drop-shadow-md overflow-hidden relative duration-100 outline-violet-500 hover:outline"
                        >
                            <HiPlus />
                        </Link>
                    </div>
                    :
                    <Notice message={uploads?.message || "Something went wrong..."} />
                }
            </div>

            <Footer className="mt-10" />

        </div>
    );
}