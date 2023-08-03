
import { readFile } from "fs/promises";
import Image from "next/image";
import Link from "next/link";
import { BiCopyright } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { HiArrowRight, HiCube, HiPlus } from "react-icons/hi";

import Highlight from "@/components/discord/Markdown";
import DiscordMessage from "@/components/discord/Message";
import DiscordMessageEmbed from "@/components/discord/MessageEmbed";
import { ListTab } from "@/components/List";
import { ApiV1TopguildsGetResponse } from "@/typings";
import { truncate } from "@/utils/truncate";

export default async function Home() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 60 } }).then((res) => res.json()) as ApiV1TopguildsGetResponse[];

    const uwus = ["UwU", "uwu", "OwO", "owo", "QwQ", "qwq", ">:(", "Femboys ❤️"];
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    const version = (await readFile(".git/FETCH_HEAD")).toString();

    const InnerMarquee = ({ id }: { id: number }) => (
        <>
            {topGuilds.slice(id === 2 ? 10 : 0, id * 10)?.map((guild) => (
                <div className="dark:bg-wamellow bg-wamellow-100 py-4 px-5 flex items-center rounded-lg w-72 drop-shadow-md" key={Math.random().toString()}>
                    <Image src={(guild.icon && !guild.icon.includes("null")) ? guild.icon : "/discord.png"} width={52} height={52} alt="Server" className="rounded-full" />
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

            <div className="lg:mt-24 mt-16 mb-4 max-w-full w-full">
                <h2 className="lg:text-3xl text-2xl dark:text-neutral-100 text-neutral-900 font-medium">Widely used in servers</h2>
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

            <div className="flex gap-8 my-10 items-center">

                <div className="w-1/2">
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

                <div className="ml-auto w-1/2 px-3 pb-3">
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
                    <Image src="/leaderboard.webp" width={1224} height={768} alt="leaderboards" />
                </div>

            </div>

            <div className="flex gap-8 my-10 items-center">

                <div className="ml-auto w-1/2 px-3 pb-3">
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

                        <Image src="https://cdn.discordapp.com/attachments/910283378098581535/1136399748404871228/welcome.png" alt="Welcome banner" width={1024} height={256 + 16} className="w-[400px] h-[106px]" />

                    </DiscordMessage>
                </div>

                <div className="text-left w-1/2">
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

            <div className="text-neutral-500 w-full mt-10 mb-6 text-left">

                <div className="flex items-center dark:text-neutral-100 text-neutral-900 gap-2">
                    <BsDiscord className="relative top-[1px] text-[#f8746e]" />
                    <span className="text-xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Wamellow</span>
                    <span className="text-xl bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">for</span>
                    <span className="text-xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">discord</span>
                </div>

                <div className="mb-3 text-sm">
                    <span className="flex gap-1 items-center">
                        <BiCopyright />
                        Waya {new Date(1635609600000).getFullYear()} - {new Date().getFullYear()}, not affiliated with Discord Inc.
                    </span>
                    <span className="flex gap-1 items-center">
                        <HiCube />
                        Version {version.toString().slice(0, 7)} on {version.match(/'\w*'/)?.[0].slice(1, -1)}
                    </span>
                </div>

                <div className="flex gap-2 mt-2 dark:text-neutral-400 text-neutral-600 select-none">
                    <Link href="/terms" className="dark:bg-wamellow/80 dark:hover:bg-wamellow-alpha bg-wamellow-100/80 hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Terms of Service</Link>
                    <Link href="/privacy" className="dark:bg-wamellow/80 dark:hover:bg-wamellow-alpha bg-wamellow-100/80 hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Privacy Policy</Link>
                    <Link href="/support" className="dark:bg-wamellow/80 dark:hover:bg-wamellow-alpha bg-wamellow-100/80 hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Support</Link>
                </div>

            </div>

        </div>
    );
}