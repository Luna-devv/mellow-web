import "./markdown.css";
import { cn } from "@/utils/cn";
import * as md from "@odiffey/discord-markdown";

export function DiscordMarkdown({
    text,
    mode,
    embed = true
}: {
    text: string;
    mode: "DARK" | "LIGHT";
    embed?: boolean;
}) {
    const sanitizedHtml = text
        .replaceAll("\\n", "\n")
        .trim();

    return (
        <div
            className={cn("discord-md", mode === "LIGHT" && "discord-md-light")}
            dangerouslySetInnerHTML={{ __html: md.toHTML(sanitizedHtml, { embed }) }}
        />
    );
}