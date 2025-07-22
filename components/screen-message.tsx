import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiHome } from "react-icons/hi";

import SadWumpusPic from "@/public/sad-wumpus.gif";
import { cn } from "@/utils/cn";

import { Button } from "./ui/button";

interface Props {
    title?: string;
    description?: string;
    top?: string;

    icon?: React.ReactNode;
    button?: string;
    href?: string;

    buttons?: React.ReactNode;
    children?: React.ReactNode;
}

export function ScreenMessage({
    title,
    description,
    top = "30vh",

    icon,
    button,
    href,

    buttons = (<>
        <HomeButton />
        <SupportButton />
    </>),
    children = <Image src={SadWumpusPic} alt="" height={141 * 1.5} width={124 * 1.5} />
}: Props) {

    return (
        <div
            className="w-full h-full flex justify-center gap-8"
            style={{ marginTop: top }}
        >

            {children && (
                <div className={cn("relative bottom-8", buttons ? "ml-8" : "ml-4")}>
                    {children}
                </div>
            )}

            <div>
                <div className="mb-8">
                    <h2 className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">{title || "Something strange happened..."}</h2>
                    <h3 className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold max-w-xl mt-1">{description || "Some error has occurred, but no worries, we're fixing it!"}</h3>
                </div>

                {button && href &&
                    <div className="w-full flex flex-col items-center">
                        <Button
                            asChild
                            variant="secondary"
                        >
                            <Link href={href}>
                                {icon}
                                {button}
                            </Link>
                        </Button>
                    </div>
                }

                {buttons && (
                    <div className="flex flex-wrap gap-2">
                        {buttons}
                    </div>
                )}
            </div>
        </div>
    );
}

export function HomeButton() {
    return (
        <Button
            asChild
            variant="secondary"
        >
            <Link href="/">
                <HiHome />
                Go back to Home
            </Link>
        </Button>
    );
}

export function AddButton() {
    return (
        <Button asChild>
            <Link
                href="/login?invite=true"
                prefetch={false}
            >
                <BsDiscord />
                Add Wamellow to your server
            </Link>
        </Button>
    );
}

export function SupportButton() {
    return (
        <Button asChild>
            <Link
                href="/support"
                prefetch={false}
            >
                <BsDiscord />
                Join support server
            </Link>
        </Button>
    );
}