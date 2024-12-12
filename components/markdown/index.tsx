/* eslint-disable @typescript-eslint/no-unused-vars */

import { Code } from "@nextui-org/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { HiExternalLink } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { getUser } from "@/lib/discord/user";
import { cn } from "@/utils/cn";
import { filterDuplicates } from "@/utils/filter-duplicates";
import { getBaseUrl } from "@/utils/urls";

import Notice, { NoticeType } from "../notice";
import { Separator } from "../ui/separator";
import Channel from "./channel";
import Emoji from "./emoji";
import Timestamp from "./timestamp";
import User from "./user";

const ALLOWED_IFRAMES = [
    "https://www.youtube.com/embed/",
    "https://e.widgetbot.io/channels/",
    getBaseUrl()
] as const;

export default async function BeautifyMarkdown({
    markdown
}: {
    markdown: string;
}) {
    const { renderToString } = await import("react-dom/server");

    async function parseDiscordMarkdown(content: string) {
        const users = await Promise.all(
            filterDuplicates(content.match(/<@!?\d{15,21}>/g) || [])
                .map((match) => match.replace(/<|!|>|@/g, ""))
                .map((userId) => getUser(userId))
        );

        return content
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/<a?:\w{2,32}:\d{15,21}>/g, (match) => {
                const emojiId = match.match(/\d{15,21}/)?.[0] as string;

                return renderToString(<Emoji emojiId={emojiId} />);
            })
            .replace(/<(@!?)\d{15,21}>/g, (match) => {
                const userId = match.replace(/<|!|>|@/g, "");
                const username = users.find((user) => user?.id === userId)?.username || "user";

                return renderToString(<User username={username} />);
            })
            .replace(/<(@&)\d{15,21}>/g, () => {
                return renderToString(<User username="some-role" />);
            })
            .replace(/<(#!?)\d{15,21}>/g, () => {
                return renderToString(<Channel name="some-channel" />);
            })
            .replace(/<t:\d{1,10}:[Rf]?>/g, (match) => {
                const timestamp = match.match(/\d{1,10}/)?.[0] as string;
                const format = match.match(/:\w*?>/)?.[0] || "f";

                return renderToString(
                    <Timestamp
                        unix={parseInt(timestamp)}
                        format={format.slice(1, -1)}
                    />
                );
            });
    }

    function createHId(text: ReactNode) {
        return text
            ?.toString()
            .toLowerCase()
            .replace(/ +/g, "-");
    }

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: (props) => (<>
                    <Link
                        href={`#${createHId(props.children)}`}
                        className="flex mt-10 mb-3 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit"
                    >
                        <h2 id={createHId(props.children)} className="text-3xl font-semibold" {...props} />
                    </Link>
                    <Separator className="mb-3" />
                </>),

                h2: (props) => (<>
                    <Link
                        href={`#${createHId(props.children)}`}
                        className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit"
                    >
                        <h1 id={createHId(props.children)} className="text-2xl font-semibold" {...props} />
                    </Link>
                    <Separator className="mb-3" />
                </>),

                h3: (props) => (
                    <Link
                        href={`#${createHId(props.children)}`}
                        className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit"
                    >
                        <h3 id={createHId(props.children)} className="text-lg font-semibold" {...props} />
                    </Link>
                ),

                strong: (props) => <span className="font-semibold dark:text-neutral-200 text-neutral-800" {...props} />,
                i: (props) => <span className="italic" {...props} />,
                del: (props) => <span className="line-through" {...props} />,
                ins: (props) => <span className="underline" {...props} />,

                // eslint-disable-next-line unused-imports/no-unused-vars
                code: ({ ref, color, ...props }) => {
                    return <Code color="secondary" {...props} />;
                },
                img: ({ alt = "image", ...props }) => {
                    const isFullWidth = props.src?.includes("fullwidth=true");

                    return (
                        <span
                            className={cn(
                                "w-fit flex-col items-center inline",
                                alt === "emoji" ? "inline" : "flex",
                                isFullWidth ? "max-w-3xl" : "max-w-lg"
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt={alt} className="rounded-md" loading="lazy" {...props} />
                            {alt && alt !== "emoji" && <span aria-hidden="true" className="text-neutral-500 font-medium relative bottom-1">{alt}</span>}
                        </span>
                    );
                },
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

                table: (props) => <table className="mt-4 table-auto w-full divide-y-1 divide-wamellow overflow-scroll" {...props} />,
                th: (props) => <th className=" px-2 pb-2 font-medium text-neutral-800 dark:text-neutral-200 text-left" {...props} />,
                tr: (props) => <tr className="divide-x-1 divide-wamellow" {...props} />,
                td: (props) => <td className="px-2 py-1 divide-x-8 divide-wamellow break-all" {...props} />,

                iframe: ({ className, ...props }) => {
                    if (ALLOWED_IFRAMES.some((url) => props.src?.startsWith(url))) {
                        return (
                            <iframe
                                allow="clipboard-write; fullscreen"
                                className={cn(
                                    "w-full rounded-lg mt-4",
                                    className
                                )}
                                {...props}
                            />
                        );
                    }

                    return (
                        <div className="mt-4">
                            <Notice
                                type={NoticeType.Error}
                                message={`Iframe from "${props.src?.split("/")[2]}" is not allowed`}
                            />
                        </div>
                    );
                },

                ol: (props) => <ol className="list-decimal list-inside space-y-1 marker:text-neutral-300/40 my-1" {...props} />,
                ul: (props) => <ul className="list-disc list-inside space-y-1 marker:text-neutral-300/40 my-1" {...props} />,
                p: (props) => <span {...props} />,

                mark: ({ children }) => <Notice type={NoticeType.Info} message={children?.toString() || ""} className="mt-2 mb-0" />

            }}
        >
            {await parseDiscordMarkdown(markdown)}
        </ReactMarkdown>
    );

}