import { Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiArrowRight, HiInformationCircle, HiPlus } from "react-icons/hi";

import ClientCountUp from "@/components/ClientCountUp";
import Highlight from "@/components/discord/Markdown";
import DiscordMessage from "@/components/discord/Message";
import DiscordMessageEmbed from "@/components/discord/MessageEmbed";
import DiscordMessageFile from "@/components/discord/MessageFile";
import { ListTab } from "@/components/List";
import ServerGrid from "@/components/ServerGrid";
import { ApiV1StatisticsGetResponse, ApiV1TopguildsGetResponse } from "@/typings";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1TopguildsGetResponse[];
    const stats = await fetch(`${process.env.NEXT_PUBLIC_API}/statistics`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1StatisticsGetResponse;

    const convertMonthToName = (monthNumber: number) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[monthNumber];
    };

    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];

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

            <ServerGrid guilds={topGuilds} />

            <div className="md:text-xl text-lg lg:flex w-full mt-4">
                <span className="tracking-wide">
                    Experience the next-gen revolution, offering a list of features and extensive customization, providing a superior alternative to popular bots.
                </span>

                <div className="flex flex-col min-w-full lg:min-w-[420px]">

                    <div className="lg:ml-auto flex gap-2 text-xl font-medium mt-4 lg:mt-0">
                        <Link href="/login?invite=true" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 w-1/2 lg:w-fit justify-center gap-2">
                            <HiPlus className="relative top-1" />
                            <span className="block sm:hidden">Wamellow</span>
                            <span className="hidden sm:block">Invite Wamellow</span>
                        </Link>
                        <Link href="/support" className="flex dark:text-neutral-300 text-neutral-700 dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light py-2 px-4 rounded-md duration-200 w-1/2 lg:w-fit justify-center gap-2">
                            <BsDiscord className="relative top-1" />
                            <span className="block sm:hidden">Support</span>
                            <span className="hidden sm:block">Join support</span>
                        </Link>
                    </div>


                    <span className={`lg:ml-auto flex gap-2 text-neutral-500 tracking-wider ${handwritten.className} mt-3 opacity-80 pl-20 lg:pr-20 rotate-2`}>
                        <Image src="/arroww.webp" width={24} height={24} alt="arrow up" className="h-5 w-5 relative top-px" draggable={false} />
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
                            <Link href="/login?invite=true" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
                                <HiPlus />
                                <span className="block sm:hidden">Wamellow</span>
                                <span className="hidden sm:block">Invite Wamellow</span>
                            </Link>
                            <Link href="/leaderboard/1055188344188973066" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 justify-center gap-1">
                                <span className="mr-2">View Leaderboard</span>
                                <HiArrowRight className="relative top-1" />
                            </Link>
                        </div>

                    </div>

                    <div className="md:ml-auto md:w-1/2 px-3 pb-3">
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
                        <Image src="/leaderboard.webp" itemProp="image" width={1224 / 2} height={768 / 2} alt="Example leaderboard webpage" loading="lazy" />
                    </div>

                </div>

                <div className="flex flex-col-reverse md:flex-row gap-8 items-center">

                    <div className="md:ml-auto md:w-1/2 px-3 pb-3">
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3.webp",
                                bot: true
                            }}
                        >
                            <Highlight
                                mode={"DARK"}
                                text="Welcome @mwlica to **Someone's x Waya** 👋"
                            />

                            <Image src="https://cdn.discordapp.com/attachments/910283378098581535/1136399748404871228/welcome.png" itemProp="image" alt="Example welcome card" width={1024 / 2} height={(256 + 16) / 2} loading="lazy" className="lg:w-[400px] md:w-[300px] lg:h-[106px] md:h-[80px]" />

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
                            <Link href="/login?invite=true" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
                                <HiPlus />
                                <span className="block sm:hidden">Wamellow</span>
                                <span className="hidden sm:block">Invite Wamellow</span>
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
                            <Link href="/login?invite=true" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
                                <HiPlus />
                                <span className="block sm:hidden">Wamellow</span>
                                <span className="hidden sm:block">Invite Wamellow</span>
                            </Link>
                        </div>

                    </div>

                    <div className="md:ml-auto md:w-1/2 px-3 pb-3">
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
                                author={{
                                    text: "@mwlica",
                                    icon_url: "/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F821472922140803112%2Fee0026a578a9b2a0844ffa0efe9e3cf4.webp%3Fsize%3D64&w=128&q=75"
                                }}
                                image="/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Fattachments%2F883817635081506886%2F1113058694347894865%2FIMG_6864.png&w=640&q=75"
                            >
                                <Highlight mode={"DARK"} text="Like ok @sean I know you are gay but no I won’t date you" />

                                <div className="flex gap-1 mt-4">
                                    <span className="font-bold flex gap-1 items-center">⭐ 9</span>
                                    •
                                    <span className="text-blue-500 hover:underline cursor-pointer">#lounge</span>
                                </div>
                            </DiscordMessageEmbed>


                        </DiscordMessage>
                    </div>

                </div>

                <div className="flex flex-col-reverse md:flex-row gap-8 items-center">

                    <div className="md:ml-auto w-full md:w-1/2 px-3 pb-3">
                        <DiscordMessage
                            mode={"DARK"}
                            user={{
                                username: "Wamellow",
                                avatar: "/waya-v3.webp",
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
                        <h2 className={`${montserrat.className} lg:text-4xl text-3xl dark:text-neutral-100 text-neutral-900 font-semibold underline decoration-violet-400`}>Best Text to Speech, TTS</h2>
                        <div className="text-lg pt-6">
                            With Text to Speech, you{"'"}re in control of transforming text into captivating speech across various languages and over 40 distinct voices.
                            Whether you need standalone audio files or want to bring your text to life in a voice chat, Wamellow{"'"}s TTS offers versatility.
                            Embrace the power of VoiceWave and let your messages resonate with impact!
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Link href="/login?invite=true" className="flex text-neutral-200 bg-violet-600 hover:bg-violet-600/80 py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
                                <HiPlus />
                                <span className="block sm:hidden">Wamellow</span>
                                <span className="hidden sm:block">Invite Wamellow</span>
                            </Link>
                        </div>

                    </div>

                </div>

            </article>

            <div className="flex w-full rounded-md overflow-hidden">

                <div className="dark:bg-wamellow bg-wamellow-100 p-5 md:w-1/4 w-1/2">
                    <div className="text-sm mb-0.5">Guilds using us</div>
                    <div className="flex">
                        <ClientCountUp className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium" end={stats.approximateGuildCount} />
                        <span className="text-lg dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+<ClientCountUp end={stats.guildsGained} /> today</span>
                    </div>
                </div>

                <div className="dark:bg-wamellow/75 bg-wamellow-100/70 p-5 md:w-1/4 w-1/2">
                    <div className="text-sm mb-0.5">Users using us</div>
                    <div className="flex">
                        <ClientCountUp className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium" end={stats.approximateUserCount} />
                        <span className="text-lg dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+<ClientCountUp end={stats.usersGained} /> today</span>
                    </div>
                </div>

                <div className="dark:bg-wamellow bg-wamellow-100 p-5 md:w-1/4 md:block hidden">
                    <div className="text-sm mb-0.5">Votes for us</div>
                    <div className="flex">
                        <ClientCountUp className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium" end={stats.approximateVoteCount} />
                        <span className="text-lg dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+<ClientCountUp end={stats.votesGained} /> in {convertMonthToName(new Date().getMonth())}</span>
                    </div>
                </div>

                <div className="dark:bg-wamellow/75 bg-wamellow-100/70 p-5 md:w-1/4 md:block hidden">
                    <div className="flex">
                        <div className="text-sm mb-0.5">Our experience with</div>
                        <Link href="https://discordlist.gg/user/821472922140803112" className="ml-auto dark:text-neutral-400 text-neutral-600 dark:hover:text-violet-400 hover:text-violet-600 duration-300">
                            <HiInformationCircle />
                        </Link>
                    </div>
                    <div className="flex">
                        <ClientCountUp className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium" end={stats.globalGuilds} />
                        <span className="text-lg dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">guilds, 5 bots</span>
                    </div>
                </div>

            </div>


        </div>
    );
}