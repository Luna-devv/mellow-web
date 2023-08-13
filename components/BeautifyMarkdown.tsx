import Link from "next/link";
import { FunctionComponent } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";

const BeautifyMarkdown: FunctionComponent<{ markdown: string }> = ({ markdown }) => {

    function parseDiscordMarkdown(content: string) {
        return content
            .replace(/__(.*?)__/g, "<u>$1</u>")
            // .replace(/<a?:\w{2,32}:(.*?)>/g, "<img className='rounded-md' style='height: 1.375em; position: relative' src=\"https://cdn.discordapp.com/emojis/$1.webp?size=40&quality=lossless\" />")
            .replace(/<a?:\w{2,32}:(.*?)>/g, "")
            .replace(/<(@|@!)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>@User</span>")
            .replace(/<(#)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>@Channel</span>");
    }

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: ({ ...props }) => <Link
                    href={`#${props.children.toString().toLowerCase().replace(/ +/g, "-")}`}
                    className="flex mt-10 mb-3 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                >
                    <h2 id={props.children.toString().toLowerCase().replace(/ +/g, "-")} className="text-3xl font-semibold" {...props} />
                </Link>,

                h2: ({ ...props }) => <Link
                    href={`#${props.children.toString().toLowerCase().replace(/ +/g, "-")}`}
                    className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                >
                    <h1 id={props.children.toString().toLowerCase().replace(/ +/g, "-")} className="text-2xl font-semibold" {...props} />
                </Link>,

                strong: ({ ...props }) => <span className="font-semibold dark:text-neutral-200 text-neutral-800" {...props} />,
                i: ({ ...props }) => <span className="italic" {...props} />,
                a: ({ ...props }) => <a className="text-blue-500 hover:underline underline-blue-500" {...props} />,
                del: ({ ...props }) => <span className="line-through" {...props} />,
                ins: ({ ...props }) => <span className="underline" {...props} />,
                li: ({ ...props }) => <div className="flex gap-1 my-1">
                    <span className="mr-1">•</span>
                    <span {...props} />
                </div>
            }}
        >
            {parseDiscordMarkdown(markdown)}
        </ReactMarkdown>
    );

};

export default BeautifyMarkdown;