import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { cn } from "@/utils/cn";

export default function LinkTag({
    href,
    children,
    className
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Link
            className={cn("text-violet-400 underline decoration-violet-400", className)}
            href={href}
            prefetch={false}
            target="_blank"
        >
            {children}
            <HiExternalLink className="inline ml-1 mb-0.5" />
        </Link>
    );
}