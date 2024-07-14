import { HiExclamation, HiExclamationCircle } from "react-icons/hi";

import cn from "@/utils/cn";

export enum NoticeType {
    Error = "error",
    Info = "info"
}

interface Props {
    className?: string;
    message: string;
    type?: NoticeType;
    location?: "side" | "bottom";
    children?: React.ReactNode;
}

export default function Notice({
    className,
    message,
    type,
    location = "side",
    children
}: Props) {

    return (
        <div
            className={cn(
                "w-full text-neutral-100 py-2 px-4 mb-6 rounded-md flex gap-2",
                location === "side" ? "flex-row items-center" : "flex-col",
                type === NoticeType.Info ? "bg-violet-400/40" : "bg-red-400/40",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {type === NoticeType.Info
                    ? <HiExclamationCircle className="size-4" />
                    : <HiExclamation className="size-4" />
                }
                <div className="text-medium">
                    {message}
                </div>
            </div>

            {children &&
                <div className={cn(location === "side" && "ml-auto")}>
                    {children}
                </div>
            }
        </div>
    );
}