import { cn } from "@/utils/cn";
import type { HTMLProps } from "react";
import { HiCheck } from "react-icons/hi";

export default function DiscordAppBadge({
    className,
    children,
    ...props
}: HTMLProps<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "!text-xxs  text-white bg-blurple rounded py-[1px] px-1 h-4 inline-flex items-center",
                className
            )}
            {...props}
        >
            <HiCheck />
            <span className="ml-1 font-semibold">
                {children || "APP"}
            </span>
        </div>
    );
}