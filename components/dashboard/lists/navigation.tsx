"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { HiArrowLeft, HiExternalLink } from "react-icons/hi";

import { guildStore } from "@/common/guilds";

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
            <div className="flex flex-col md:flex-row gap-2">
                <Button
                    as={Link}
                    href={`/dashboard/${guildId}${href}`}
                    startContent={<HiArrowLeft />}
                    size="sm"
                >
                    Back to channels
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
                as={Link}
                href={`/docs${docs}`}
                target="_blank"
                endContent={<HiExternalLink />}
                size="sm"
            >
                Read docs & view placeholders
            </Button>
        </div>
    );
}