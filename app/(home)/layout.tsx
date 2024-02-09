import Image from "next/image";
import Link from "next/link";
import { BiCopyright, BiLogoGithub, BiLogoGmail, BiLogoTiktok, BiLogoTwitter, BiLogoYoutube } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { HiCube, HiHand, HiLibrary } from "react-icons/hi";
import { SiKofi } from "react-icons/si";

import TopggIcon from "@/components/icons/topgg";
import { ServerButton } from "@/components/server-button";
import BlahajPic from "@/public/blahaj.webp";
import LunaPic from "@/public/luna.webp";
import PronounsPic from "@/public/pronouns-bot.webp";

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {

    // const version = (await readFile(".git/FETCH_HEAD")).toString();

    return (
        <div className="w-full">
            {children}

            <div className="text-neutral-500 w-full mt-10 mb-6 text-left">

                <div className="flex items-center dark:text-neutral-100 text-neutral-900 gap-2 font-medium">
                    <BsDiscord className="relative top-[1px] text-[#f8746e]" />
                    <span className="text-xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Wamellow</span>
                    <span className="text-xl bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">for</span>
                    <span className="text-xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">discord</span>
                </div>

                <div className="md:flex mb-3 text-sm items-start">

                    <div>
                        <span className="flex gap-1 items-center">
                            <BiCopyright />
                            <span>
                                <Link href="/" className="hover:underline">Wamellow {new Date(1635609600000).getFullYear()} - {new Date().getFullYear()}</Link>,
                                not affiliated with Discord Inc.
                            </span>
                        </span>
                        <span className="flex gap-1 items-center">
                            <HiCube />
                            <span className="flex gap-0.5 items-center">
                                {/* Version {version.toString().slice(0, 7)} by */}
                                <span>
                                    Made by <Link className="hover:underline" href="/support" aria-label="lunish.nl developer">Luna</Link>
                                </span>
                                <Image src={LunaPic} alt="mwlica" width={16} height={16} className="h-4 w-4 rounded-full ml-0.5" />
                            </span>
                        </span>
                    </div>

                    <div className="ml-auto svg-max flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                        <Link href="https://tiktok.com/@wamellow.com" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow on TikTok">
                            <BiLogoTiktok />
                        </Link>
                        <Link href="https://youtube.com/@wayabot" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow on YouTube">
                            <BiLogoYoutube />
                        </Link>
                        <Link href="https://twitter.com/licamw" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow on Twitter (X.com)">
                            <BiLogoTwitter />
                        </Link>
                        <Link href="https://github.com/Luna-devv" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow's developers on GitHub">
                            <BiLogoGithub />
                        </Link>
                        <Link href="mailto:support@waya.one" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Contact Wamellow via email">
                            <BiLogoGmail />
                        </Link>
                        <Link href="https://lunish.nl/kofi" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-[22px] w-[22px]" aria-label="Support Wamellow's developers monetarily on Kofi">
                            <SiKofi />
                        </Link>
                        <Link href="https://top.gg/bot/1125449347451068437/vote" className="text-neutral-400 hover:text-[#ff3366] duration-200 h-6 w-6" aria-label="Wamellow on top.gg">
                            <TopggIcon />
                        </Link>
                    </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-2 dark:text-neutral-400 text-neutral-600 select-none">
                    <ServerButton
                        as={Link}
                        className="dark:text-neutral-400 text-neutral-400"
                        href="/terms"
                        startContent={<HiLibrary />}
                        size="sm"
                    >
                        Terms of Service
                    </ServerButton>
                    <ServerButton
                        as={Link}
                        className="dark:text-neutral-400 text-neutral-400"
                        href="/privacy"
                        startContent={<HiHand />}
                        size="sm"
                    >
                        Privacy Policy
                    </ServerButton>
                    <ServerButton
                        as={Link}
                        className="dark:text-neutral-400 text-neutral-400"
                        href="/support"
                        startContent={<BsDiscord />}
                        size="sm"
                    >
                        Support
                    </ServerButton>
                    <ServerButton
                        as={Link}
                        className="dark:text-neutral-400 text-neutral-400"
                        href="/bot/pronouns"
                        startContent={<Image src={PronounsPic} alt="" width={16} height={16} className="rounded" />}
                        size="sm"
                    >
                        Pronouns
                    </ServerButton>
                </div>

            </div>

            <div className="w-full flex justify-center mt-20 mb-4 hover:rotate-2 duration-500">
                <Image src={BlahajPic} alt="Blahaj" width={1500 / 2} height={775 / 2} className="h-42" />
            </div>

        </div>
    );
}