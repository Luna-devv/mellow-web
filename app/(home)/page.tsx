import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiArrowRight, HiFire, HiInformationCircle, HiUserAdd } from "react-icons/hi";

import Badge from "@/components/badge";
import { StatsBar } from "@/components/counter";
import Highlight from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import DiscordMessageFile from "@/components/discord/Message-file";
import ServerGrid from "@/components/guild-grid";
import { ListTab } from "@/components/list";
import ArrowPic from "@/public/arroww.webp";
import LeaderboardPic from "@/public/leaderboard.webp";
import WaifuPic from "@/public/waifu.webp";
import WelcomePic from "@/public/welcome.webp";
import { ApiV1StatisticsGetResponse, ApiV1TopguildsGetResponse } from "@/typings";
import cn from "@/utils/cn";
import { convertMonthToName } from "@/utils/time";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

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

    const Invite = () => (
        <Link href="/login?invite=true" className="button-primary">
            <HiUserAdd />
            <span className="block sm:hidden">Wamellow</span>
            <span className="hidden sm:block">Invite Wamellow</span>
        </Link>
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

            {topGuilds && <ServerGrid guilds={topGuilds} />}

            <div className="md:text-xl text-lg lg:flex w-full mt-4">
                <span className="tracking-wide">
                    Experience the next-gen revolution, offering a list of features and extensive customization, providing a superior alternative to popular bots.
                </span>

                <div className="flex flex-col min-w-full lg:min-w-[420px]">

                    <div className="lg:ml-auto flex gap-2 text-xl font-medium mt-4 lg:mt-0">
                        <Link href="/login?invite=true" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 w-1/2 lg:w-fit justify-center gap-2">
                            <HiUserAdd className="relative top-1" />
                            <span className="block sm:hidden">Wamellow</span>
                            <span className="hidden sm:block">Invite Wamellow</span>
                        </Link>
                        <Link href="/support" className="button w-1/2">
                            <BsDiscord />
                            <span className="block sm:hidden">Support</span>
                            <span className="hidden sm:block">Join support</span>
                        </Link>
                    </div>


                    <span className={`lg:ml-auto flex gap-2 text-neutral-500 tracking-wider ${handwritten.className} mt-3 opacity-80 pl-20 lg:pr-20 rotate-2`}>
                        <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="h-5 w-5 relative top-px" draggable={false} />
                        Get started here in seconds
                    </span>

                </div>

            </div>

            <div className="lg:mt-14 mt-10" />

            <article itemScope itemType="http://schema.org/Article" className="flex flex-col gap-24 mb-16">

                <div className="flex flex-col md:flex-row gap-8 items-center">

                    <div className="md:w-1/2">
                        <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>Fun /ranks & /leaderboards 🦄</h2>
                        <div className="text-lg pt-6">
                            Enhance your server{"’"}s engagement with our text-, voice- and invite based leaderboards, tailored to track and reward your most active members.
                            Craft tailored access to channels and roles, granting exclusive permissions to dedicated members.
                            By motivating your members to communicate, you{"’"}ll cultivate a more dynamic server community.
                            Drive interaction and establish a feeling of accomplishment as users advance through our engaging framework.
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Invite />
                            <Link href="/leaderboard/1055188344188973066" className="button">
                                <span className="mr-2">View Leaderboard</span>
                                <HiArrowRight />
                            </Link>
                        </div>

                    </div>

                    <div className="md:ml-auto md:w-1/2 px-3 pb-3">
                        <Suspense>
                            <ListTab
                                tabs={[
                                    {
                                        name: "Messages",
                                        value: ""
                                    },
                                    {
                                        name: "Voicetime",
                                        value: "voiceminutes"
                                    },
                                    {
                                        name: "Invites",
                                        value: "invites"
                                    }
                                ]}
                                url="/"
                                searchParamName="type"
                                disabled={true}
                            />
                        </Suspense>
                        <Image src={LeaderboardPic} itemProp="image" width={1224 / 1.8} height={768 / 1.8} alt="Example leaderboard webpage" />
                    </div>

                </div>

                <div className="flex flex-col-reverse md:flex-row gap-8 items-center">

                    <div className="md:ml-auto md:w-1/2 w-full px-3 pb-3">
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3-small.webp",
                                bot: true
                            }}
                        >
                            <Highlight
                                mode={"DARK"}
                                text="Welcome @mwlica to **Someone's x Waya** 👋"
                            />

                            <Image src={WelcomePic} itemProp="image" alt="Example welcome card" width={1024 / 2} height={(256 + 16) / 2} loading="lazy" className="lg:w-[400px] md:w-[300px] lg:h-[106px] md:h-[80px]" />

                        </DiscordMessage>
                    </div>

                    <div className="text-left md:w-1/2">
                        <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>Heyho and bye 👋</h2>
                        <div className="text-lg pt-6">
                            Give a warm welcome to new members, introducing them to rules, topics, and ongoing events.
                            Ensure a positive, inclusive experience from the start, fostering community and engagement.
                            Make newcomers feel valued, enabling them to actively contribute to your vibrant channels.
                            Whether gaming, joining a guild, or casual chat, every member should sense a strong community bond.
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Invite />
                            <Link href="/dashboard?to=greeting" className="button">
                                <span className="mr-2">Setup</span>
                                <HiArrowRight />
                            </Link>
                        </div>

                    </div>

                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">

                    <div className="md:w-1/2">
                        <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>Fun with Starboards ⭐</h2>
                        <div className="text-lg pt-6">
                            With Starboards, you have the power to elevate remarkable messages within our server.
                            When you come across a post that deserves recognition, simply vote it up, and watch as it takes center stage for everyone to see.
                            This feature ensures that exceptional content gets the attention it deserves, fostering a lively and engaging atmosphere.
                            Join us in celebrating the best of our community by using Starboards to highlight and share messages that truly shine!
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Invite />
                            <Link href="/dashboard?to=starboard" className="button">
                                <span className="mr-2">Setup</span>
                                <HiArrowRight />
                            </Link>
                        </div>

                    </div>

                    <div className="md:ml-auto md:w-1/2 w-full px-3 pb-3">
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
                                author={{
                                    text: "@mwlica",
                                    icon_url: "/luna-small.webp"
                                }}
                            >
                                <Highlight mode={"DARK"} text="Like ok @sean I know you are gay but no I won’t date you" />

                                <div className="flex gap-1 mt-4">
                                    <span className="font-bold flex gap-1 items-center">⭐ 9</span>
                                    •
                                    <span className="text-blue-500 hover:underline cursor-pointer">#lounge</span>
                                </div>

                                <Image src="/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Fattachments%2F883817635081506886%2F1113058694347894865%2FIMG_6864.png&w=640&q=75" itemProp="image" alt="" width={640} height={205} loading="lazy" className="mt-2 rounded-md" />
                            </DiscordMessageEmbed>


                        </DiscordMessage>
                    </div>

                </div>

                <div className="flex flex-col-reverse md:flex-row gap-8 items-center">

                    <div className="md:ml-auto md:w-1/2 w-full px-3 pb-3">
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3-small.webp",
                                bot: true
                            }}
                        >
                            <Highlight mode={"DARK"} text="[Change default voice & fileformat](/profile/text-to-speech)" />

                            <DiscordMessageFile
                                mode={"DARK"}
                                duration={18}
                            />

                        </DiscordMessage>
                    </div>

                    <div className="md:w-1/2">
                        <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>Best Text to Speech, TTS 🔊</h2>
                        <div className="text-lg pt-6">
                            With Text to Speech, you{"'"}re in control of transforming text into captivating speech across various languages and over 40 distinct voices.
                            Whether you need standalone audio files or want to bring your text to life in a voice chat, Wamellow{"'"}s TTS offers versatility.
                            Embrace the power of VoiceWave and let your messages resonate with impact!
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Invite />
                        </div>

                    </div>

                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">

                    <div className="md:w-1/2">
                        <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>Watchin{"'"} Anime 👀</h2>
                        <div className="text-lg pt-6">
                            Unleash the magic of anime right within your Discord server with Wamellow{"'"}s /anime command.
                            Dive into a world of adorable nekos, charming waifus, and much more, all at your fingertips.
                            Whether it{"'"}s sharing the cutest characters or discovering stunning artwork, bring the joy of anime directly to your community, making your server a hub for all things anime-related.

                            <div className="p-4 pb-3 border-2 dark:border-wamellow border-wamellow-100 rounded-lg mt-4">
                                <Badge
                                    before={<HiFire />}
                                    text="NSFW Supported"
                                    classname="mr-auto ml-0 mb-2"
                                />
                                <span className="text-base">
                                    Find spicy nekos, waifus, and more in nsfw marked channels.
                                </span>
                            </div>

                        </div>

                        <div className="flex gap-2 mt-4">
                            <Invite />
                        </div>

                    </div>

                    <div className="md:ml-auto md:w-1/2 w-full px-3 pb-3">
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3-small.webp",
                                bot: true
                            }}
                        >
                            <Highlight mode={"DARK"} text="Please help us on [top.gg](https://top.gg/bot/1125449347451068437/vote), only takes a few seconds" />

                            <DiscordMessageEmbed
                                mode={"DARK"}
                                color={0xbc7ed4}
                                classname="max-w-min"
                            >
                                <Image src={WaifuPic} itemProp="image" alt="" width={640} height={905} loading="lazy" className="mt-2 rounded-md max-w-xs" />
                            </DiscordMessageEmbed>


                        </DiscordMessage>
                    </div>

                </div>

            </article>

            <div className="p-5 pb-3 dark:bg-wamellow bg-wamellow-100 rounded-lg mt-4 w-full">
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
            </div>

            <div className="h-8" />

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