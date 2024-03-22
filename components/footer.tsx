import Image from "next/image";
import Link from "next/link";
import { HTMLProps } from "react";
import { BiCopyright, BiLogoGithub, BiLogoGmail, BiLogoTiktok, BiLogoTwitter, BiLogoYoutube } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { HiCube, HiHand, HiLibrary, HiUserAdd } from "react-icons/hi";
import { SiKofi } from "react-icons/si";

import TopggIcon from "@/components/icons/topgg";
import BlahajPic from "@/public/blahaj.webp";
import LunaPic from "@/public/luna.webp";
import cn from "@/utils/cn";

export default function Footer(props: HTMLProps<HTMLDivElement>) {
    return (
        <div
            className={cn("text-neutral-500 w-full mt-10 text-left", props.className)}
            {...props}
        >

            <div className="flex items-center dark:text-neutral-100 text-neutral-900 gap-1 font-semibold">
                <BsDiscord className="relative top-[1px] text-[#f8746e]" />
                <span className="text-xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Wamellow</span>
                <span className="text-xl bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">for</span>
                <span className="text-xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Discord</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-2 justify-between">
                <div>
                    <div className="mb-3">
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

                    <Socials />
                </div>

                <Links />
            </div>

            <div className="w-full flex justify-center mt-20 mb-4 hover:rotate-2 duration-500">
                <Image src={BlahajPic} alt="Blahaj" width={1500 / 2} height={775 / 2} className="h-42" />
            </div>
        </div>
    );
}

function Socials() {
    return (

        <div className="ml-auto svg-max flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <Link href="https://tiktok.com/@wamellow.com" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow on TikTok">
                <BiLogoTiktok />
                <span className="sr-only">Wamellow on TikTok</span>
            </Link>
            <Link href="https://youtube.com/@wayabot" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow on YouTube">
                <BiLogoYoutube />
                <span className="sr-only">Wamellow on YouTube</span>
            </Link>
            <Link href="https://twitter.com/licamw" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow on Twitter (X.com)">
                <BiLogoTwitter />
                <span className="sr-only">Wamellow on Twitter</span>
            </Link>
            <Link href="https://github.com/Luna-devv" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Wamellow's developers on GitHub">
                <BiLogoGithub />
                <span className="sr-only">Wamellow{"'"}s developers on GitHub</span>
            </Link>
            <Link href="mailto:support@waya.one" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-6 w-6" aria-label="Contact Wamellow via email">
                <BiLogoGmail />
                <span className="sr-only">Contact Wamellow via email</span>
            </Link>
            <Link href="https://lunish.nl/kofi" className="text-neutral-400 hover:dark:text-neutral-300 hover:text-neutral-700 duration-200 h-[22px] w-[22px]" aria-label="Support Wamellow's developers monetarily on Kofi">
                <SiKofi />
                <span className="sr-only">Support Wamellow{"'"}s developers monetarily on Kofi</span>
            </Link>
            <Link href="/vote" className="text-[#ff3366] duration-200 h-6 w-6" aria-label="Wamellow on top.gg">
                <TopggIcon />
                <span className="sr-only">Wamellow on top.gg</span>
            </Link>
            <Link href="/wumpus" className="text-neutral-400 hover:text-[#b6a5e3] duration-200 h-6 w-6 -ml-0.5" aria-label="Wamellow on wumpus.store">
                <Image
                    alt="Wumpus.store"
                    height={24}
                    src="https://cdn.discordapp.com/emojis/1184215185964146728.webp?size=96&quality=lossless"
                    width={24}
                />
                <span className="sr-only">Wamellow on wumpus.store</span>
            </Link>
        </div>
    );
}

function Links() {
    return (
        <div className="flex gap-12 dark:text-neutral-400 text-neutral-600 select-none">
            <div>
                <div className="font-medium dark:text-neutral-300 text-neutral-800 mb-1">Legal blah blah</div>
                <Link
                    className="flex items-center gap-1.5"
                    href="/terms?utm_source=wamellow.com&utm_medium=footer"
                >
                    <HiLibrary />
                    <span>Terms of Service</span>
                </Link>
                <Link
                    className="flex items-center gap-2"
                    href="/privacy?utm_source=wamellow.com&utm_medium=footer"
                >
                    <HiHand />
                    <span>Privacy Policy</span>
                </Link>
            </div>
            <div>
                <div className="font-medium dark:text-neutral-300 text-neutral-800 mb-1">Links</div>
                <Link
                    className="flex items-center gap-2"
                    href="/support"
                >
                    <BsDiscord />
                    Support
                </Link>
                <Link
                    className="flex items-center gap-2"
                    href="/login?invite=true"
                >
                    <HiUserAdd />
                    Invite
                </Link>
            </div>
        </div>
    );
}
