import { Accordion, AccordionItem } from "@nextui-org/react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { Button } from "./ui/button";

export function TTSFaq() {
    const cookies = useCookies();

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

                <Button
                    asChild
                    className="my-2"
                    size="sm"
                >
                    <Link
                        className="flex items-center"
                        href="/docs/text-to-speech"
                        target="_blank"
                    >
                        Read the documentation
                        <HiExternalLink />
                    </Link>
                </Button>
            </AccordionItem>
            <AccordionItem
                key="2"
                aria-label="how to blacklist users"
                title="How to blacklist users"
            >
                Blacklist a user using discord channel permissions.

                <Link
                    href="https://cdn.waya.one/r/YcU2CC.gif"
                    target="_blank"
                >
                    <Image
                        alt="blacklist a user with discord channel permissions"
                        className="mt-4 rounded-md"
                        height={945 / 2}
                        src="https://cdn.waya.one/r/YcU2CC.gif"
                        width={1040 / 2}
                    />
                </Link>
            </AccordionItem>
        </Accordion>
    );
}