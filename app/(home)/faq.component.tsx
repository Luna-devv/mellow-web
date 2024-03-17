"use client";

import { Accordion, AccordionItem, Code } from "@nextui-org/react";
import Link from "next/link";
import { HiCash, HiChat, HiLockClosed, HiUserAdd } from "react-icons/hi";

import { webStore } from "@/common/webstore";

const data = [
    {
        startContent: <HiUserAdd />,
        title: "How do I invite Wamellow to my server?",
        subtitle: "Invite Wamellow to your server to get started!",
        content: (
            <ol className="list-decimal list-inside marker:text-neutral-500">
                <li>
                    Be sure to have the <Code color="secondary">Manage Server</Code> permission on the server you want  <Link href="/login?invite=true" target="_blank" className="underline decoration-violet-400">invite Wamellow</Link> into.
                </li>
                <li>
                    Open Discord{"'"}s add-bot flow at <Link href="/login?invite=true" target="_blanket" className="text-violet-400">wamellow.com/invite</Link>.
                </li>
                <li>
                    Select a server and click on {'"'}Continue{'"'}.
                </li>
                <li>
                    Do <span className="font-semibold">not uncheck</span> any permissions and click on {'"'}Authorize{'"'}.
                </li>
                <li>
                    <span className="font-semibold">Done!</span> 🎉 You should now find yourself on the Dashboard for your server!
                </li>
            </ol>
        )
    },
    {
        startContent: <HiCash />,
        title: "Is the /image Ai or Text to Speech free to use?",
        content: (
            <div>
                Yes, the image Ai and Text to Speech are free to use. However, you might have to <Link href="/vote" target="_blank" className="text-violet-400 underline decoration-violet-400">vote for Wamellow on top.gg</Link> if you start using it alot.
            </div>
        )
    },
    {
        startContent: <HiChat />,
        title: "How do I set up Chat to Speech (for TTS)?",
        content: (
            <div>
                You can do that on <Link href="/dashboard" target="_blank" className="text-violet-400 underline decoration-violet-400">your server’s Dashboard</Link> on the {'"'}Overview{'"'} page.
                <iframe
                    className="mt-6 aspect-video rounded-lg"
                    width={"100%"}
                    src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                    title="Wamellow Text to Speech tutorial"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiLockClosed />,
        title: "How can I disable XYZ command for X roles or channels?",
        content: (
            <div>
                If you want to disable a command because you don{"'"}t like XYZ feature., you can do so within discord{"'"}s integration settings as shown in the video.
                <iframe
                    className="mt-6 aspect-video rounded-lg"
                    width={"100%"}
                    src="https://c.lunish.nl/r/vkTh6Q.mp4"
                    title="How to disable commands for roles or channels"
                    allow="autoplay; picture-in-picture; web-share"
                />
            </div>
        )
    }
];

export default function Faq() {
    const web = webStore((w) => w);

    return (
        <div className="my-4 w-full">
            <b className="sr-only">Frequently Asked Questions for Wamellow</b>
            <Accordion
                className="rounded-lg overflow-hidden"
                variant="splitted"
                defaultExpandedKeys={["0"]}
                disableAnimation={web.reduceMotions}
            >
                {data.map((item, index) => (
                    <AccordionItem
                        aria-label={item.title}
                        className="!bg-wamellow"
                        classNames={{ content: "mb-2 space-y-4" }}
                        key={index}
                        startContent={item.startContent}
                        subtitle={item.subtitle}
                        title={item.title}
                    >
                        {item.content}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}