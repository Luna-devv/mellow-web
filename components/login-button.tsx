"use client";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation } from "react-icons/hi";

import { cn } from "@/utils/cn";

import { Button } from "./ui/button";

const montserrat = Montserrat({ subsets: ["latin"] });

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

interface Props {
    state?: State;
    message?: string;
    className?: string;
}

export function LoginButton({
    state,
    message,
    className
}: Props) {
    if (state === State.Loading) return <></>;
    console.log(className);

    return (
        <Button
            asChild
            className={className}
            variant={state === State.Failure ? "destructive" : "default"}
        >
            <Link
                href="/login"
                prefetch={false}
            >
                <Icon state={state} />
                {!state ?
                    <span className={cn(montserrat.className, "font-semibold")}>
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
            </Link>
        </Button>
    );
}

function Icon({ state }: { state?: State; }) {
    if (state === State.Failure) return <HiExclamation className="mt-0.5 size-5" />;
    return <BsDiscord />;
}