
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiArrowRight, HiPlus } from "react-icons/hi";

import Highlight from "@/components/discord/Markdown";
import DiscordMessage from "@/components/discord/Message";
import DiscordMessageEmbed from "@/components/discord/MessageEmbed";
import { ListTab } from "@/components/List";
import { ApiV1StatisticsGetResponse, ApiV1TopguildsGetResponse } from "@/typings";
import { truncate } from "@/utils/truncate";

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1TopguildsGetResponse[];
    const stats = await fetch(`${process.env.NEXT_PUBLIC_API}/statistics`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1StatisticsGetResponse;

    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    const InnerMarquee = ({ id }: { id: number }) => (
        <>
            {topGuilds.slice(id === 2 ? 10 : 0, id * 10)?.map((guild) => (
                <div className="dark:bg-wamellow bg-wamellow-100 py-4 px-5 flex items-center rounded-lg w-72 drop-shadow-md" key={Math.random().toString()}>
                    <Image src={(guild.icon && !guild.icon.includes("null")) ? guild.icon : "/discord.png"} loading="lazy" width={52} height={52} alt="Server" className="rounded-full" />
                    <div className="ml-3 text-sm">
                        <div className="text-xl dark:text-neutral-200 text-neutral-800 font-medium">{truncate(guild.name, 16)}</div>
                        <div>{intl.format(guild.memberCount)} members</div>
                    </div>
                </div>
            ))}
        </>
    );

    return (
        <div className="flex items-center flex-col w-full">

            <div className="lg:text-6xl px-4 text-5xl flex font-medium relative mb-2 dark:text-neutral-100 text-neutral-900 break-words sm:text-center">
                <h1>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Next version</span>
                    {" of "}
                    <span className="underline decoration-blurple break-keep">discord bots</span>
                </h1>
                <div
                    className="bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent text-2xl relative right-2 rotate-12 select-none sm:block hidden"
                    style={{ animation: "ScaleBlink 1s ease-in-out infinite" }}
                >
                    {uwus[Math.floor(Math.random() * uwus.length)]}
                </div>
            </div>

            <div className="md:text-xl text-md p-4 max-w-4xl sm:text-center">
                Wamellow revolutionizes your experience with a plethora of features and extensive customization options, offering a superior alternative to popular bots.

                <div className="flex mt-6 justify-center gap-2 text-xl font-medium">
                    <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 w-1/2 sm:w-fit justify-center gap-2">
                        <HiPlus className="relative top-1" />
                        <span className="block sm:hidden">Wamellow</span>
                        <span className="hidden sm:block">Invite Wamellow</span>
                    </Link>
                    <Link href="/support" className="flex dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 w-1/2 sm:w-fit justify-center gap-2">
                        <BsDiscord className="relative top-1" />
                        <span className="block sm:hidden">Support</span>
                        <span className="hidden sm:block">Join support</span>
                    </Link>
                    {/* <Link href="/dashboard" className="flex border-2 dark:border-wamellow border-wamellow-100 dark:hover:border-wamellow-light hover:border-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200">
                        <span className="mr-2">Dashboard</span>
                        <HiArrowRight className="relative top-1" />
                    </Link> */}
                </div>

            </div>

            <div className="lg:mt-24 mt-16 max-w-full w-full">
                <h2 className="lg:text-3xl text-2xl dark:text-neutral-100 text-neutral-900 font-medium underline decoration-violet-400">Widely used in servers</h2>
                <div className="md:text-xl text-md pt-3">
                    Wamellow is widely embraced in many servers, including those frequented by your mum.
                </div>

                <div className="relative flex overflow-x-hidden mt-[-32px]">
                    <div className="py-12 animate-marquee whitespace-nowrap flex gap-3">
                        <InnerMarquee id={1} />
                    </div>
                    <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap ml-3 flex gap-3">
                        <InnerMarquee id={1} />
                    </div>
                </div>

                <div className="relative flex overflow-x-hidden mt-[-78px]">
                    <div className="py-12 animate-marquee-reverse whitespace-nowrap flex gap-3">
                        <InnerMarquee id={2} />
                    </div>
                    <div className="absolute top-0 py-12 animate-marquee-reverse2 whitespace-nowrap ml-3 flex gap-3">
                        <InnerMarquee id={2} />
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute bottom-12 w-full h-[190px]" style={{ background: "linear-gradient(90deg, var(--background-rgb) 0%, rgba(0,0,0,0) 4%, rgba(0,0,0,0) 96%, var(--background-rgb) 100%)" }} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:my-12 my-6 items-center">

                <div className="md:w-1/2">
                    <h2 className="lg:text-3xl text-2xl dark:text-neutral-100 text-neutral-900 font-medium underline decoration-violet-400">Fun Leveling and Lederboards</h2>
                    <div className="text-md pt-6">
                        Enhance your server{"’"}s engagement with our text-, voice- and invite based leaderboards, tailored to track and reward your most active members.
                        Craft tailored access to channels and roles, granting exclusive permissions to dedicated members.
                        By motivating your members to communicate, you{"’"}ll cultivate a more dynamic server community.
                        Drive interaction and establish a feeling of accomplishment as users advance through our engaging leaderboard framework.
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
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
                    <Image src="/leaderboard.webp" width={1224 / 2} height={768 / 2} alt="leaderboards" loading="lazy" />
                </div>

            </div>

            <div className="flex flex-col-reverse md:flex-row gap-8 md:my-12 my-6 items-center">

                <div className="md:ml-auto md:w-1/2 px-3 pb-3">
                    <DiscordMessage
                        mode={"DARK"}
                        user={{
                            username: "Wamellow",
                            avatar: "/waya-legacy1.png",
                            bot: true
                        }}
                    >
                        <Highlight
                            mode={"DARK"}
                            text="Welcome @mwlica to **Someone's x Waya** 👋"
                        />

                        <Image src="https://cdn.discordapp.com/attachments/910283378098581535/1136399748404871228/welcome.png" alt="Welcome card example" width={1024 / 2} height={(256 + 16) / 2} loading="lazy" className="lg:w-[400px] md:w-[300px] lg:h-[106px] md:h-[80px]" />

                    </DiscordMessage>
                </div>

                <div className="text-left md:w-1/2">
                    <h2 className="lg:text-3xl text-2xl dark:text-neutral-100 text-neutral-900 font-medium underline decoration-violet-400">Heyho and bye 👋</h2>
                    <div className="text-md pt-6">
                        Give a warm welcome to new members, introducing them to rules, topics, and ongoing events.
                        Ensure a positive, inclusive experience from the start, fostering community and engagement.
                        Make newcomers feel valued, enabling them to actively contribute to your vibrant channels.
                        Whether gaming, joining a guild, or casual chat, every member should sense a strong community bond.
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
                            <HiPlus />
                            <span className="block sm:hidden">Wamellow</span>
                            <span className="hidden sm:block">Invite Wamellow</span>
                        </Link>
                    </div>

                </div>

            </div>

            <div className="flex flex-col md:flex-row gap-8 md:my-12 my-6 items-center">

                <div className="md:w-1/2">
                    <h2 className="lg:text-3xl text-2xl dark:text-neutral-100 text-neutral-900 font-medium underline decoration-violet-400">Fun with Starboards</h2>
                    <div className="text-md pt-6">
                        With Starboards, you have the power to elevate remarkable messages within our server.
                        When you come across a post that deserves recognition, simply vote it up, and watch as it takes center stage for everyone to see.
                        This feature ensures that exceptional content gets the attention it deserves, fostering a lively and engaging atmosphere.
                        Join us in celebrating the best of our community by using Starboards to highlight and share messages that truly shine!
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Link href="/login?invite=true" className="flex bg-blurple hover:bg-blurple-dark text-white py-2 px-4 rounded-md duration-200 justify-center gap-2 items-center">
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
                            avatar: "/waya-legacy1.png",
                            bot: true
                        }}
                    >

                        <DiscordMessageEmbed
                            mode={"DARK"}
                            color={0xbc7ed4}
                            author={{
                                text: "@mwlica",
                                icon_url: "/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F821472922140803112%2Fa_cdc8644a3b252476c2cd801760d57180.gif%3Fsize%3D64&w=128&q=75"
                            }}
                            image="/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Fattachments%2F883817635081506886%2F1113058694347894865%2FIMG_6864.png&w=640&q=75"
                        >
                            <Highlight mode={"DARK"} text="Like ok @sean I know you are gay but no I won’t date you" />

                            <div className="flex gap-1 mt-4">
                                <span className="font-bold flex gap-1 items-center">
                                    <Image src="https://cdn.discordapp.com/emojis/858087981167542322.webp?size=24&quality=lossless" height={24} width={24} loading="lazy" className="h-4 w-4 rounded" alt="" /> 9
                                </span>
                                •
                                <span className="text-blue-500 hover:underline cursor-pointer">#lounge</span>
                            </div>
                        </DiscordMessageEmbed>


                    </DiscordMessage>
                </div>

            </div>

            <div className="flex w-full rounded-md overflow-hidden">

                <div className="dark:bg-wamellow bg-wamellow-100 p-5 md:w-1/4 w-1/2">
                    <div className="text-sm mb-0.5">Guilds using us</div>
                    <div className="flex">
                        <span className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium">{intl.format(stats.approximateGuildCount)}</span>
                        <span className="text-md dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+{intl.format(stats.guildsGained)} today</span>
                    </div>
                </div>

                <div className="dark:bg-wamellow/75 bg-wamellow-100/70 p-5 md:w-1/4 w-1/2">
                    <div className="text-sm mb-0.5">Users using us</div>
                    <div className="flex">
                        <span className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium">{intl.format(stats.approximateUserCount)}</span>
                        <span className="text-md dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+{intl.format(stats.usersGained)} today</span>
                    </div>
                </div>

                <div className="dark:bg-wamellow bg-wamellow-100 p-5 md:w-1/4 md:block hidden">
                    <div className="text-sm mb-0.5">Votes for us</div>
                    <div className="flex">
                        <span className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium">{intl.format(stats.approximateVoteCount)}</span>
                        <span className="text-md dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+{intl.format(stats.votesGained)} in {convertMonthToName(new Date().getMonth())}</span>
                    </div>
                </div>

                <div className="dark:bg-wamellow/75 bg-wamellow-100/70 p-5 md:w-1/4 md:block hidden">
                    <div className="text-sm mb-0.5">Clusters</div>
                    <div className="flex">
                        <span className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium">{intl.format(1)}</span>
                        <span className="text-md dark:text-violet-400 text-violet-600 font-medium relative top-3 ml-1">+{intl.format(1)} shards ea.</span>
                    </div>
                </div>

            </div>

        </div>
    );
}

function convertMonthToName(monthNumber: number): string {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return months[monthNumber];
}