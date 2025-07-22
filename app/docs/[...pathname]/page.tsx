import { Code } from "@nextui-org/react";
import { readFile } from "fs/promises";

import { Faq } from "@/app/(home)/faq.component";
import BeautifyMarkdown from "@/components/markdown";
import Notice, { NoticeType } from "@/components/notice";
import { ScreenMessage } from "@/components/screen-message";
import metadata from "@/public/docs/meta.json";

interface Props {
    params: Promise<{ pathname: string[]; }>;
}

const PATH = `${process.cwd()}/public/docs` as const;

export default async function Home({ params }: Props) {
    const { pathname } = await params;
    const markdown = await readFile(`${PATH}/${pathname.join("/").toLowerCase()}.md`, "utf-8").catch(() => null);
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    if (!markdown || !meta) {
        return (
            <ScreenMessage
                top="6rem"
                title="Sadly, this page can not be found.."
                description="Seems like you got a little lost here? Here's wumpus for now!"
            />
        );
    }

    return (
        <article
            itemType="http://schema.org/Article"
            className="w-full lg:w-3/4"
        >
            {meta?.permissions?.bot &&
                <Notice
                    type={NoticeType.Info}
                    message="Wamellow requries permission:"
                    location="bottom"
                >
                    <div className="flex flex-wrap gap-1">
                        {meta.permissions.bot.map((perm) => (
                            <Code
                                key={perm}
                                className="font-semibold text-violet-400"
                                color="secondary"
                            >
                                {perm}
                            </Code>
                        ))}
                    </div>
                </Notice>
            }

            <BeautifyMarkdown markdown={markdown} />

            <div className="h-16" />

            <Faq showTitle />
        </article>
    );
}