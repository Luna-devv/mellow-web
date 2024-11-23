import { Button } from "@nextui-org/react";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiHome } from "react-icons/hi";

import { cn } from "@/utils/cn";

import { ClientButton } from "./client";

type Props = {
    title: string;
    description: string;
    top?: string;

    /**
     * @deprecated
     */
    icon?: React.ReactNode;
    /**
     * @deprecated
     */
    button?: string;

    buttons?: React.ReactNode;
    children?: React.ReactNode;
} & React.ComponentProps<typeof Button>;

export function ScreenMessage({
    title,
    description,
    top = "16vh",

    icon,
    button,

    buttons,
    children,
    ...props
}: Props) {

    return (
        <div className="w-full h-full flex flex-col items-center justify-center md:my-0 my-40">

            <div style={{ marginTop: top }} />

            {children &&
                <div className={cn("relative bottom-8", buttons ? "ml-8" : "ml-4")}>
                    {children}
                </div>
            }

            <div>

                <div className="mb-8 flex flex-col items-center text-center">
                    <span className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">{title}</span> <br />
                    <span className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold max-w-xl">{description}</span>
                </div>

                {(button && props.href) &&
                    <div className="w-full flex flex-col items-center">
                        <ClientButton
                            as={Link}
                            {...props}
                            className={cn("px-20", props.className)}
                            startContent={icon}
                        >
                            {button}
                        </ClientButton>
                    </div>
                }

                {buttons &&
                    <div className="w-full flex flex-col items-center">
                        <div className="flex flex-wrap gap-2">
                            {buttons}
                        </div>
                    </div>
                }

            </div>

        </div>
    );
}

export function HomeButton() {
    return (
        <ClientButton
            as={Link}
            href="/"
            startContent={<HiHome />}
        >
            Go back to Home
        </ClientButton>
    );
}

export function AddButton() {
    return (
        <ClientButton
            as={Link}
            className="button-primary"
            href="/login?invite=true"
            prefetch={false}
            startContent={<BsDiscord />}
        >
            Add Wamellow to your server
        </ClientButton>
    );
}

export function SupportButton() {
    return (
        <ClientButton
            as={Link}
            className="button-primary"
            href="/support"
            startContent={<BsDiscord />}
        >
            Join support server
        </ClientButton>
    );
}