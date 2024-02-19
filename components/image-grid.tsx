import Image from "next/image";
import Link from "next/link";

import { toFixedArrayLength } from "@/utils/fixed-array-length";

import ImageReduceMotion from "./image-reduce-motion";

interface Props {
    images: {
        id: string;
        url: string;
        link?: string;
    }[]
}

export default function ImageGrid({ images }: Props) {
    return (
        <div className="w-full h-52 overflow-hidden rounded-xl bg-wamellow shadow-xl">
            <div className="grid grid-flow-col grid-rows-3 w-full md:gap-4 gap-3 rotate-3 relative right-8 bottom-10 md:bottom-20">
                {toFixedArrayLength(images, 26).map((image, i) => (
                    <Container
                        key={"imageGrid-" + image.id + i}
                        className="relative md:h-32 h-24 md:w-32 w-24 hover:scale-110 duration-200"
                        href={image.link}
                    >
                        {image.url.includes("discordapp.net")
                            ?
                            <ImageReduceMotion
                                alt="server"
                                className="rounded-xl"
                                url={image.url?.split(".").slice(0, -1).join(".")}
                                size={128}
                            />
                            :
                            <Image
                                alt="image"
                                className="rounded-xl"
                                height={128}
                                itemProp="image"
                                loading="lazy"
                                src={image.url}
                                width={128}
                            />
                        }
                    </Container>
                ))}

            </div>
        </div>
    );
}

function Container({
    children,
    className,
    href
}: {
    children: React.ReactNode;
    className: string;
    href?: string;
}) {

    if (!href) {
        return (
            <div className={className}>
                {children}
            </div>
        );

    }

    return (
        <Link
            className={className}
            href={href}
        >
            {children}
        </Link>
    );

}