
import { readFile } from "fs/promises";
import Link from "next/link";
import { BiCopyright, BiLogoGithub, BiLogoGmail, BiLogoTiktok, BiLogoTwitter, BiLogoYoutube } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { HiCube } from "react-icons/hi";
import { SiKofi } from "react-icons/si";

import TopggIcon from "@/components/icons/topgg";

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {

    const version = (await readFile(".git/FETCH_HEAD")).toString();

    return (
        <div className="w-full">
            {children}

            <div className="text-neutral-500 w-full mt-10 mb-6 text-left">

                <div className="flex items-center dark:text-neutral-100 text-neutral-900 gap-2">
                    <BsDiscord className="relative top-[1px] text-[#f8746e]" />
                    <span className="text-xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Wamellow</span>
                    <span className="text-xl bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">for</span>
                    <span className="text-xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">discord</span>
                </div>

                <div className="md:flex mb-3 text-sm">

                    <div>
                        <span className="flex gap-1 items-center">
                            <BiCopyright />
                            <span>
                                <Link href="https://waya.one" className="hover:underline">Waya {new Date(1635609600000).getFullYear()} - {new Date().getFullYear()}</Link>,
                                not affiliated with Discord Inc.
                            </span>
                        </span>
                        <span className="flex gap-1 items-center">
                            <HiCube />
                            <span>
                                Version {version.toString().slice(0, 7)} by <Link className="hover:underline" href="https://lunish.nl">lunish.nl</Link>
                            </span>
                        </span>
                    </div>

                    <div className="ml-auto svg-max flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                        <Link href="https://tiktok.com/@waya.one" className="text-neutral-400 hover:text-neutral-300 duration-200 h-5 w-5">
                            <BiLogoTiktok />
                        </Link>
                        <Link href="https://youtube.com/@wayabot" className="text-neutral-400 hover:text-neutral-300 duration-200 h-5 w-5">
                            <BiLogoYoutube />
                        </Link>
                        <Link href="https://twitter.com/licamw" className="text-neutral-400 hover:text-neutral-300 duration-200 h-5 w-5">
                            <BiLogoTwitter />
                        </Link>
                        <Link href="https://github.com/Luna-devv" className="text-neutral-400 hover:text-neutral-300 duration-200 h-5 w-5">
                            <BiLogoGithub />
                        </Link>
                        <Link href="mailto:support@waya.one" className="text-neutral-400 hover:text-neutral-300 duration-200 h-5 w-5">
                            <BiLogoGmail />
                        </Link>
                        <Link href="https://lunish.nl/kofi" className="text-neutral-400 hover:text-neutral-300 duration-200 h-[18px] w-[18px]">
                            <SiKofi />
                        </Link>
                        <Link href="https://top.gg/bot/1125449347451068437" className="text-neutral-400 hover:text-[#ff3366] duration-200 h-5 w-5">
                            <TopggIcon />
                        </Link>
                    </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-2 dark:text-neutral-400 text-neutral-600 select-none">
                    <Link href="/terms" className="dark:bg-wamellow/80 dark:hover:bg-wamellow-alpha bg-wamellow-100/80 hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Terms of Service</Link>
                    <Link href="/privacy" className="dark:bg-wamellow/80 dark:hover:bg-wamellow-alpha bg-wamellow-100/80 hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Privacy Policy</Link>
                    <Link href="/support" className="dark:bg-wamellow/80 dark:hover:bg-wamellow-alpha bg-wamellow-100/80 hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200">Support</Link>
                </div>

            </div>

        </div>
    );
}