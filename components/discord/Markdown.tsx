import React, { FunctionComponent } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";

interface Props {
    text: string;
    mode: "DARK" | "LIGHT";
    discord?: boolean;
}
const Highlight: FunctionComponent<Props> = ({ text, discord = true, mode }) => {
    text = text
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    const plClassName = `${mode === "DARK" ? "bg-wamellow text-neutral-200" : "bg-wamellow-100 text-neutral-800"} border border-violet-400 p-[3px] rounded-lg opacity-80 font-light`;
    const emClassName = "rounded.md";

    function parseDiscordMarkdown(content: string) {
        return content
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/\{(.*?)\.(.*?)\}/g, `<span className='${plClassName}'>$1 $2</span>`)
            .replace(/<a?:\w{2,32}:(.*?)>/g, `<img className='${emClassName}' src="$https://cdn.discordapp.com/emojis/$1.webp?size=40&quality=lossless" />`)
            .replace(/<(@|@!)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md text-neutral-100 font-light text-sx duration-200 cursor-pointer'>@User</span>")
            .replace(/<(#)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md text-neutral-100 font-light text-sx duration-200 cursor-pointer'>@Channel</span>");
    }

    if (!discord) return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            allowedElements={["span", "p"]}
        >
            {parseDiscordMarkdown(text
                .replaceAll("*", "\\*")
                .replaceAll("_", "\\_")
                .replaceAll("~", "\\~")
                .replaceAll("`", "\\`")
            )}
        </ReactMarkdown>
    );

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: ({ ...props }) => <div className="text-3xl font-semibold" {...props} />,
                h2: ({ ...props }) => <div className="text-2xl font-semibold" {...props} />,
                h3: ({ ...props }) => <div className="text-xl font-semibold" {...props} />,
                strong: ({ ...props }) => <span className="font-semibold" {...props} />,
                i: ({ ...props }) => <span className="italic" {...props} />,
                a: ({ ...props }) => <a className="text-blue-500 hover:underline underline-blue-500" {...props} />,
                del: ({ ...props }) => <span className="line-through" {...props} />,
                ins: ({ ...props }) => <span className="underline" {...props} />,
                li: ({ ...props }) => <div>
                    <span className="mr-1">•</span>
                    <span {...props} />
                </div>,
                code({ inline, children, ...props }) {
                    if (!inline) return <div className={`${mode === "DARK" ? "bg-neutral-900" : "bg-neutral-200"} px-4 py-3 text-sm rounded-md min-w-full max-w-full my-2 break-all`}>
                        {children}
                    </div>;

                    return <code {...props} className={`${mode === "DARK" ? "bg-neutral-900 text-neutral-100" : "bg-neutral-200 text-neutral-900"} p-1 text-sm rounded`}>
                        {children}
                    </code>;
                }

            }}
        >
            {parseDiscordMarkdown(text)}
        </ReactMarkdown>
    );


};

export default Highlight;