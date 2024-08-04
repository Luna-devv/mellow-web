import Image from "next/image";
import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import { HiExternalLink } from "react-icons/hi";

import { getUser } from "@/lib/discord/user";
import cn from "@/utils/cn";

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type LinkProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export async function Person({
    id,
    social
}: {
    id: string;
    social?: string;
}) {
    const user = await getUser(id);
    if (!user) return;

    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "webp"}?size=64`;

    return (
        <Component
            className={cn(
                "flex items-center gap-3 h-16 p-2 pr-4 bg-wamellow rounded-full cursor-default",
                social && "duration-100 outline-violet-500 hover:outline cursor-pointer"
            )}
            href={social}
            target={social && "_blank"}
        >
            <Image
                alt={user.username}
                className="rounded-full shrink-0 aspect-square"
                height={48}
                src={avatarUrl}
                width={48}
            />

            <div className="mr-2">
                <div className="text-lg text-neutral-200 font-medium -mb-1.5">{user.globalName || user.username}</div>
                <span className="opacity-75">@{user.username}</span>
            </div>

            {social && <HiExternalLink className="w-5 h-5" />}
        </Component>
    );
}

function isLinkProps(props: DivProps | LinkProps): props is LinkProps {
    return "href" in props && !!props.href;
}

function Component(props: DivProps | LinkProps) {
    if (isLinkProps(props)) {
        return <Link href={props.href as string} {...props}>{props.children}</Link>;
    }

    return <div {...props}>{props.children}</div>;
}