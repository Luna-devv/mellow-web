import Image from "next/image";
import Link from "next/link";

import Notice from "@/components/notice";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { Badge } from "@/components/ui/badge";
import SadWumpusPic from "@/public/sad-wumpus.gif";

import { getUploads } from "../api";
import { SearchFilter } from "./filter.component";
import Pagination from "./pagination.component";

interface Props {
    searchParams: Promise<{
        page: string;
        model: string;
        nsfw: string;
    }>;
}

export const revalidate = 3600;

export default async function Home({ searchParams }: Props) {
    const { page, model, nsfw } = await searchParams;

    const uploads = await getUploads({
        page: parseInt(page || "1"),
        model: model,
        nsfw: nsfw === "true"
    });

    if ("message" in uploads) {
        return (
            <ScreenMessage
                top="0rem"
                title="Something went wrong on this page.."
                description={uploads.message}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (!uploads.results.length) {
        return <Notice message="No uploads were found for the specified model." />;
    }

    return (<>

        <div className="w-full mb-4 flex justify-between">
            <div
                className="text-lg font-medium mb-2"
            >
                Images that were generated using the /image Ai in discord with Wamellow.
            </div>
            <SearchFilter searchParams={{ page, model, nsfw }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {uploads.results.map((upload) => (
                <Link
                    key={"upload-" + upload.id}
                    className="bg-wamellow rounded-xl shadow-md relative duration-100 outline-violet-500 hover:outline"
                    href={`/ai-gallery/${upload.id}`}
                    target="_blank"
                >
                    <Image
                        alt=""
                        className="rounded-xl"
                        height={300}
                        itemProp="image"
                        loading="lazy"
                        src={`https://r2.wamellow.com/ai-image/${upload.id}.webp`}
                        width={300}
                    />

                    <Badge
                        className="absolute top-2 left-2 z-10 backdrop-blur-xl backdrop-brightness-50"
                        variant="secondary"
                        size="sm"
                    >
                        {upload.model}
                    </Badge>

                    <div className="p-3 flex gap-2">
                        <p className="truncate">
                            {upload.prompt}
                        </p>
                    </div>

                </Link>
            ))}
        </div>

        <Pagination
            key={model}
            searchParams={{ page, model }}
            pages={uploads.pagination.pages}
        />

    </>);
}