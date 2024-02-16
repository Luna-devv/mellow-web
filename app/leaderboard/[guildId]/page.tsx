import { Chip, CircularProgress } from "@nextui-org/react";
import { cookies } from "next/headers";
import Image from "next/image";
import { HiBadgeCheck } from "react-icons/hi";

import InvitesIcon from "@/components/icons/invites";
import MessagesIcon from "@/components/icons/messages";
import VoiceIcon from "@/components/icons/voice";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { AddButton, HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import RickPic from "@/public/rick.gif";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import cn from "@/utils/cn";

import { getDesign, getGuild, getPagination, getTopMembers } from "./api";
import Pagination from "./pagination.component";

interface LeaderboardProps {
    params: { guildId: string };
    searchParams: { page: string, type: "messages" | "voiceminutes" | "invites" };
}

export const revalidate = 60 * 60;

export default async function Home({ params, searchParams }: LeaderboardProps) {
    if (searchParams) searchParams.type ||= "messages";

    const guildPromise = getGuild(params.guildId);
    const membersPromise = getTopMembers(params.guildId, { page: parseInt(searchParams.page || "1"), type: searchParams.type });
    const designPromise = getDesign(params.guildId);
    const paginationPromise = getPagination(params.guildId);

    const [guild, members, design, pagination] = await Promise.all([guildPromise, membersPromise, designPromise, paginationPromise]).catch(() => []);

    let error = "";
    if (guild && "message" in guild) error = guild.message as string;
    if ("message" in members) error = members.message as string;
    if ("message" in design) error = design.message as string;
    if ("message" in pagination) error = pagination.message as string;

    if (error) {
        return (
            <ScreenMessage
                top="0rem"
                title="Something went wrong on this page.."
                description={error}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    const candisplay = guild?.name && (searchParams.type === "messages" || searchParams.type === "voiceminutes" || searchParams.type === "invites") && pagination[searchParams.type].pages >= parseInt(searchParams.page || "0");

    if (!candisplay) {
        return (
            <ScreenMessage
                top="0rem"
                title="Sadly, this leaderboard can not be found.."
                description="Seems like you got a little lost here? Here's wumpus for now!"
                buttons={<>
                    <HomeButton />
                    <AddButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141 * 1.5} width={124 * 1.5} />
            </ScreenMessage>
        );
    }

    if (!members.length) {
        return (
            <ScreenMessage
                top="0rem"
                title="No members to see here.."
                description="No members could be found on this page"
                buttons={<>
                    <HomeButton />
                    <AddButton />
                </>}
            />
        );
    }

    const intl = new Intl.NumberFormat("en", { notation: "standard" });
    const key = "lbc";

    async function publish() {
        "use server";

        const cookieStore = cookies();
        const currentCircular = cookieStore.get(key)?.value;

        cookies().set(key, currentCircular !== "server" ? "server" : "next");
    }

    const cookieStore = cookies();
    const currentCircular = cookieStore.get(key)?.value;

    return (
        <>
            {members.sort((a, b) => (b.activity[searchParams.type] ?? 0) - (a.activity[searchParams.type] ?? 0)).map((member, i) =>
                <div
                    key={"leaderboard-" + searchParams.type + member.id + i}
                    className={cn("mb-4 rounded-xl p-3 flex items-center", design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60" : "dark:bg-wamellow bg-wamellow-100")}
                >
                    <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}`} size={128} alt={`${member.username}'s profile picture`} className="rounded-full h-12 w-12 mr-3" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-medium dark:text-neutral-200 text-neutral-800">{member.globalName || member.username || "Unknown user"}</span>
                            {member.id === "821472922140803112" &&
                                <Badge>Developer</Badge>
                            }
                            {member.id === "797012765352001557" &&
                                <Badge>
                                    <Image alt="" className="h-6 w-32 rounded-md" height={24} src={RickPic} width={128} />
                                </Badge>
                            }
                        </div>
                        <span className="text-sm dark:text-neutral-300 text-neutral-700">@{member.username}</span>
                    </div>

                    <div className="ml-auto flex text-xl font-medium dark:text-neutral-200 text-neutral-800">
                        <span className="mr-1">
                            {searchParams.type === "voiceminutes" ? member.activity?.formattedVoicetime : intl.format(member.activity?.[searchParams.type || "messages"])}
                        </span>

                        {(searchParams.type === "messages" || !searchParams.type) && <MessagesIcon height="0.9em" />}
                        {searchParams.type === "voiceminutes" && <VoiceIcon height="0.9em" className="mt-1 ml-1" />}
                        {searchParams.type === "invites" && <InvitesIcon height="0.9em" className="mt-1.5" />}

                    </div>

                    <form action={publish}>
                        <CircularProgress
                            as="button"
                            type="submit"
                            className="ml-4"
                            aria-label="progress"
                            size="lg"
                            color="secondary"
                            classNames={{
                                svg: "drop-shadow-md"
                            }}
                            value={
                                currentCircular === "server"
                                    ? (member.activity[searchParams.type || "messages"] * 100) / parseInt(pagination[searchParams.type || "messages"].total.toString())
                                    : (member.activity[searchParams.type || "messages"] * 100) / members[i - 1]?.activity[searchParams.type || "messages"]
                                    || 100
                            }
                            showValueLabel={true}
                        />
                    </form>

                </div>
            )}

            <Pagination key={searchParams.type} guildId={params.guildId} searchParams={searchParams} pages={pagination[searchParams.type].pages} />
        </>
    );
}

function Badge({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Chip color="secondary" size="sm" variant="flat" startContent={<HiBadgeCheck className="h-3.5 w-3.5 mr-1" />}>
            <span className="font-bold">{children}</span>
        </Chip>
    );
}