import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { HiBadgeCheck } from "react-icons/hi";

import { ClientBadge, ClientCircularProgress } from "@/components/client";
import DiscordAppBadge from "@/components/discord/app-badge";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { Badge } from "@/components/ui/badge";
import type { ApiV1GuildsTopmembersGetResponse, ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";
import getAverageColor from "@/utils/average-color";
import { cn } from "@/utils/cn";
import { intl } from "@/utils/numbers";

import Icon from "./icon.component";

interface Props {
    index: number;
    type: "messages" | "voiceminutes" | "invites";
    member: ApiV1GuildsTopmembersGetResponse;
    members: ApiV1GuildsTopmembersGetResponse[];
    pagination: ApiV1GuildsTopmembersPaginationGetResponse;
}

export default async function Member({
    index,
    type,
    member,
    members,
    pagination
}: Props) {
    const emojiUrl = `https://r2.wamellow.com/emoji/${member.emoji}`;
    const averageColor = member.emoji
        ? await getAverageColor(emojiUrl + "?size=16")
        : null;

    async function publish() {
        "use server";

        const jar = await cookies();
        const currentCircular = jar.get("lbc")?.value;

        jar.set(
            "lbc",
            currentCircular !== "server"
                ? "server"
                : "next"
        );
    }

    const jar = await cookies();
    const currentCircular = jar.get("lbc")?.value;

    return (
        <div
            className={cn(
                "mb-4 rounded-xl p-3 flex items-center dark:bg-wamellow bg-wamellow-100 w-full overflow-hidden"
            )}
            style={averageColor ? { backgroundColor: averageColor + "50" } : {}}
        >
            <ClientBadge
                className={cn(
                    "size-6 font-bold",
                    (() => {
                        if (index === 1) return "bg-[#ffe671] text-[#ff9e03] border-2 border-[#1c1b1f]";
                        if (index === 2) return "bg-[#c1e5fb] text-[#6093ba] border-2 border-[#1c1b1f]";
                        if (index === 3) return "bg-[#f8c396] text-[#c66e04] border-2 border-[#1c1b1f]";
                        return "bg-[#1c1b1f]";
                    })()
                )}
                showOutline={false}
                content={
                    <span className="px-[3px]">
                        {intl.format(index)}
                    </span>
                }
                size="sm"
                placement="bottom-left"
            >
                <ImageReduceMotion
                    alt={`${member.username}'s profile picture`}
                    className="rounded-full h-12 w-12 mr-3"
                    url={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}`}
                    size={128}
                />
            </ClientBadge>

            <div className="w-full md:max-w-fit">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-medium dark:text-neutral-200 text-neutral-800 truncate">
                        {member.globalName || member.username || "Unknown user"}
                    </span>
                    {member.bot &&
                        <DiscordAppBadge />
                    }
                    {member.id === "821472922140803112" &&
                        <UserBadge>Developer</UserBadge>
                    }
                    {member.id === "845287163712372756" &&
                        <UserBadge>WOMEN</UserBadge>
                    }
                </div>
                <div className="text-sm dark:text-neutral-300 text-neutral-700 truncate">
                    @{member.username}
                </div>
            </div>

            {member.emoji &&
                <div className="w-full hidden sm:block relative mr-6 -ml-48 md:-ml-6 lg:ml-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 w-full gap-2 absolute -bottom-9 rotate-1">
                        {new Array(12).fill(0).map((_, i) =>
                            <Emoji
                                key={"emoji-" + member.id + i}
                                index={i}
                                emojiUrl={emojiUrl}
                            />
                        )}
                    </div>
                </div>
            }

            <div className="ml-auto flex text-xl font-medium dark:text-neutral-200 text-neutral-800">
                <span className="mr-1 break-keep text-nowrap">
                    {type === "voiceminutes"
                        ? member.activity?.formattedVoicetime
                        : intl.format(member.activity?.[type || "messages"])
                    }
                </span>

                <Icon type={type} />
            </div>

            <form action={publish}>
                <ClientCircularProgress
                    as="button"
                    type="submit"
                    className="ml-4"
                    aria-label="progress"
                    size="lg"
                    color={
                        currentCircular === "next"
                            ? "default"
                            : "secondary"
                    }
                    classNames={{
                        svg: "drop-shadow-md"
                    }}
                    value={
                        currentCircular === "next"
                            ? (member.activity[type] * 100) / (members[index - 1]?.activity[type] || 1)
                            : (member.activity[type] * 100) / parseInt(pagination[type].total.toString())
                            || 100
                    }
                    showValueLabel={true}
                />
            </form>

        </div >
    );

}

function UserBadge({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <Link
            prefetch={false}
            href="/team?utm_source=wamellow.com&utm_medium=leaderboard"
            target="_blank"
        >
            <Badge
                variant="flat"
                radius="rounded"
            >
                <HiBadgeCheck />
                {children}
            </Badge>
        </Link>
    );
}

function Emoji({
    index,
    emojiUrl
}: {
    index: number;
    emojiUrl: string;
}) {
    return (
        <Image
            alt=""
            className="rounded-xl relative size-8 aspect-square"
            draggable={false}
            height={64}
            src={emojiUrl}
            style={{
                transform: `rotate(${(index / 2.3) * 360 + index}deg)`,
                top: `${index * 2 % 4}px`,
                left: `${index * 8 / 2}px`
            }}
            width={64}
        />
    );
}