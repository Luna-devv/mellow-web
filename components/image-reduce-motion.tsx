"use client";
import Image from "next/image";
import { FunctionComponent } from "react";

import { webStore } from "@/common/webstore";

interface Props {
    url: string | null | undefined;
    size: number;
    alt: string;
    className?: string;
    forceStatic?: boolean
}

const ImageReduceMotion: FunctionComponent<Props> = ({ url, size, alt, className, forceStatic }) => {
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
        />
    );

};

export default ImageReduceMotion;