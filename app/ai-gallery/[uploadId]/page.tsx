import Image from "next/image";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { Badge } from "@/components/ui/badge";

import { getUpload } from "../api";

export interface Props {
    params: Promise<{ uploadId: string; }>;
}

export const revalidate = 3600;

export default async function Home({ params }: Props) {
    const { uploadId } = await params;

    const upload = await getUpload(uploadId);
    if (!upload || "status" in upload) return;

    const src = `https://r2.wamellow.com/ai-image/${upload.id}.webp`;

    return (<>
        <div className="relative">
            <Image
                alt={upload.prompt}
                className="rounded-lg"
                height={1024}
                src={src}
                width={1024}
            />

            <div className="relative md:absolute px-2 md:p-4 bottom-8 md:bottom-0 left-0 z-10 -mb-466md:mb-0">
                <div className="bg-wamellow backdrop-blur-xl backdrop-brightness-50 rounded-lg overflow-hidden shadow-lg p-4">
                    <Badge
                        className="mb-2"
                        variant="secondary"
                        radius="rounded"
                    >
                        {upload.model}
                    </Badge>
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
            Open original file
            <HiExternalLink />
        </Link>

    </>);
}