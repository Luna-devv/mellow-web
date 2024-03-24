"use client";

import { Accordion, AccordionItem, Code } from "@nextui-org/react";
import Link from "next/link";
import { HiCash, HiChat, HiExternalLink, HiLockClosed, HiUserAdd } from "react-icons/hi";

import { webStore } from "@/common/webstore";
import cn from "@/utils/cn";

const data = [
    {
        startContent: <HiUserAdd />,
        title: "How do I invite Wamellow to my server?",
        subtitle: "Invite Wamellow to your server to get started!",
        content: (
            <ol className="list-decimal list-inside marker:text-neutral-500">
                <li>
                    Be sure to have the <Code color="secondary">Manage Server</Code> permission on the server you want <LinkTag href="/login?invite=true">invite Wamellow</LinkTag> into.
                </li>
                <li>
                    Open Discord{"'"}s add-bot flow at <LinkTag href="/login?invite=true">wamellow.com/invite</LinkTag>.
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
            </ol >
        )
    },
    {
        startContent: <HiCash />,
        title: "Is the /image Ai or Text to Speech free to use?",
        content: (
            <div>
                Yes, the image Ai and Text to Speech are free to use. However, you might have to <LinkTag href="/vote">vote for Wamellow on top.gg</LinkTag> if you start using it alot.
            </div>
        )
    },
    {
        startContent: <HiChat />,
        title: "How do I set up Chat to Speech TTS?",
        content: (
            <div>

                <ol className="list-decimal list-inside marker:text-neutral-500 mb-4">
                    <li>
                        <LinkTag href="/login?invite=true">Invite Wamellow</LinkTag> to your Server. If you do not own it, ask the server Administrators to add Wamellow.
                    </li>
                    <li>
                        Go to the <LinkTag href="/login?invite=true">Dashboard on wamellow.com/dashboard</LinkTag>, find your server and click {'"'}manage{'"'}.
                    </li>
                    <li>
                        Select a channel to be used in the {'"'}Text to Speech{'"'} section.
                    </li>
                    <li>
                        Join any voice channel in your Server (be sure Wamellow can join it too).
                    </li>
                    <li>
                        Start writing messages in the selected channel for the bot to speak.
                    </li>
                    <li>
                        <span className="font-semibold">Done!</span> 🎉
                    </li>
                </ol>

                You can also watch the video tutorial below or <LinkTag href="https://youtu.be/NS5fZ1ltovE?si=8hE1o6BBELxAxJbH">watch it on YouTube</LinkTag>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
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
        title: "How can I disable a command for a roles or channels?",
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

                        <LinkTag
                            className="mt-4"
                            href="/support"
                        >
                            Need help? Talk with us!
                        </LinkTag>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}


function LinkTag({
    href,
    children,
    className
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Link
            className={cn("text-violet-400 underline decoration-violet-400", className)}
            href={href}
            prefetch={false}
            target="_blank"
        >
            {children}
            <HiExternalLink className="inline ml-1 mb-0.5" />
        </Link>
    );
}