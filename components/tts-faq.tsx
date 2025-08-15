import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { HiExternalLink, HiOutlineHand } from "react-icons/hi";

import { Button } from "./ui/button";

export function TTSFaq() {
    const cookies = useCookies();
    const params = useParams();

    return (
        <Accordion
            className="lg:w-1/2"
            defaultExpandedKeys={["1"]}
            disableAnimation={cookies.get("reduceMotions") === "true"}
        >
            <AccordionItem
                key="1"
                aria-label="how this works"
                title="How this works"
            >
                Users in a voice channel can send messages to this channel, and Wamellow will read them aloud in the voice channel. Please note that Wamellow can only be in one voice channel at a time.

                <iframe
                    className="mt-4 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                    title="Wamellow Text to Speech tutorial"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />

                <Buttons guildId={params.guildId as string} />
            </AccordionItem>
            <AccordionItem
                key="2"
                aria-label="how to blacklist users"
                title="How to blacklist users"
            >
                Blacklist a user using discord channel permissions.

                <iframe
                    className="mt-4 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/KLXm2vdH0ro?si=FyxofeytRb-LAOE6"
                    title="Wamellow restrict Text to Speech access"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />

                <Buttons guildId={params.guildId as string} />
            </AccordionItem>
        </Accordion>
    );
}

function Buttons({ guildId }: { guildId: string; }) {
    return (
        <div className="flex gap-1.5 my-2">
            <DocumentationLink />
            <BlockWordsAndSlursButton guildId={guildId} />
        </div>
    );
}

function DocumentationLink() {
    return (
        <Button
            asChild
            size="sm"
        >
            <Link
                href="/docs/text-to-speech"
                target="_blank"
            >
                Read the documentation
                <HiExternalLink />
            </Link>
        </Button>
    );
}

function BlockWordsAndSlursButton({ guildId }: { guildId: string; }) {
    return (
        <Button
            asChild
            size="sm"
        >
            {/* it causes weird state issues with the pill bar without target="_top */}
            <Link
                href={`/dashboard/${guildId}/moderation`}
                target="_top"
            >
                <HiOutlineHand className="size-4" />
                Block words and slurs
            </Link>
        </Button>
    );
}