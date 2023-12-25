"use client";

import { Pagination as UiPagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { userStore } from "@/common/user";
import LoginButton from "@/components/login-button";
import { getCanonicalUrl } from "@/utils/urls";

function Pagination(
    {
        guildId,
        searchParams,
        pages
    }: {
        guildId: string;
        searchParams: { page: string, type: string };
        pages: number;
    }
) {
    const user = userStore((s) => s);
    const router = useRouter();

    if (!user?.__fetched) return <></>;

    if (!user?.id) return (
        <LoginButton
            addClassName="justify-center"
            message="Login to view more"
        />
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
                router.push(getCanonicalUrl("leaderboard", guildId, `?page=${now}${(searchParams.type && searchParams.type !== "messages") ? `&type=${searchParams.type}` : ""}`));
            }}
        />
    );

}

export default Pagination;