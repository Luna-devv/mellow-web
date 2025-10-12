"use client";

import { LoginButton } from "@/components/login-button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

interface Props {
    searchParams: {
        page: string;
        type: string;
    };
    pages: number;
}

export default function PaginationComponent({ searchParams, pages }: Props) {
    const cookies = useCookies();
    const router = useRouter();

    const currentPage = Number.parseInt(searchParams.page || "1", 10);

    const navigateToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.delete("page");
        params.append("page", page.toString());
        router.push(`?${params.toString()}`, { scroll: true });
    };

    if (!cookies.get("session")) return (
        <LoginButton message="Login to view more"/>
    );

    return (
        <Pagination >
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage <= 1) return;
                            navigateToPage(currentPage - 1);
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                <PaginationButtons
                    currentPage={currentPage}
                    pages={pages}
                    navigateToPage={navigateToPage}
                />
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage >= pages) return;
                            navigateToPage(currentPage + 1);
                        }}
                        className={currentPage >= pages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

function PaginationButtons({
    currentPage,
    pages,
    navigateToPage
}: {
    currentPage: number;
    pages: number;
    navigateToPage: (page: number) => void;
}) {
    const items = [];
    const showEllipsis = pages > 7;

    if (showEllipsis) {
        // Show first page
        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigateToPage(1);
                    }}
                    isActive={currentPage === 1}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // Show ellipsis if current page is far from start
        if (currentPage > 4) {
            items.push(
                <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(pages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateToPage(i);
                        }}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Show ellipsis if current page is far from end
        if (currentPage < pages - 3) {
            items.push(
                <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Show last page
        if (pages > 1) {
            items.push(
                <PaginationItem key={pages}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateToPage(pages);
                        }}
                        isActive={currentPage === pages}
                    >
                        {pages}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    } else {
        // Show all pages if total is small
        for (let i = 1; i <= pages; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateToPage(i);
                        }}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    }

    return items;
}