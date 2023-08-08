"use client";
import Image from "next/image";
import { FunctionComponent } from "react";

import { webStore } from "@/common/webstore";

const ImageReduceMotion: FunctionComponent<{ url: string; size: number; alt: string; className: string }> = ({ url, size, alt, className }) => {
    const web = webStore((w) => w);

    return <Image itemProp="image" src={!url.includes("null") ? `${url}.${url.includes("a_") && !web.reduceMotions ? "gif" : "webp"}?size=${size}` : "/discord.png"} width={size} height={size} alt={alt} className={className} />;
};

export default ImageReduceMotion;