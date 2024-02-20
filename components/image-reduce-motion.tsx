"use client";
import Image from "next/image";

import { webStore } from "@/common/webstore";

interface Props {
    url: string | null | undefined;
    size: number;
    alt: string;
    className?: string;
    forceStatic?: boolean
}

export default function ImageReduceMotion({ url,
    size,
    alt,
    className,
    forceStatic
}: Props) {
    const web = webStore((w) => w);

    return (
        <Image
            itemProp="image"
            src={!url?.includes("null") && !url?.includes("undefined") && url ? `${url}.${url.includes("a_") && !web.reduceMotions && !forceStatic ? "gif" : "webp"}?size=${size}` : "/discord.webp"}
            width={size}
            height={size}
            alt={alt}
            className={className}
            loading="lazy"
            draggable={false}
        />
    );

}