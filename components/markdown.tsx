/* eslint-disable @typescript-eslint/no-unused-vars */
import { Code } from "@nextui-org/react";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import cn from "@/utils/cn";

export default function BeautifyMarkdown({
    markdown
}: {
    markdown: string
}) {

    function parseDiscordMarkdown(content: string) {
        return content
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/<a?:\w{2,32}:(.*?)>/g, "<img alt='emoji' className='rounded-md inline' style='height: 1.375em; position: relative' src='https://cdn.discordapp.com/emojis/$1.webp?size=40&quality=lossless' />")
            .replace(/<(@!?)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>@user</span>")
            .replace(/<(#!?)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>@channel</span>");
    }

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: (props) => (
                    <Link
                        href={`#${props.children?.toString().toLowerCase().replace(/ +/g, "-")}`}
                        className="flex mt-10 mb-3 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                    >
                        <h2 id={props.children?.toString().toLowerCase().replace(/ +/g, "-")} className="text-3xl font-semibold" {...props} />
                    </Link>
                ),

                h2: (props) => (
                    <Link
                        href={`#${props.children?.toString().toLowerCase().replace(/ +/g, "-")}`}
                        className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                    >
                        <h1 id={props.children?.toString().toLowerCase().replace(/ +/g, "-")} className="text-2xl font-semibold" {...props} />
                    </Link>
                ),

                h3: (props) => (
                    <Link
                        href={`#${props.children?.toString().toLowerCase().replace(/ +/g, "-")}`}
                        className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                    >
                        <h3 id={props.children?.toString().toLowerCase().replace(/ +/g, "-")} className="text-xl font-semibold" {...props} />
                    </Link>
                ),

                strong: (props) => <span className="font-semibold dark:text-neutral-200 text-neutral-800" {...props} />,
                i: (props) => <span className="italic" {...props} />,
                del: (props) => <span className="line-through" {...props} />,
                ins: (props) => <span className="underline" {...props} />,

                // @ts-expect-error inline does exist
                code: ({ inline, ref, color, ...props }) => {
                    if (inline) return <Code color="secondary" {...props} />;

                    return (
                        <div
                            className="bg-wamellow border border-wamellow-light text-neutral-200 rounded-md p-3 my-2 break-all"
                            {...props}
                        />
                    );
                },
                img: ({ alt = "image", ...props }) => (
                    <span
                        className={cn(
                            "max-w-lg w-fit flex-col items-center inline",
                            alt === "emoji" ? "inline" : "flex"
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={alt} className="rounded-md" loading="lazy" {...props} />
                        {alt && alt !== "emoji" && <span className="text-neutral-500 font-medium relative bottom-1">{alt}</span>}
                    </span>
                ),
                a: ({ href, children, ...props }) => (
                    <Link
                        href={href || "#"}
                        target="_blank"
                        className="text-violet-400 hover:underline"
                        {...props}
                    >
                        {children} <HiExternalLink className="inline" />
                    </Link>
                ),

                // @ts-expect-error isHeader does exist
                table: ({ isHeader, ...props }) => <table className="mt-4 table-auto w-full divide-y-1 divide-wamellow overflow-scroll" {...props} />,
                // @ts-expect-error isHeader does exist
                th: ({ isHeader, ...props }) => <th className=" px-2 pb-2 font-medium text-neutral-800 dark:text-neutral-200 text-left" {...props} />,
                // @ts-expect-error isHeader does exist
                tr: ({ isHeader, ...props }) => <tr className="divide-x-1 divide-wamellow" {...props} />,
                // @ts-expect-error isHeader does exist
                td: ({ isHeader, ...props }) => <td className="px-2 py-1 divide-x-8 divide-wamellow break-all" {...props} />,

                // @ts-expect-error ordered does exist
                ol: ({ ordered, ...props }) => (
                    <div className="list-decimal list-inside marker:text-neutral-300/40 my-1">
                        <span
                            className="space-y-1"
                            {...props}
                        />
                    </div>
                ),
                // @ts-expect-error ordered does exist
                ul: ({ ordered, ...props }) => (
                    <div className="list-disc list-inside marker:text-neutral-300/40 my-1">
                        <span
                            className="space-y-1"
                            {...props}
                        />
                    </div>
                )
            }}
        >
            {parseDiscordMarkdown(markdown)}
        </ReactMarkdown>
    );

}