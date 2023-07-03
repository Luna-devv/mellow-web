import React, { FunctionComponent } from "react";

interface Props {
    children: React.ReactNode;

    title?: string;
    color: number;
    thumbnail?: string;
    image?: string;
    footer?: {
        icon_url?: string;
        text: string;
    }
}

const DiscordMessageEmbed: FunctionComponent<Props> = ({ children, title, color, thumbnail, image, footer }) => {

    return (
        <div className="w-full text-neutral-200 font-light p-3 rounded border-l-4 mt-1" style={{ backgroundColor: "rgb(43, 45, 49)", borderLeftColor: `#${color?.toString(16)}` }}>

            <div className="flex">
                <div className={thumbnail && "mr-6"}>
                    {title && <div className="text-neutral-100 font-semibold text-base mb-2">{title}</div>}
                    {children}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {thumbnail && <img src={thumbnail} alt="" className="ml-auto h-20 w-20 rounded-md" />}
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            {image && <img src={image} alt="" className="ml-auto rounded-md h-full w-full mt-4" />}

            {footer?.text &&
                <div className="flex gap-1 items-center mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {footer.icon_url && <img src={footer.icon_url} alt="" className="rounded-full h-5 w-5" />}
                    <span className="text-xs">{footer.text}</span>
                </div>
            }

        </div>
    );
};

export default DiscordMessageEmbed;