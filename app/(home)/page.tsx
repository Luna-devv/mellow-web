import { Code } from "@nextui-org/react";
import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BsDiscord, BsYoutube } from "react-icons/bs";
import { HiArrowNarrowRight, HiArrowRight, HiCash, HiCheck, HiFire, HiLockOpen, HiUserAdd } from "react-icons/hi";

import { Avatar } from "@/components/avatar";
import Box from "@/components/box";
import { ClientAvatarGroup, ClientButton, ClientChip } from "@/components/client";
import Comment from "@/components/comment";
import DiscordAppBadge from "@/components/discord/app-badge";
import DiscordChannel from "@/components/discord/channel";
import DiscordChannelCategory from "@/components/discord/channel-category";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import DiscordUser from "@/components/discord/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultFetchOptions } from "@/lib/api";
import AiPic from "@/public/ai.webp";
import CaptchaPic from "@/public/captcha.webp";
import ArrowPic from "@/public/icons/arroww.webp";
import LeaderboardPic from "@/public/leaderboard.webp";
import NotificationsPic from "@/public/notifications-thumbnail.webp";
import SpacePic from "@/public/space.webp";
import WaifuPic from "@/public/waifu.webp";
import WelcomePic from "@/public/welcome.webp";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { toFixedArrayLength } from "@/utils/fixed-array-length";
import { actor } from "@/utils/tts";
import { getCanonicalUrl } from "@/utils/urls";

