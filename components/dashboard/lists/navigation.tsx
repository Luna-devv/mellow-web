"use client";

import Link from "next/link";
import { HiArrowLeft, HiExternalLink } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { Button } from "@/components/ui/button";

interface Props {
    href: `/${string}`;
    docs: `/${string}`;

    avatar?: React.ReactNode;
    name: string;
    icon?: React.ReactNode;
}

export function Navigation({
    href,
    docs,

    avatar,
    name,
    icon
}: Props) {
    const guildId = guildStore((g) => g?.id);

    return (
        <div className="flex items-start justify-between gap-2 relative bottom-2 mb-5 md:mb-3">
            <div className="flex flex-col md:flex-row gap-3">
                <Button
                    asChild
                    size="sm"
                >
                    <Link href={`/dashboard/${guildId}${href}`}>
                        <HiArrowLeft />
                        Back to channels
                    </Link>
                </Button>

                <div className="flex items-center gap-1.5">
                    {avatar}

                    <div className="flex flex-col">
                        <span className="text-xxs -mb-1">
                            Editing:
                        </span>
                        <span className="text-neutral-100 font-medium flex items-center gap-1">
                            {name}
                            {icon &&
                                <span className="relative top-0.5">{icon}</span>
                            }
                        </span>
                    </div>
                </div>
            </div>

            <Button
                asChild
                size="sm"
            >
                <Link href={`/docs${docs}`}>
                    Read the docs & view placeholders
                    <HiExternalLink />
                </Link>
            </Button>
        </div>
    );
}