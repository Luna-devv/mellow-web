"use client";

import { Accordion, AccordionItem, Code } from "@nextui-org/react";
import Link from "next/link";

import { webStore } from "@/common/webstore";

const data = [
    {
        title: "How do I invite Wamellow to my server?",
        subtitle: "Invite Wamellow to your server to get started!",
        content: (
            <ol className="list-decimal list-inside marker:text-neutral-500">
                <li>
                    Be sure to have the <Code color="secondary">Manage Server</Code> permission on the server you want to  <Link href="/login?invite=true" target="_blanket" className="text-violet-400">invite Wamellow</Link> to.
                </li>
                <li>
                    Open Discord{"'"}s add-bot flow at <Link href="/login?invite=true" target="_blanket" className="text-violet-400">wamellow.com/invite</Link>.
                </li>
                <li>
                    Select a server and click on {'"'}Continue{'"'}
                </li>
                <li>
                    Do <span className="font-semibold">not uncheck</span> any permissions and click on {'"'}Authorize{'"'}
                </li>
                <li>
                    <span className="font-semibold">Done!</span> 🎉 Wamellow should now find yourself on the Dashboard for your server!
                </li>
            </ol>
        )
    }
];

export default function Faq() {
    const web = webStore((w) => w);

    return (
        <Accordion
            className="bg-wamellow border-none rounded-lg overflow-hidden"
            variant="shadow"
            selectionMode="multiple"
            defaultExpandedKeys={["1"]}
            disableAnimation={web.reduceMotions}
        >
            {data.map((item, index) => (
                <AccordionItem
                    key={index}
                    aria-label={item.title}
                    title={item.title}
                    classNames={{ content: "mb-2 space-y-4" }}
                    subtitle={item.subtitle}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </Accordion>
    );
}