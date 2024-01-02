import { CircularProgress } from "@nextui-org/react";
import { cookies } from "next/headers";
import Image from "next/image";

import ImageReduceMotion from "@/components/image-reduce-motion";
import { AddButton, HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import cn from "@/utils/cn";

import { getDesign, getGuild, getPagination, getTopMembers } from "./api";
import Pagination from "./pagination.component";

interface LeaderboardProps {
    params: { guildId: string },
    searchParams: { page: string, type: "messages" | "voiceminutes" | "invites" },
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
    if ("message" in guild) error = guild.message as string;
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
                description={"No members could be found on page " + searchParams.page || "1"}
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
                    className={cn("mb-4 rounded-md p-3 flex items-center", design?.backgroundColor ? "dark:bg-wamellow/60 bg-wamellow-100/60" : "dark:bg-wamellow bg-wamellow-100")}
                >
                    <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}`} size={128} alt={`${member.username}'s profile picture`} className="rounded-full h-12 w-12 mr-3" />
                    <div>
                        <div className="text-xl font-medium dark:text-neutral-200 text-neutral-800">{member.globalName || member.username || "Unknown user"}</div>
                        <div className="text-sm dark:text-neutral-300 text-neutral-700">@{member.username}</div>
                    </div>

                    <div className="ml-auto flex text-xl font-medium dark:text-neutral-200 text-neutral-800">
                        <span>{searchParams.type === "voiceminutes" ? member.activity?.formattedVoicetime : intl.format(member.activity?.[searchParams.type || "messages"])}</span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="0.9em"
                            viewBox={searchParams.type === "invites" ? "0 0 640 512" : "0 0 448 512"}
                            className={cn("ml-1 relative", searchParams.type === "voiceminutes" && "ml-2")}
                            style={{ top: searchParams.type === "messages" ? 0 : 4 }}
                            fill="#d4d4d4"
                        >
                            {(searchParams.type === "messages" || !searchParams.type) && <path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />}
                            {searchParams.type === "voiceminutes" && <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z" />}
                            {searchParams.type === "invites" && <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />}
                        </svg>

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