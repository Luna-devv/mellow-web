import { Chip, Image } from "@nextui-org/react";
import NextImage from "next/image";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { getUpload } from "../api";

export interface Props {
    params: Promise<{ uploadId: string; }>;
}

export const revalidate = 3600;

export default async function Home({ params }: Props) {
    const { uploadId } = await params;

    const upload = await getUpload(uploadId);
    if (!upload || "statusCode" in upload) return;

    const src = `https://r2.wamellow.com/ai-image/${upload.id}.webp`;

    return (
        <div>

            <div className="relative">
                <Image
                    alt={upload.prompt}
                    as={NextImage}
                    className="rounded-lg"
                    height={1024}
                    isBlurred
                    isZoomed
                    src={src}
                    width={1024}
                />

                <div className="relative md:absolute px-2 md:p-4 bottom-8 md:bottom-0 left-0 z-10 -mb-466md:mb-0">
                    <div className="bg-wamellow backdrop-blur-xl backdrop-brightness-50 rounded-lg overflow-hidden shadow-lg p-4">
                        <Chip
                            color="secondary"
                            className="mb-2"
                            variant="dot"
                            size="lg"
                        >
                            {upload.model}
                        </Chip>
                        <div className="text-xl font-medium text-neutral-200">{upload.prompt}</div>
                        <div className="text-medium">{upload.negativePrompt}</div>
                    </div>
                </div>
            </div>


            <Link
                className="my-1 z-20 flex items-center gap-1"
                target="_blank"
                href={src}
            >
                <span>Open original file</span>
                <HiExternalLink />
            </Link>

        </div>
    );
}