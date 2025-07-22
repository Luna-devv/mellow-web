import { LoaderCircleIcon } from "lucide-react";

import { cn } from "@/utils/cn";

export function LoadingCircle({ className = "" }: { className?: string; }) {
    return (
        <LoaderCircleIcon className={cn("animate-spin size-8", className)} strokeWidth={2.5} />
    );
}