import { Code } from "@nextui-org/react";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiArrowRight, HiBadgeCheck, HiCash, HiChevronRight, HiFingerPrint, HiFire, HiHashtag, HiInformationCircle, HiLockOpen, HiUserAdd } from "react-icons/hi";

import Badge from "@/components/badge";
import Box from "@/components/box";
import { StatsBar } from "@/components/counter";
import DiscordChannelCategory from "@/components/discord/channel-category";
import DiscordChannelVoice from "@/components/discord/channel-voice";
import Highlight from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import DiscordUser from "@/components/discord/user";
import ImageGrid from "@/components/image-grid";
import { ServerButton } from "@/components/server-button";
import AiPic from "@/public/ai.webp";
import ArrowPic from "@/public/arroww.webp";
import CaptchaPic from "@/public/captcha.webp";
import LeaderboardPic from "@/public/leaderboard.webp";
import SpacePic from "@/public/space.webp";
import WaifuPic from "@/public/waifu.webp";
import WelcomePic from "@/public/welcome.webp";
import { ApiV1StatisticsGetResponse, ApiV1TopguildsGetResponse } from "@/typings";
import cn from "@/utils/cn";
import { convertMonthToName } from "@/utils/time";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const revalidate = 3600;

const fetchOptions = { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } };

interface Commands {
    name: string;
    description: string;
    uses: number;
}

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, fetchOptions).then((res) => res.json()).catch(() => null) as ApiV1TopguildsGetResponse[] | null;
    const stats = await fetch(`${process.env.NEXT_PUBLIC_API}/statistics`, fetchOptions).then((res) => res.json()).catch(() => null) as ApiV1StatisticsGetResponse | null;
    const commands = await fetch(`${process.env.NEXT_PUBLIC_API}/commands`, fetchOptions).then((res) => res.json()).catch(() => ([])) as Commands[];

    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    const styles = {
        h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-400 font-bold underline decoration-violet-400"),
        h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-semibold")
    };

    const messageProps = (command?: string) => {
        return {
            mode: "DARK" as const,
            commandUsed: command ? {
                name: command,
                username: "@mwlica",
                avatar: "/luna-small.webp",
                bot: false
            } : undefined,

            user: {
                username: "Wamellow",
                avatar: "/waya-v3-small.webp",
                bot: true
            }
        } as const;
    };

    const Invite = () => (
        <ServerButton
            as={Link}
            startContent={<HiUserAdd />}
            href="/login?invite=true"
            color="secondary"
        >
            <span className="block sm:hidden">Invite</span>
            <span className="hidden sm:block">Invite Wamellow</span>
        </ServerButton>
    );

    return (
        <div className="flex items-center flex-col w-full">

            <div className="lg:text-7xl text-5xl flex font-semibold md:mb-6 mb-4 dark:text-neutral-100 text-neutral-900 break-words w-full">
                <h1 className={montserrat.className}>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next-gen</span>
                    {" of "}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                <div
                    className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent font-medium text-2xl relative right-2 rotate-12 select-none sm:block hidden"
                    style={{ animation: "ScaleBlink 1s ease-in-out infinite" }}
                >
                    {uwus[Math.floor(Math.random() * uwus.length)]}
                </div>
            </div>

            {topGuilds && <ImageGrid images={topGuilds.map((guild) => ({ id: guild.name, url: guild.icon || "/discord.webp" }))} />}

            <div className="md:text-xl text-lg lg:flex w-full mt-4">
                <span className="font-medium">
                    Experience the next-gen revolution, offering a list of features and extensive customization, providing a superior alternative to popular bots.
                </span>

                <div className="flex flex-col min-w-full lg:min-w-[420px]">

                    <div className="lg:ml-auto flex gap-2 mt-4 lg:mt-0">
                        <ServerButton
                            as={Link}
                            startContent={<HiUserAdd />}
                            className="w-1/2 lg:w-fit !text-xl !font-medium"
                            color="secondary"
                            href="/login?invite=true"
                            size="lg"
                        >
                            <span className="block sm:hidden">Invite</span>
                            <span className="hidden sm:block">Invite Wamellow</span>
                        </ServerButton>
                        <ServerButton
                            as={Link}
                            startContent={<BsDiscord />}
                            className="w-1/2 lg:w-fit !text-xl !font-medium"
                            href="/support"
                            size="lg"
                        >
                            <span className="block sm:hidden">Support</span>
                            <span className="hidden sm:block">Join support</span>
                        </ServerButton>
                    </div>


                    <span className={`lg:ml-auto flex gap-2 text-neutral-500 font-mediumr ${handwritten.className} mt-3 opacity-80 pl-20 lg:pr-20 rotate-2`}>
                        <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="h-5 w-5 relative top-px" draggable={false} />
                        Get started here in seconds
                    </span>

                </div>

            </div>

            <div className="lg:mt-14 mt-10" />

            <article itemScope itemType="http://schema.org/Article" className="flex flex-col gap-28 mb-10">

                <div>
                    <h2 className={styles.h2}>Fun leveling and leaderboards 🦄</h2>
                    <div className="my-8 max-w-md font-medium">
                        Have you ever dreamed of not using <span className="line-through">MEE6&trade;</span>? Just use <span className="font-bold">Wamellow</span> instead and don{"'"}t pay premium to personalise your cards and webpages!
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiCash />}
                                text="100% free forever"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>/leaderboard & /rank</h3>
                            <div className="pt-6">
                                Enhance your server{"’"}s engagement with our text-, voice- and invite based leaderboards, tailored to track and reward your most active members.
                                By motivating your members to communicate, you{"’"}ll cultivate a more active server community.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiArrowRight />}
                                    href="/leaderboard/828676951023550495"
                                >
                                    View Leaderboard
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordMessage {...messageProps("leaderboard")}>
                                <Image src={LeaderboardPic} itemProp="image" alt="" height={1024 / 2} width={2048 / 2} loading="lazy" />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Next-Level text to speech, tts 🔊</h2>
                    <div className="my-8 max-w-md font-medium">
                        Embrace the power of VoiceWave and let your messages speak everywhere you want! <span className="text-sm relative top-0.5 italic opacity-75">(Chat GPT called it VoiceWave)</span>
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiCash />}
                                text="100% free forever"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>40 Voices in 5 Languages</h3>
                            <div className="pt-6">
                                With Wamellow{"'"}s Text to Speech, you{"'"}re in control of transforming text into captivating speech.
                                You can either generate files using <Code>/tts file</Code>, talk in voice chats with <Code>/tts voice</Code> or setup a deticated channel!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiHashtag />}
                                    href="https://cdn.waya.one/ZBHWbG.mp4"
                                    target="_blank"
                                >
                                    Dedicated channel
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center gap-4 min-h-56" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordChannelCategory name="#/voice/dev/null">
                                <DiscordChannelVoice name="• Public">
                                    <DiscordUser username="mwlica" avatar="/luna-small.webp" />
                                    <DiscordUser username="Wamellow" avatar="/waya-v3-small.webp" isTalking />
                                </DiscordChannelVoice>
                            </DiscordChannelCategory>

                            <div className="bg-[#313338] h-0.5 w-full sm:w-0.5 sm:h-32 md:h-0.5 md:w-full lg:w-0.5 lg:h-32 rounded-full ml-2" />

                            <DiscordMessage {...messageProps("tts voice")}>
                                <Highlight mode={"DARK"} text="Now talking..." />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Fun with Starboards ⭐</h2>
                    <div className="my-8 max-w-md font-medium">
                        Join us in celebrating the best of your community by using Starboards to highlight and share messages that shine!
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiBadgeCheck />}
                                text="My lawyer said that title below"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>POGBOARD DEEZ NUTS</h3>
                            <div className="pt-6">
                                With Starboards, you have the power to elevate remarkable messages within our server.
                                When you come across a post that deserves recognition, simply vote it up, and watch as it takes center stage for everyone to see.
                                This feature ensures that exceptional content gets the attention it deserves, fostering a lively and engaging atmosphere.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=starboard"
                                >
                                    Setup
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordMessage {...messageProps()}>
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xbd7fd6}
                                    author={{
                                        text: "@mwlica",
                                        icon_url: "/luna-small.webp"
                                    }}
                                >
                                    I DONT EVEN HAVE A CAR

                                    <div className="flex gap-1 mt-4 mb-1">
                                        <span className="font-bold flex gap-1 items-center">⭐ 3</span>
                                        •
                                        <span className="text-blue-500 hover:underline cursor-pointer">#lounge</span>
                                    </div>

                                    <Highlight mode={"DARK"} text="**Replied to @drijon**" />
                                    <Highlight mode={"DARK"} text="As if someone creates a discord account being like: OH I NEED TO KNOW THE GAS PRICES. THERE IS A NICE WAY FOR IT. MEE6 PREMIUM!" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Heyho and bye @user 👋</h2>
                    <div className="my-8 max-w-md font-medium">
                        Make newcomers feel valued, enabling them to actively contribute to your vibrant channels.
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiFingerPrint />}
                                text="Captcha verification included"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>Greetings</h3>
                            <div className="pt-6">
                                Give a warm welcome to new members, introducing them to rules, topics, and ongoing events.
                                Ensure a positive, inclusive experience from the start, fostering community and engagement.
                                Whether gaming, joining a guild, or casual chat, every member should sense a strong community bond.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=greeting"
                                >
                                    Setup
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordMessage {...messageProps()}>
                                <Highlight mode={"DARK"} text="Welcome @mwlica to **Someone's** 👋" />
                                <Image src={WelcomePic} itemProp="image" alt="example welcome card" width={1024 / 2} height={(256 + 16) / 2} loading="lazy" />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Verify members w/ Passport</h2>
                    <div className="my-8 max-w-md font-medium">
                        Secure your server from raider attacks and ensure that only verified members can access your channels.
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiFingerPrint />}
                                text="Of course it's free"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>Captcha verification</h3>
                            <div className="pt-6">
                                Protect your server from unwanted attacks such as bot-raids with our captcha verification system.
                                Ensure that only verified members can access your channels, safeguarding your server from raider attacks and ensuring a safe and secure environment for all your members.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiLockOpen />}
                                    href="/passport/1125063180801036329"
                                >
                                    Try it out
                                </ServerButton>
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=greeting"
                                >
                                    Setup
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex justify-center">
                            <Image src={CaptchaPic} itemProp="image" alt="" height={1024 / 2} width={2048 / 2} loading="lazy" className="max-w-56" />
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Watchin{"'"} Anime ❤️</h2>
                    <div className="my-8 max-w-md font-medium">
                        They{"'"}re like windows to stories that provide the perfect distraction, letting you take a breather before diving back into the real world.
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiCash />}
                                text="100% sexy forever"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>/anime command</h3>
                            <div className="pt-6">
                                Unleash the magic of anime right within your Discord server with Wamellow{"'"}s 25+ categories.
                                Dive into a world of adorable nekos, charming waifus, and much more, all at your fingertips.
                                Whether it{"'"}s sharing the cutest characters or discovering stunning artwork, bring the joy of anime directly to your community, making your server a hub for all things anime-related.
                            </div>
                            <div className="p-4 pb-3 border dark:border-wamellow-alpha border-wamellow-100 rounded-lg my-8">
                                <Badge
                                    before={<HiFire />}
                                    text="NSFW Supported"
                                    classname="mr-auto ml-0 mb-2"
                                />
                                <span className="text-base">
                                    Find spicy nekos, waifus, and more in nsfw marked channels.
                                </span>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordMessage {...messageProps("anime")}>
                                <Highlight mode={"DARK"} text="Please help us on [top.gg](https://top.gg/bot/1125449347451068437/vote), only takes a few seconds" />
                                <Image
                                    alt=""
                                    className="rounded-md shadow-md w-64 md:w-56 lg:w-72 md:w-unset max-w-xs mt-2"
                                    height={512}
                                    itemProp="image"
                                    loading="lazy"
                                    src={WaifuPic}
                                    width={512}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create unique images with Ai 🏳️‍⚧️</h2>
                    <div className="my-8 max-w-md font-medium">
                        Unlock complimentary access to a variety of image generation models directly within your Discord server. Without paying a shit ton to MEE6.
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiCash />}
                                text="100% no money loss"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>/image command</h3>
                            <div className="pt-6">
                                Summon the enchantment of AI-generated images to your Discord server with our versatile /image command, featuring over 40 distinct custom models.
                                Elevate your server to a haven for unique and dynamic AI-generated images, ensuring a delightful experience for all enthusiasts of the digital arts.
                            </div>
                            <div className="p-4 pb-3 border dark:border-wamellow-alpha border-wamellow-100 rounded-lg my-8">
                                <Badge
                                    before={<HiFire />}
                                    text="NSFW Supported"
                                    classname="mr-auto ml-0 mb-2"
                                />
                                <span className="text-base">
                                    Generate spicy images and more in nsfw marked channels.
                                </span>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiArrowRight />}
                                    href="/ai"
                                >
                                    View all models
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordMessage {...messageProps("image")}>
                                <Highlight mode={"DARK"} text="Please help us on [top.gg](https://top.gg/bot/1125449347451068437/vote), only takes a few seconds" />
                                <Image
                                    alt=""
                                    className="rounded-md shadow-md w-64 md:w-56 lg:w-72 md:w-unset max-w-md mt-2"
                                    height={512}
                                    itemProp="image"
                                    loading="lazy"
                                    src={AiPic}
                                    width={512}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create Custom Responses 🖊️</h2>
                    <div className="my-8 max-w-md font-medium">
                        Level up your Discord support game with Wamellow{"'"}s custom respones, called tags!
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                before={<HiCash />}
                                text="Free for 30 tags"
                                classname="mr-auto ml-0 mb-4"
                            />
                            <h3 className={styles.h3}>Wamellow tags</h3>
                            <div className="pt-6">
                                Easily handle frequently asked questions, common queries, and repetitive tasks in a snap.
                                Empower your server with quick access to essential info, making support a breeze.
                                Boost engagement and create a knowledgeable community for free!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ServerButton
                                    as={Link}
                                    className="bg-wamellow-light"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=custom-commands"
                                >
                                    Setup
                                </ServerButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col gap-4" style={{ backgroundColor: "rgb(43, 45, 49)" }}>
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "mwlica",
                                    avatar: "/luna-small.webp",
                                    bot: false
                                }}
                            >
                                <Highlight mode={"DARK"} text="wm - howto" />
                            </DiscordMessage>

                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "Wamellow",
                                    avatar: "/waya-v3-small.webp",
                                    bot: true
                                }}
                            >
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xbc7ed4}
                                >
                                    <Highlight mode={"DARK"} text="To create a custom command, go to [your server's dashboard](/dashboard?to=custom-commands), click on `Create`, fill in the response **content**, **embed title**, **embed description**, **embed color**, **embed images**, command **permissions** and more. When you're done you can start using the command 🎉" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

            </article>

            <div className="w-full my-6">
                <div className="flex gap-4 items-center mb-2">
                    <span className="flex items-center gap-2">
                        <Image src={SpacePic} width={64} height={64} alt="users's profile picture" className="w-12 h-12 rounded-full" />
                        <div>
                            <span className="text-xl font-medium dark:text-neutral-200 text-neutral-800">Luna’s Grandpa {"<3"}</span> <br />
                            <span className="dark:text-neutral-300 text-neutral-700">likes feta and wine</span>
                        </div>
                    </span>
                    <HiChevronRight className="w-8 h-8" />
                </div>
                <span className={`${handwritten.className} text-2xl break-words`}>„{"FUCK EVERYTHING! EXCEPT LUNA, LUNA MUST BE PROTECTED AT ALL COSTS"}“</span>
            </div>

            <Box none className="p-5 pb-3 dark:bg-wamellow bg-wamellow-100 rounded-lg mt-4 w-full">
                <div className="flex">
                    <Badge
                        before={<HiFire />}
                        text="Popular Slash Commands"
                        classname="mr-auto ml-0 mb-2"
                    />
                    <div className="ml-auto flex items-center gap-1 opacity-80">
                        <span className="text-xs">Since 7th December</span>
                        <HiInformationCircle />
                    </div>
                </div>
                {Array.isArray(commands) && commands
                    .filter((command) => ["tts", "rank", "leaderboard", "anime"].includes(command.name))
                    .map((command, i) => (
                        <div key={command.name} className={cn("text-base py-4 flex flex-col md:flex-row gap-4 md:items-center", i + 1 !== 4 && "border-b border-wamellow-alpha")}>
                            <div className="-mb-2 md:mb-0 flex items-center h-min">
                                <span className="dark:text-neutral-100 text-neutral-900 text-xl font-semibold md:font-medium">/{command.name}</span>
                                <span className="ml-auto italic text-sm md:hidden opacity-80">{intl.format(command.uses)} uses</span>
                            </div>
                            <span>{command.description}</span>
                            <span className="ml-auto italic text-sm hidden md:block">{intl.format(command.uses)} uses</span>
                        </div>
                    ))
                }
                {(!commands || !Array.isArray(commands)) &&
                    <div className="flex flex-col items-center my-10">
                        <div className="text-3xl dark:text-neutral-100 text-neutral-900 font-semibold mb-4">Something went wrong...</div>
                        <div className="text-md dark:text-neutral-400 text-neutral-600 font-semibold">The commands list could not be loaded at this time</div>
                    </div>
                }
            </Box>

            <div className="h-6" />

            <StatsBar
                items={[
                    {
                        name: "Guilds using us",
                        number: stats?.approximateGuildCount || 0,
                        gained: stats?.guildsGained
                    },
                    {
                        name: "Users using us",
                        number: stats?.approximateUserCount || 0,
                        gained: stats?.usersGained || 0
                    },
                    {
                        name: "Votes for us",
                        number: stats?.approximateVoteCount || 0,
                        gained: stats?.votesGained || 0,
                        append: `in ${convertMonthToName(new Date().getMonth())}`
                    },
                    {
                        name: "Our experience with",
                        number: stats?.globalGuilds || 0,
                        gained: "guilds, 5 bots",
                        info: "https://discordlist.gg/user/821472922140803112"
                    }
                ]}
            />

        </div>
    );
}