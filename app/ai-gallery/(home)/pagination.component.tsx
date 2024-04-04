"use client";

import { Pagination as UiPagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
                const params = new URLSearchParams(searchParams);
                params.delete("page");
                params.append("page", now.toString());

                router.push(`?${params.toString()}`, { scroll: false });
            }}
        />
    );

}