"use client";

import { Accordion, AccordionItem, Code } from "@nextui-org/react";
import { useCookies } from "next-client-cookies";
import { HiCash, HiChat, HiLockClosed, HiUser, HiUserAdd } from "react-icons/hi";

import DiscordAppBadge from "@/components/discord/app-badge";
import LinkTag from "@/components/link-tag";
import { Section } from "@/components/section";

const data = [
    {
        startContent: <HiUserAdd />,
        title: "How do I invite Wamellow to my Server?",
        subtitle: "Invite Wamellow to your server to get started!",
        content: (
            <ol className="list-decimal list-inside marker:text-neutral-500">
                <li>
                    Be sure to have the <Code color="secondary">Manage Server</Code> permission on the server you want <LinkTag href="/login?invite=true">invite Wamellow</LinkTag> into.
                </li>
                <li>
                    Open Discord{"'"}s add-app flow at <LinkTag href="/login?invite=true">wamellow.com/invite</LinkTag>.
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
                Yes, the image Ai and Text to Speech are free to use. However, you might have to <LinkTag href="/vote">vote for Wamellow on top.gg</LinkTag> if you start using it a lot.
            </div>
        )
    },
    {
        startContent: <HiChat />,
        title: "How do I set up Chat to Speech (TTS)?",
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
                        Start writing messages in the selected channel for the app to speak.
                    </li>
                    <li>
                        <span className="font-semibold">Done!</span> 🎉
                    </li>
                </ol>

                You can also watch the video tutorial below or <LinkTag href="https://youtu.be/NS5fZ1ltovE?si=8hE1o6BBELxAxJbH">watch it on YouTube</LinkTag>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                    title="Wamellow Text to Speech tutorial"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiLockClosed />,
        title: "How do I disable a command for roles or channels?",
        content: (
            <div>
                <ol className="list-decimal list-inside marker:text-neutral-500 mb-4">
                    <li>
                        In the Discord App, click on your servers&apos; name and click {'"'}Settings{'"'}
                    </li>
                    <li>
                        Then go to the tab {'"'}Integrations{'"'} in the {'"'}Apps{'"'} category.
                    </li>
                    <li>
                        In the {'"'}Bots and Apps{'"'} list, find Wamellow and click on {'"'}Manage{'"'}.
                    </li>
                    <li>
                        You can choose to disable commands for everyone by their roles, or only in certain channels.
                    </li>
                    <li>
                        <span className="font-semibold">Done!</span> 🎉
                    </li>
                </ol>

                You can also watch the video tutorial below or <LinkTag href="https://youtu.be/ehc0_whydu8?si=8hE1o6BBELxAxJbH">watch it on YouTube</LinkTag>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/ehc0_whydu8?si=uODiGspuNGKPRQKp"
                    title="How to disable slash commands from bots and apps in discord"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiUser />,
        title: "What's a 'Discord App', and what's the difference to a Bot?",
        content: (
            <div>
                Discord recently renamed <DiscordAppBadge>BOT</DiscordAppBadge>s to <DiscordAppBadge />s, meaning that there is no difference between them.
            </div>
        )
    }
];

interface Props {
    showTitle?: boolean;
}

export function Faq({
    showTitle = false
}: Props) {
    const cookies = useCookies();

    return (
        <div className="my-4 w-full">

            {showTitle
                ?
                <Section
                    className="mb-4"
                    title="Frequently Asked Questions about Wamellow"
                >
                    Commonly asked questions about Wamellow and how to use it.
                </Section>
                :
                <b className="sr-only">
                    Frequently Asked Questions for Wamellow
                </b>
            }

            <Accordion
                className="rounded-lg overflow-hidden"
                variant="splitted"
                defaultExpandedKeys={["0"]}
                disableAnimation={cookies.get("reduceMotions") === "true"}
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

                        <div className="h-2" />

                        <LinkTag
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