import { Chip, Image } from "@nextui-org/react";
import NextImage from "next/image";
import { notFound } from "next/navigation";

import { getUpload } from "../api";

export interface Props {
    params: { uploadId: string };
}

export const revalidate = 60 * 60;

export default async function Home({
    params
}: Props) {
    const upload = await getUpload(params.uploadId);
    if (!upload || "statusCode" in upload) return notFound();

    return (
        <div className="relative">
            <Image
                alt={upload.prompt}
                as={NextImage}
                className="rounded-lg"
                height={1024}
                isBlurred
                isZoomed
                src={`https://r2.wamellow.com/ai-image/${upload.id}.webp`}
                width={1024}
            />

            <div className="relative md:absolute px-2 md:p-4 bottom-8 md:bottom-0 left-0 z-10 -mb-466md:mb-0">
                <div className="bg-wamellow backdrop-blur-xl backdrop-brightness-50 rounded-lg overflow-hidden shadow-lg p-4">
                    <Chip
                        color="secondary"
                        className="mb-2"
                        variant="flat"
                        size="lg"
                    >
                        {upload.model}
                    </Chip>
                    <div className="text-xl font-medium text-neutral-200">{upload.prompt}</div>
                    <div className="text-medium">{upload.negativePrompt}</div>
                </div>
            </div>
        </div>
    );
}