import { Commands } from "./commands.component";
import { Faq } from "./faq.component";
import { Ratings } from "./ratings.component";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const revalidate = 43200;

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as ApiV1TopguildsGetResponse[] | null;

    const styles = {
        h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-bold"),
        h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-semibold")
    };

    const messageProps = (command?: string) => ({
        mode: "DARK" as const,
        commandUsed: command
            ? {
                name: command,
                username: "@mwlica",
                avatar: "/luna.webp",
                bot: false
            }
            : undefined,
        user: {
            username: "Wamellow",
            avatar: "/waya-v3.webp",
            bot: true
        }
    });

    const Invite = () => (
        <ClientButton
            as={Link}
            color="secondary"
            href="/login?invite=true"
            prefetch={false}
            startContent={<HiUserAdd />}
        >
            <span className="block sm:hidden">Invite</span>
            <span className="hidden sm:block">Invite Wamellow</span>
        </ClientButton>
    );

    // eslint-disable-next-line
    async function renderCount() {
        "use server";
        return <span>trust us!</span>;
    }

    return (
        <div className="flex items-center flex-col w-full">

            <div className="flex w-full items-center gap-8 mb-16 md:mb-12 min-h-[500px] h-[calc(100svh-14rem)] md:h-[calc(100svh-17rem)]">
                <div className="md:min-w-96 w-full md:w-2/3 xl:w-1/2 flex flex-col space-y-6">

                    <Suspense fallback={<Skeleton className="w-[15rem] !h-6 !m-0" isLoading={true} />}>
                        <Ratings />
                    </Suspense>

                    <h1 className={cn(montserrat.className, "lg:text-7xl md:text-6xl text-5xl font-semibold dark:text-neutral-100 text-neutral-900 break-words")}>
                        <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">
                            Next generation
                        </span>
                        {" of "}
                        <span className="break-keep inline-flex items-center">
                            Discord
                            <DiscordAppBadge className="mt-1 scale-[250%] md:scale-[300%] lg:scale-[360%] relative left-12 md:left-14 lg:left-20" />
                        </span>
                    </h1>

                    <span className="text-lg font-medium max-w-[38rem] mb-4">
                        Engage in leaderboards, starboards, and a welcoming atmosphere.
                        Dive into /anime&apos;s, free /image Ai, and the power of Text-to-Speech.
                        Stay updated with dailyposts and receive YouTube notifications!
                    </span>

                    <ClientAvatarGroup
                        className="mr-auto md:hidden"
                        max={8}
                        renderCount={renderCount}
                    >
                        {toFixedArrayLength(topGuilds || [], 8)
                            ?.map((guild) => (
                                <Avatar
                                    key={"mobileGuildGrid-" + guild.id}
                                    src={guild.icon ? guild.icon + "?size=128" : "/discord.webp"}
                                    alt={guild.name}
                                    title={guild.name}
                                />
                            ))
                        }
                    </ClientAvatarGroup>

                    <div className="space-y-4">
                        <Link
                            className="flex gap-1 items-center text-violet-400 hover:underline w-fit"
                            href={getCanonicalUrl("dashboard", "?utm_source=wamellow.com&utm_medium=home")}
                        >
                            Go to Dashboard <HiArrowNarrowRight />
                        </Link>

                        <div className="flex gap-2 lg:mt-0">
                            <ClientButton
                                as={Link}
                                className="w-1/2 lg:w-fit !text-xl !font-medium"
                                color="secondary"
                                prefetch={false}
                                href="/login?invite=true"
                                size="lg"
                                startContent={<HiUserAdd />}
                            >
                                <span className="block sm:hidden">Invite</span>
                                <span className="hidden sm:block">Invite Wamellow</span>
                            </ClientButton>
                            <ClientButton
                                as={Link}
                                startContent={<BsDiscord />}
                                className="w-1/2 lg:w-fit !text-xl !font-medium"
                                href="/support"
                                size="lg"
                            >
                                <span className="block sm:hidden">Support</span>
                                <span className="hidden sm:block">Join support</span>
                            </ClientButton>
                        </div>

                        <span className={cn("lg:ml-auto flex gap-2 text-neutral-500 font-medium mt-3 opacity-80 pl-20 lg:pr-20 rotate-2", handwritten.className)}>
                            <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="h-5 w-5 relative top-px" draggable={false} />
                            Get started here in seconds
                        </span>

                    </div>
                </div>

                <div className="ml-auto w-fit xl:w-1/2 hidden md:block">
                    <div className="flex gap-4 rotate-6 relative left-14 w-fit">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={"guildGridThing-" + i}
                                className={cn(
                                    "flex flex-col gap-4",
                                    i % 2 === 1 ? "mt-4 animate-guilds" : "animate-guilds-2",
                                    (i === 0 || i === 3) && "hidden xl:flex")
                                }
                            >
                                {toFixedArrayLength(topGuilds || [], 12)
                                    .slice(i * 3, (i * 3) + 3)
                                    .map((guild, i2) => (
                                        <Link
                                            key={"guildGrid-" + guild.id + i + i2}
                                            className="relative md:h-32 h-24 md:w-32 w-24 hover:scale-110 duration-200"
                                            href={getCanonicalUrl("leaderboard", guild.id, "?utm_source=wamellow.com&utm_medium=home")}
                                            prefetch={false}
                                        >
                                            <ImageReduceMotion
                                                alt="server"
                                                className="rounded-xl bg-wamellow"
                                                url={(guild.icon || "/discord.webp")?.split(".").slice(0, -1).join(".")}
                                                size={128}
                                            />
                                        </Link>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-x-2">
                <div className="animate-scroll rounded-lg rotate-180 md:rounded-3xl md:rotate-0">
                    <div className="animate-scroll-wheel" />
                </div>
                <span className="hidden md:block text-lg font-medium mt-2 text-neutral-500/50">Scroll down...</span>
            </div>

            <article
                itemScope
                itemType="http://schema.org/Article"
                className="flex flex-col gap-28 my-10"
            >

                <div>
                    <h2 className={styles.h2}>Next-Level text to speech 🔊</h2>
                    <div className="my-6 max-w-md font-medium">
                        It{"'"}s crucial for people with speech impairments.
                        It ensures inclusivity and allows everyone to participate fully, promoting accessibility and community engagement. ❤️
                        <span className="sr-only">One of the msot important Accessibility feature you need.</span>
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">100% free forever</span>
                            </ClientChip>

                            <h3 className={styles.h3}>40 Voices in 8 Languages</h3>

                            <div className="pt-6">
                                You can either generate files using <Code color="secondary">/tts file</Code>, talk in voice chats with <Code color="secondary">/tts voice</Code> or setup a dedicated channel!
                                Great for people with aphonia, dysphonia, or other speech impairments.
                            </div>

                            <ClientAvatarGroup
                                className="mt-4"
                                max={8}
                            >
                                {["us", "de", "es", "fr", "jp", "kr", "br", "id"].map((lang) => {
                                    const name = Object
                                        .entries(actor)
                                        .find(([, [, langCode]]) => langCode === lang)
                                        ?.[1][0] || lang;

                                    return (
                                        <Avatar
                                            size="sm"
                                            key={"ttsLang-" + lang}
                                            src={`/icons/${lang}.webp`}
                                            alt={name}
                                            title={name}
                                        />
                                    );
                                })}
                                <span className="sr-only">Change Text-to-Speech language and voice</span>
                            </ClientAvatarGroup>

                            <div className="flex gap-2 mt-5">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<BsYoutube />}
                                    href="https://youtu.be/NS5fZ1ltovE?si=I3nViYb4sx3n3Uvo"
                                    target="_blank"
                                >
                                    Watch YouTube Video
                                </ClientButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 ">

                            <div
                                className="bg-discord-gray px-8 py-6 md:py-12 rounded-lg flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center gap-4 min-h-56"

                            >
                                <DiscordChannelCategory name="#/voice/dev/null">
                                    <DiscordChannel
                                        type="voice"
                                        name="• Public"
                                    >
                                        <DiscordUser username="mwlica" avatar="/luna.webp" />
                                        <DiscordUser username="Space" avatar="/space.webp" />
                                        <DiscordUser username="Wamellow" avatar="/waya-v3.webp" isTalking />
                                    </DiscordChannel>
                                </DiscordChannelCategory>

                                <div className="bg-[#313338] h-0.5 w-full sm:w-0.5 sm:h-32 md:h-0.5 md:w-full lg:w-0.5 lg:h-32 rounded-full ml-2" />

                                <DiscordMessage {...messageProps("tts voice")}>
                                    <DiscordMarkdown mode={"DARK"} text="Now talking..." />
                                </DiscordMessage>
                            </div>

                            <span className="text-sm mt-1 opacity-75">
                                English, French, German, Spanish, Portuguese, Indonesian and Japanese, Korean.
                            </span>

                        </div>

                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Stylish YouTube Notifications 📢</h2>
                    <div className="my-6 max-w-md font-medium">
                        Notify your community about freshly released videos in style with free custom messages & embeds for up to 30 channels.
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">Styling & 30 Channels free</span>
                            </ClientChip>
                            <h3 className={styles.h3}>Stay up-to-date on YouTube</h3>
                            <div className="pt-6">
                                Set up notifications with free custom messages and embeds for up to 30 channels and get notified in less than a minute.

                                <ol className="mt-4">
                                    {[
                                        "Up to 30 channels",
                                        "Custom message & embed",
                                        "Sub 30 second delay",
                                        "99.9% uptime"
                                    ].map((name) => (
                                        <li key={name} className="flex gap-1 items-center">
                                            <HiCheck className="text-violet-400" />
                                            {name}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<BsYoutube />}
                                    href="https://youtu.be/xizs-hrwK4I?si=6pIYALygtNhUwpph"
                                    target="_blank"
                                >
                                    Watch Tutorial
                                </ClientButton>
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=notifications&utm_source=wamellow.com&utm_medium=home"
                                >
                                    Setup
                                </ClientButton>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown mode={"DARK"} text="Hey **@everyone**, Linus Tech Tips just posted a new video!\n[youtube.com/watch?v=tN-arR2UoRk](https://youtube.com/watch?v=tN-arR2UoRk)" />
                                <DiscordMessageEmbed
                                    mode="DARK"
                                    title="My wife insisted I do this for her"
                                    color={0x8a57ff}
                                >
                                    <Image
                                        alt=""
                                        className="rounded-md shadow-md w-full mt-2"
                                        itemProp="image"
                                        loading="lazy"
                                        src={NotificationsPic}
                                    />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create unique images with Ai 🏳️‍⚧️</h2>
                    <div className="my-6 max-w-md font-medium">
                        Unlock complimentary access to a variety of image generation models directly within your Discord server. Without paying a shit ton to MEE6.
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">100% no money loss</span>
                            </ClientChip>
                            <h3 className={styles.h3}>Free /image command</h3>
                            <div className="pt-6">
                                Summon the enchantment of AI-generated images to your Discord server with our versatile /image command, featuring over 40 distinct custom models.
                                Customize the rating, quality, aesthetics, image width and height, upscaled, generation steps and the CFG scale all for free.
                            </div>
                            <div className="p-4 pb-3 border dark:border-wamellow-alpha border-wamellow-100 rounded-lg my-8">
                                <ClientChip
                                    className="mb-2"
                                    color="secondary"
                                    variant="flat"
                                    size="sm"
                                    startContent={<HiFire className="mx-1" />}
                                >
                                    <span className="font-semibold">NSFW Supported</span>
                                </ClientChip>
                                <div className="text-base">
                                    Generate spicy images and more in nsfw marked channels.
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/ai-gallery?utm_source=wamellow.com&utm_medium=home"
                                >
                                    View Images
                                </ClientButton>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("image")}>
                                <DiscordMarkdown mode={"DARK"} text="query: **femboy**" />
                                <Image
                                    alt=""
                                    className="rounded-md shadow-md w-full max-w-[308px] mt-2"
                                    height={290}
                                    itemProp="image"
                                    loading="lazy"
                                    src={AiPic}
                                    width={290}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Watchin{"'"} Anime ❤️</h2>
                    <div className="my-6 max-w-md font-medium">
                        They{"'"}re like windows to stories that provide the perfect distraction, letting you take a breather before diving back into the real world.
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">100% sexy forever</span>
                            </ClientChip>
                            <h3 className={styles.h3}>/anime command</h3>
                            <div className="pt-6">
                                Unleash the magic of anime right within your Discord server with Wamellow{"'"}s 25+ categories.
                                Dive into a world of adorable nekos, charming waifus, and much more, all at your fingertips.
                                Whether it{"'"}s sharing the cutest characters or discovering stunning artwork, bring the joy of anime directly to your community, making your server a hub for all things anime-related.
                            </div>
                            <div className="p-4 pb-3 border dark:border-wamellow-alpha border-wamellow-100 rounded-lg my-8">
                                <ClientChip
                                    className="mb-2"
                                    color="secondary"
                                    variant="flat"
                                    size="sm"
                                    startContent={<HiFire className="mx-1" />}
                                >
                                    <span className="font-semibold">NSFW Supported</span>
                                </ClientChip>
                                <div className="text-base">
                                    Find spicy nekos, waifus, and more in nsfw marked channels.
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("anime")}>
                                <Image
                                    alt=""
                                    className="rounded-md shadow-md w-64 md:w-56 lg:w-72 md:w-unset max-w-xs mt-2"
                                    height={905 / 3}
                                    itemProp="image"
                                    loading="lazy"
                                    src={WaifuPic}
                                    width={640 / 3}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Fun leveling and leaderboards 🦄</h2>
                    <div className="my-6 max-w-md font-medium">
                        Have you ever dreamed of not using <span className="line-through">MEE6&trade;</span>? Just use <span className="font-bold">Wamellow</span> instead and don{"'"}t pay premium to personalise your cards and webpages! 👀
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">100% free forever</span>
                            </ClientChip>
                            <h3 className={styles.h3}>/leaderboard & /rank</h3>
                            <div className="pt-6">
                                Enhance your server{"’"}s engagement with our text-, voice- and invite based leaderboards, tailored to track and reward your most active members.
                                By motivating your members to communicate, you{"’"}ll cultivate a more active server community.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/leaderboard/828676951023550495?utm_source=wamellow.com&utm_medium=home"
                                >
                                    View Leaderboard
                                </ClientButton>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("leaderboard")}>
                                <Image
                                    alt="example leaderboard card"
                                    src={LeaderboardPic}
                                    height={1024 / 4}
                                    itemProp="image"
                                    loading="lazy"
                                    width={2048 / 4}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Fun with Starboards ⭐</h2>
                    <div className="my-6 max-w-md font-medium">
                        Join us in celebrating the best of your community by using Starboards to highlight and share messages that shine!
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">My lawyer said that title below</span>
                            </ClientChip>
                            <h3 className={styles.h3}>POGBOARD DEEZ NUTS</h3>
                            <div className="pt-6">
                                With Starboards, you have the power to elevate remarkable messages within our server.
                                When you come across a post that deserves recognition, simply vote it up, and watch as it takes center stage for everyone to see.
                                This feature ensures that exceptional content gets the attention it deserves, fostering a lively and engaging atmosphere.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=starboard&utm_source=wamellow.com&utm_medium=home"
                                >
                                    Setup
                                </ClientButton>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xbd7fd6}
                                    author={{
                                        text: "@mwlica",
                                        icon_url: "/luna.webp"
                                    }}
                                >
                                    I DONT EVEN HAVE A CAR

                                    <div className="flex gap-1 mt-4 mb-1">
                                        <span className="font-bold flex gap-1 items-center">⭐ 3</span>
                                        •
                                        <span className="text-blue-500 hover:underline cursor-pointer">#lounge</span>
                                    </div>

                                    <DiscordMarkdown mode={"DARK"} text="**Replied to @drijon**" />
                                    <DiscordMarkdown mode={"DARK"} text="As if someone creates a discord account being like: OH I NEED TO KNOW THE GAS PRICES. THERE IS A NICE WAY FOR IT. MEE6 PREMIUM!" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Heyho and bye @user 👋</h2>
                    <div className="my-6 max-w-md font-medium">
                        Make newcomers feel valued, enabling them to actively contribute to your vibrant channels.
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">w/ free image background</span>
                            </ClientChip>
                            <h3 className={styles.h3}>Greetings</h3>
                            <div className="pt-6">
                                Give a warm welcome to new members, introducing them to rules, topics, and ongoing events.
                                Ensure a positive, inclusive experience from the start, fostering community and engagement.
                                Whether gaming, joining a guild, or casual chat, every member should sense a strong community bond.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=greeting&utm_source=wamellow.com&utm_medium=home"
                                >
                                    Setup
                                </ClientButton>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown mode={"DARK"} text="Welcome @mwlica to **Someone's** 👋" />
                                <Image
                                    alt="example welcome card"
                                    src={WelcomePic}
                                    height={(256 + 16) / 2}
                                    itemProp="image"
                                    loading="lazy"
                                    width={1024 / 2}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Verify members w/ Passport</h2>
                    <div className="my-6 max-w-md font-medium">
                        Secure your server from raider attacks and ensure that only verified members can access your channels.
                    </div>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">Of course it{"'"}s free</span>
                            </ClientChip>
                            <h3 className={styles.h3}>Captcha verification</h3>
                            <div className="pt-6">
                                Protect your server from unwanted attacks such as bot-raids with our captcha verification system.
                                Ensure that only verified members can access your channels, safeguarding your server from raider attacks and ensuring a safe and secure environment for all your members.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiLockOpen />}
                                    href="/passport/1125063180801036329?utm_source=wamellow.com&utm_medium=home"
                                >
                                    Try it out
                                </ClientButton>
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=greeting&utm_source=wamellow.com&utm_medium=home"
                                >
                                    Setup
                                </ClientButton>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex justify-center">
                            <Image
                                alt="anime captcha verification example"
                                className="max-w-56"
                                src={CaptchaPic}
                                height={1530 / 5}
                                itemProp="image"
                                loading="lazy"
                                width={1070 / 5}
                            />
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create Custom Responses 🖊️</h2>
                    <div className="my-6 max-w-md font-medium">
                        Level up your Discord support game with Wamellow{"'"}s custom respones, called tags!
                    </div>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <ClientChip
                                className="mb-2"
                                color="secondary"
                                variant="flat"
                                size="sm"
                                startContent={<HiCash className="mx-1" />}
                            >
                                <span className="font-semibold">30 tags free</span>
                            </ClientChip>
                            <h3 className={styles.h3}>Wamellow tags</h3>
                            <div className="pt-6">
                                Easily handle frequently asked questions, common queries, and repetitive tasks in a snap.
                                Empower your server with quick access to essential info, making support a breeze.
                                Boost engagement and create a knowledgeable community for free!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <ClientButton
                                    as={Link}
                                    className="bg-wamellow"
                                    startContent={<HiArrowRight />}
                                    href="/dashboard?to=custom-commands&utm_source=wamellow.com&utm_medium=home"
                                >
                                    Setup
                                </ClientButton>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col gap-4">
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "mwlica",
                                    avatar: "/luna.webp",
                                    bot: false
                                }}
                            >
                                <DiscordMarkdown mode={"DARK"} text="wm - howto" />
                            </DiscordMessage>

                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "Wamellow",
                                    avatar: "/waya-v3.webp",
                                    bot: true
                                }}
                            >
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xbc7ed4}
                                >
                                    <DiscordMarkdown mode={"DARK"} text="To create a custom command, go to [your server's dashboard](/dashboard?to=custom-commands), click on `Create`, fill in the response **content**, **embed title**, **embed description**, **embed color**, **embed images**, command **permissions** and more. When you're done you can start using the command 🎉" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

            </article>

            <Faq />

            <Comment
                username="Luna’s Grandpa <3"
                bio="likes feta and wine"
                avatar={SpacePic}
                content="FUCK EVERYTHING! EXCEPT LUNA, LUNA MUST BE PROTECTED AT ALL COSTS"
            />

            <Suspense>
                <Commands />
            </Suspense>

        </div>
    );
}