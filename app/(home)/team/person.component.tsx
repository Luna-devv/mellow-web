import Image from "next/image";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { getUser } from "@/lib/discord/user";
import cn from "@/utils/cn";

export async function PersonUser({
    id,
    social
}: {
    id: string;
    social?: string;
}) {
    const user = await getUser(id);

    if (!user) return <></>;

    return (
        <Person
            username={user.username}
            globalName={user.globalName}
            social={social}
            avatarUrl={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "webp"}?size=64`}
        />
    );
}

export function Person({
    username,
    globalName,
    avatarUrl,
    social
}: {
    username: string;
    globalName: string | null;
    avatarUrl: string;
    social?: string;
}) {
    return (
        <Link
            className={cn(
                "flex items-center gap-3 h-16 p-2 pr-4 bg-wamellow rounded-full cursor-default",
                social && "duration-100 outline-violet-500 hover:outline cursor-pointer"
            )}
            href={social || "#"}
            target={social && "_blank"}
        >
            <Image
                alt={username}
                className="rounded-full shrink-0 aspect-square"
                height={48}
                src={avatarUrl}
                width={48}
            />

            <div className="mr-2">
                <div className="text-lg text-neutral-200 font-medium -mb-1.5">{globalName}</div>
                <span className="opacity-75">@{username}</span>
            </div>

            {social && <HiExternalLink className="w-5 h-5" />}
        </Link>
    );
}