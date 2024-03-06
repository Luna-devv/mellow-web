"use client";

import { Pagination as UiPagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { getCanonicalUrl } from "@/utils/urls";

export default function Pagination(
    {
        searchParams,
        pages
    }: {
        searchParams: { page: string, model: string };
        pages: number;
    }
) {
    const router = useRouter();

    return (
        <UiPagination
            className="w-full"
            classNames={{ prev: "bg-wamellow", item: "bg-wamellow", next: "bg-wamellow" }}
            color="secondary"
            showControls
            total={pages}
            size="lg"
            page={parseInt(searchParams.page || "0")}
            onChange={(now) => {
                router.push(getCanonicalUrl("ai-gallery", `?page=${now}${searchParams.model ? `&model=${searchParams.model}` : ""}`));
            }}
        />
    );

}