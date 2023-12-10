import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";

import DiscordMessage from "@/components/discord/message";

const montserrat = Montserrat({ subsets: ["latin"] });

export default async function Home() {

    const messageProps = (command: string) => {
        return {
            mode: "DARK" as const,
            commandUsed: {
                name: command,
                username: "@mwlica",
                avatar: "/luna.webp",
                bot: false
            },

            user: {
                username: "Pronouns",
                avatar: "/pronouns-bot.webp",
                bot: true
            }
        };
    };

    return (
        <div className="flex flex-col gap-8 my-4">

            <div className="flex flex-col-reverse md:flex-row gap-8 items-center">

                <div className="md:ml-auto md:w-1/2 w-full px-3 pb-3 flex flex-col gap-4">
                    {["pronouns", "sexuality", "gender"].map((type) =>
                        <div className="w-full flex justify-between" key={type}>
                            <DiscordMessage {...messageProps("add " + type)} >
                                <span className="flex items-center gap-1">
                                    <Image src="https://cdn.discordapp.com/emojis/949003338186383491.webp?size=44&quality=lossless" height={24} width={24} alt="" />
                                    You successfully added @She/They as your {type}.
                                </span>
                            </DiscordMessage>
                        </div>
                    )}
                </div>

                <div className="text-left md:w-1/2">
                    <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>It{"'"}s important</h2>
                    <div className="text-lg pt-6">
                        Let your community describe themself with a wide variety of supported Pronouns, Sexualities and Genders.
                        This has become very important in recent years as more and more people finally feel safe to come out publicly as who they really are, and we think this is a great way to express this publicly online.
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Link href="/support" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
                            <HiPlus />
                            Request additional
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}