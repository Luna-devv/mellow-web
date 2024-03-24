"use client";

import { Button } from "@nextui-org/react";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { FunctionComponent } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation } from "react-icons/hi";

import cn from "@/utils/cn";

const montserrat = Montserrat({ subsets: ["latin"] });

interface Props {
    loginstate?: "LOADING" | "ERRORED" | undefined;
    message?: string
    className?: string;
    addClassName?: string;
}

const LoginButton: FunctionComponent<Props> = ({ loginstate, message, className, addClassName }) => {
    if (loginstate === "LOADING") return <></>;

    function Icon() {
        if (!loginstate) return <BsDiscord />;
        if (loginstate === "ERRORED") return <HiExclamation className="h-5 w-5" />;
    }

    return (
        <div className={className || "ml-auto"}>
            <Button
                as={Link}
                className={cn("hover:bg-blurple hover:text-white dark:bg-wamellow bg-wamellow-100", loginstate === "ERRORED" && "dark:bg-danger/80 bg-danger/80 text-white", addClassName)}
                href="/login"
                prefetch={false}
                startContent={<Icon />}
            >
                {!loginstate ?
                    <span className={`${montserrat.className} font-semibold`}>
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
};

export default LoginButton;