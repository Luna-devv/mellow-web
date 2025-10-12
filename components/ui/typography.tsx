import { cn } from "@/utils/cn";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

export function Anchor({ className, prefetch, target, children, ...props }: React.ComponentPropsWithRef<typeof Link>) {
    const t = target || (props.href.toString().startsWith("/") ? undefined : "_blank");
    return (
        <Link
            className={cn("text-violet-400 hover:underline", className)}
            prefetch={prefetch || !props.href.toString().startsWith("/login")}
            target={t}
            {...props}
        >
            {children} {t === "_blank" && <HiExternalLink className="inline" />}
        </Link>
    );
}

export function Code({ className, children, ...props }: { children: React.ReactNode; } & React.HTMLAttributes<HTMLElement>) {
    return (
        <code className={cn("font-mono bg-wamellow-100 text-primary-foreground py-0.5 px-1.5 rounded select-all", className)} {...props}>
            {children}
        </code>
    );
}

export function Ol({ className, children, ...props }: { children: React.ReactNode; } & React.HTMLAttributes<HTMLUListElement>) {
    return (
        <ol className={cn("ml-5 list-decimal [&>li]:mt-2", className)} {...props}>
            {children}
        </ol>
    );
}