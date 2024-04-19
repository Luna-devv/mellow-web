import { HTMLProps } from "react";
import { HiCheck } from "react-icons/hi";

import cn from "@/utils/cn";

export default function DiscordAppBadge({
    className,
    children,
    ...props
}: HTMLProps<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "!text-xxs text-white bg-blurple rounded py-[1px] px-1 h-4 inline-flex items-center",
                className
            )}
            {...props}
        >
            <HiCheck />
            <span className="ml-1">
                {children || "APP"}
            </span>
        </div>
    );
}