import { Chip } from "@nextui-org/react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { HiCash, HiPlus } from "react-icons/hi";

import Box from "@/components/box";
import DiscordMessage from "@/components/discord/message";
import { ServerButton } from "@/components/server-button";
import cn from "@/utils/cn";

const montserrat = Montserrat({ subsets: ["latin"] });

export default async function Home() {

    const styles = {
        h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-400 font-bold underline decoration-violet-400"),
        h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-semibold")
    };

    const messageProps = (command: string) => {
        return {
            mode: "DARK" as const,
            commandUsed: {
                name: command,
                username: "@mwlica",
                avatar: "/luna-small.webp",
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
        <div>
            <h2 className={styles.h2}>It{"'"}s important for us</h2>
            <div className="my-8 max-w-md font-medium">
                Support diverse identities openly, fostering a safe space for everyone to be their true selves.
            </div>

            <Box className="flex flex-col md:flex-row gap-10 items-center">
                <div className="md:w-1/2">
                    <Chip
                        color="secondary"
                        variant="flat"
                        startContent={<HiCash className="mx-1" />}
                    >
                        <span className="font-semibold">Everything for free</span>
                    </Chip>
                    <h3 className={styles.h3}>Sexualities, Genders & Pronouns</h3>
                    <div className="pt-6">
                        Let your community describe themself with a wide variety of supported Pronouns, Sexualities and Genders.
                        This has become very important in recent years as more and more people finally feel safe to come out publicly as who they really are, and we think this is a great way to express this publicly online.
                    </div>
                    <div className="flex gap-2 mt-6">
                        <ServerButton
                            as={Link}
                            className="bg-wamellow-alpha"
                            startContent={<HiPlus />}
                            href="/support"
                        >
                            Request additional
                        </ServerButton>
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col gap-5" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                    {[["pronouns", "@She/They"], ["sexuality", "lesbian"], ["gender", "transwoman"]].map(([type, name]) =>
                        <div className="w-full" key={"prns-" + type + name}>
                            <DiscordMessage {...messageProps("add " + type)} >
                                <span className="flex items-center gap-1">
                                    <Image src="https://cdn.discordapp.com/emojis/949003338186383491.webp?size=44&quality=lossless" height={24} width={24} alt="" />
                                    You added {name} as your {type}.
                                </span>
                            </DiscordMessage>
                        </div>
                    )}
                </div>
            </Box>

        </div>
    );
}