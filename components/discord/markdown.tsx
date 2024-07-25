"use client";

import React from "react";
import { renderToString } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import cn from "@/utils/cn";

import Channel from "../markdown/channel";
import Emoji from "../markdown/emoji";
import User from "../markdown/user";

interface Props {
    text: string;
    mode: "DARK" | "LIGHT";
    discord?: boolean;
}

export default function Highlight({
    text,
    mode,
    discord = true
}: Props) {

    function parseDiscordMarkdown(content: string) {
        return content
            .replace(/<(?!(?:[@#]|a:|:))/g, "&lt;")
            .replaceAll("\\n", "\n\n")
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/\{(\w*?)\.(\w*?)\}|{ping}/g, (match) => {
                return renderToString(
                    <span
                        className={cn(
                            mode === "DARK" ? "bg-wamellow text-neutral-200" : "bg-wamellow-100 text-neutral-800",
                            "border-1 border-violet-400 px-[3px] rounded-md font-light"
                        )}
                    >
                        {match.slice(1, -1)}
                    </span>
                );
            })
            .replace(/<a?:\w{2,32}:\d{15,21}>/g, (match) => {
                const emojiId = match.match(/\d{15,21}/)?.[0]!;

                return renderToString(<Emoji emojiId={emojiId} />);
            })
            .replace(/<(@[!&]?)\d{15,21}>/g, (match) => {
                return renderToString(<User username={match.includes("&") ? "some-role" : "some-user"} />);
            })
            .replace(/<(#!?)\d{15,21}>/g, () => {
                return renderToString(<Channel name="some-channel" />);
            });
    }

    if (!discord) return (
        <ReactMarkdown
            // @ts-expect-error they broke types
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
            className="break-words"
            // @ts-expect-error inline does exist
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: (props) => <div className="text-3xl font-semibold" {...props} />,
                h2: (props) => <div className="text-2xl font-semibold" {...props} />,
                h3: (props) => <div className="text-xl font-semibold" {...props} />,
                strong: (props) => <span className="font-semibold" {...props} />,
                i: (props) => <span className="italic" {...props} />,
                a: (props) => <a className="text-blue-600 hover:underline underline-blue-500" {...props} />,
                del: (props) => <span className="line-through" {...props} />,
                ins: (props) => <span className="underline" {...props} />,
                li: (props) => (
                    <div>
                        <span className="mr-1">•</span>
                        <span {...props} />
                    </div>
                ),
                code: ({ inline, children, ...props }) => {
                    if (!inline) return (
                        <div
                            className={cn(
                                mode === "DARK" ? "bg-neutral-900" : "bg-neutral-200",
                                "px-4 py-3 text-sm rounded-md min-w-full max-w-full my-2 break-all"
                            )}
                        >
                            {children}
                        </div>
                    );

                    return (
                        <code
                            {...props}
                            className={cn(
                                mode === "DARK" ? "bg-neutral-900 text-neutral-100" : "bg-neutral-200 text-neutral-900",
                                "p-1 text-sm rounded"
                            )}
                        >
                            {children}
                        </code>
                    );
                },
                p: (props) => <p className="mb-4" {...props} />
            }}
        >
            {parseDiscordMarkdown(text)}
        </ReactMarkdown>
    );

}