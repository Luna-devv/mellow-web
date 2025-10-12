import Link from "next/link";
import { useParams } from "next/navigation";
import { HiExternalLink, HiOutlineHand } from "react-icons/hi";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Anchor, Code } from "./ui/typography";

export function TTSFaq() {
    const params = useParams();

    return (
        <Accordion
            type="single"
            collapsible
            className="lg:w-1/2"
            defaultValue="1"
        >
            <AccordionItem value="1">
                <AccordionTrigger>Introduction</AccordionTrigger>
                <AccordionContent>
                    Users in a voice channel can send messages to this channel, and Wamellow will read them aloud in the voice channel. Please note that Wamellow can only be in one voice channel at a time.

                    <iframe
                        className="mt-4 aspect-video rounded-lg"
                        width="100%"
                        src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                        title="Wamellow Text to Speech tutorial"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />

                    <div className="flex gap-1.5 my-2">
                        <DocumentationLink />
                        <BlockWordsAndSlursButton guildId={params.guildId as string} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
                <AccordionTrigger>Change Voice and Language</AccordionTrigger>
                <AccordionContent className="space-y-3">
                    <p>
                        You can change your default voice <Anchor href="/profile/text-to-speech">in your personal settings</Anchor> or by running <Code>/tts set speaker</Code>.
                    </p>
                    <p>
                        If you only want to change the voice for a specific message, you can run <Code>/tts voice</Code> and provide the <Code>voice</Code> argument.
                    </p>
                    <p>
                        All available voices and languages are listed in the documentation. The language you choose will only affect messages you send.
                    </p>

                    <DocumentationLink />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
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