"use client";

import { Pagination as UiPagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

import { LoginButton } from "@/components/login-button";

interface Props {
    searchParams: {
        page: string;
        type: string;
    };
    pages: number;
}

export default function Pagination({ searchParams, pages }: Props) {
    const cookies = useCookies();
    const router = useRouter();

    if (!cookies.get("session")) return (
        <LoginButton message="Login to view more"/>
    );

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