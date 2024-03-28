import { Code } from "@nextui-org/react";
import { readFile } from "fs/promises";
import Image from "next/image";

import BeautifyMarkdown from "@/components/markdown";
import Notice, { NoticeType } from "@/components/notice";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import metadata from "@/public/docs/meta.json";
import SadWumpusPic from "@/public/sad-wumpus.gif";

interface Props {
    params: { pathname: string[] };
}

const PATH = `${process.cwd()}/public/docs` as const;

export default async function Home({ params }: Props) {
    const markdown = await readFile(`${PATH}/${params.pathname.join("/").toLowerCase()}.md`, "utf-8").catch(() => null);
    const meta = metadata.pages.find((page) => page.file === `${params.pathname.join("/").toLowerCase()}.md`);

    if (!markdown || !meta) {
        return (
            <ScreenMessage
                top="0rem"
                title="Sadly, this page can not be found.."
                description="Seems like you got a little lost here? Here's wumpus for now!"
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

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
        </div>
    );
}