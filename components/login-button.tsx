"use client";

import { Button } from "@nextui-org/react";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation } from "react-icons/hi";

import { cn } from "@/utils/cn";

const montserrat = Montserrat({ subsets: ["latin"] });

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

interface Props {
    state?: State;
    message?: string
    className?: string;
    addClassName?: string; // idk why that name
}

export default function LoginButton({
    state,
    message,
    className,
    addClassName
}: Props) {
    if (state === State.Loading) return <></>;

    function Icon() {
        if (!state) return <BsDiscord />;
        if (state === State.Failure) return <HiExclamation className="h-5 w-5" />;
    }

    return (
        <div className={className || "ml-auto"}>
            <Button
                as={Link}
                className={cn(
                    "hover:bg-blurple hover:text-white dark:bg-wamellow bg-wamellow-100",
                    state === State.Failure && "dark:bg-danger/80 bg-danger/80 text-white",
                    addClassName
                )}
                href="/login"
                prefetch={false}
                startContent={<Icon />}
            >
                {!state ?
                    <span className={cn(montserrat.className,"font-semibold")}>
                        {message ||
                            <>
                                <span className="hidden md:block">Login with Discord</span>
                                <span className="md:hidden">Discord login</span>
                            </>
                        }
                    </span>
                    :
                    <span>Authorization failed</span>
                }
            </Button>
        </div>
    );
}