import { Code } from "@nextui-org/react";
import { readFile } from "fs/promises";

import BeautifyMarkdown from "@/components/markdown";
import Notice, { NoticeType } from "@/components/notice";
import metadata from "@/public/docs/meta.json";
import Faq from "@/app/(home)/faq.component";

interface Props {
    params: { pathname: string[] };
}

const PATH = `${process.cwd()}/public/docs` as const;

export default async function Home({ params }: Props) {
    const markdown = await readFile(`${PATH}/${params.pathname.join("/")}.md`, "utf-8");
    const meta = metadata.pages.find((page) => page.file === `${params.pathname.join("/")}.md`);

    return (
        <div>
            {meta?.permissions?.bot &&
                <Notice
                    type={NoticeType.Info}
                    message="Required bot permissions:"
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
        </div>
    );
}