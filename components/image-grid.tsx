
import Image from "next/image";

import ImageReduceMotion from "./image-reduce-motion";

interface Props {
    images: {
        id: string;
        url: string;
    }[]
}

export default function ImageGrid({ images }: Props) {
    return (
        <div className="w-full h-52 overflow-hidden rounded-xl">
            <div className="grid grid-flow-col grid-rows-3 w-full md:gap-4 gap-3 rotate-6 relative right-8 bottom-10 md:bottom-20">
                {images.map((image, i) => (
                    <div key={"imageGrid-" + image.id + i} className="relative md:h-32 h-24 md:w-32 w-24 hover:scale-110 duration-200">
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
                    </div>
                ))}

            </div>
        </div>
    );
}