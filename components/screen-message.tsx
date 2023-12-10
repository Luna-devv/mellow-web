import { Button } from "@nextui-org/react";
import Link from "next/link";

import cn from "@/utils/cn";

import { ServerButton } from "./server-button";

type Props = { icon?: React.ReactNode; title: string; description: string; button?: string; top?: string; } & React.ComponentProps<typeof Button>;

export function ScreenMessage({ icon, title, description, button, top = "20vh", ...props }: Props) {

    return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ marginTop: top }}>
            <div>

                <div className="mb-10 flex flex-col items-center">
                    <span className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">{title}</span> <br />
                    <span className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold">{description}</span>
                </div>

                {(button && props.href) &&
                    <div className="w-full flex flex-col items-center">
                        <ServerButton
                            as={Link}
                            {...props}
                            className={cn("px-20", props.className)}
                            startContent={icon}
                        >
                            {button}
                        </ServerButton>
                    </div>
                }

            </div>
        </div>
    );
}