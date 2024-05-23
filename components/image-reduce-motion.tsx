"use client";
import Image from "next/image";
import { useCookies } from "next-client-cookies";


interface Props {
    url: string | null | undefined;
    size: number;
    alt: string;
    className?: string;
    forceStatic?: boolean
}

export default function ImageReduceMotion({
    url,
    size,
    alt,
    className,
    forceStatic
}: Props) {
    const cookies = useCookies();
    const reduceMotions = cookies.get("reduceMotions") === "true";

    return (
        <Image
            itemProp="image"
            src={!url?.includes("null") && !url?.includes("undefined") && url ? `${url}.${url.includes("a_") && !reduceMotions && !forceStatic ? "gif" : "webp"}?size=${size}` : "/discord.webp"}
            width={size}
            height={size}
            alt={alt}
            className={className}
            loading="lazy"
            draggable={false}
        />
    );

}