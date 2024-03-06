import { Chip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import Notice from "@/components/notice";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import SadWumpusPic from "@/public/sad-wumpus.gif";

import { getUploads } from "../api";
import Pagination from "./pagination.component";

interface Props {
    searchParams: { page: string; model: string };
}

export default async function Home({
    searchParams
}: Props) {
    const uploads = await getUploads({ page: parseInt(searchParams.page || "1"), model: searchParams.model });

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
        return (
            <Notice
                message="No uploads were found for the specified model."
            />
        );
    }

    return (
        <>
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
                            height={512}
                            itemProp="image"
                            loading="lazy"
                            src={`https://r2.wamellow.com/ai-image/${upload.id}.webp`}
                            width={512}
                        />

                        <Chip
                            className="absolute top-2 left-2 z-10 backdrop-blur-xl backdrop-brightness-50"
                            color="secondary"
                            size="sm"
                            variant="dot"
                        >
                            {upload.model}
                        </Chip>

                        <div className="p-3 flex gap-2">
                            <p className="truncate">
                                {upload.prompt}
                            </p>
                        </div>

                    </Link>
                ))}
            </div>

            <Pagination
                key={searchParams.model}
                searchParams={searchParams}
                pages={2}
            />

        </>
    );
}