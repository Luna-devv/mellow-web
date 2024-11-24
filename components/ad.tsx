"use client";

import { Button } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import type { FunctionComponent } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

import { cn } from "@/utils/cn";

const poppins = Poppins({ subsets: ["latin"], weight: "700" });

interface Props {
    title?: string;
    description?: string;
    button?: string;
    url?: string;
    color?: "violet" | "green" | "red";
}

const Ad: FunctionComponent<Props> = ({
    title = "Wamellow for you",
    description = "Experience the next-gen revolution: ranks, image & web leaderboards, text to speech and more.",
    button = "Add to your server",
    url = "/login?invite=true",
    color = "violet"
}) => {
    const colorVariants = {
        violet: {
            bg: "from-violet-900/80 to-indigo-900/80",
            t: "from-violet-300 to-violet-400"
        },
        green: {
            bg: "from-teal-900/80 to-emerald-900/80",
            t: "from-emerald-300 to-emerald-400"
        },
        red: {
            bg: "from-rose-900/80 to-pink-900/80",
            t: "from-rose-300 to-rose-400"
        }
    };

    return (
        <div className={cn("w-full bg-gradient-to-br from-40% rounded-md py-3 px-4", colorVariants[color].bg)}>
            <div className={cn("font-bold text-2xl bg-gradient-to-b bg-clip-text text-transparent mb-2", colorVariants[color].t, poppins.className)}>{title}</div>
            <div className="text-violet-100/60">
                {description}
            </div>

            <Button
                as={Link}
                className="mt-3 font-medium"
                href={url}
                target="_blank"
                prefetch={false}
                endContent={<HiArrowNarrowRight />}
            >
                {button}
            </Button>
        </div>
    );
};

export default Ad;