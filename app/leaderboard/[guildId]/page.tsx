import { cookies } from "next/headers";
import Image from "next/image";

import { AddButton, HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { getGuild } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";

import { getDesign, getPagination, getTopMembers } from "./api";
import Pagination from "./pagination.component";
import { redirect } from "next/navigation";
import Member from "./member.component";

export const revalidate = 60 * 60;

export default async function Home({
    params,
    searchParams
}: {
    params: { guildId: string };
    searchParams: { page: string, type: "messages" | "voiceminutes" | "invites" };
}) {
    const cookieStore = cookies();

    if (searchParams) searchParams.type ||= "messages";
    const page = parseInt(searchParams.page || "1");

    if (page !== 1 && !cookieStore.get("hasSession")) redirect("/login?callback=/leaderboard/%5BguildId%5D/messages%3Fpage=" + page)

    const guildPromise = getGuild(params.guildId);
    const membersPromise = getTopMembers(params.guildId, { page, type: searchParams.type });
    const designPromise = getDesign(params.guildId);
    const paginationPromise = getPagination(params.guildId);

    const [guild, members, design, pagination] = await Promise.all([guildPromise, membersPromise, designPromise, paginationPromise]).catch(() => []);

    let error = "";
    if (guild && "message" in guild) error = guild.message;
    if (members && "message" in members) error = members.message;
    if (design && "message" in design) error = design.message;
    if (pagination && "message" in pagination) error = pagination.message;

    // wtf is this
    if (error || !guild || !members || !design || !pagination || "message" in guild || "message" in members || "message" in design || "message" in pagination) {
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
                <Image src={SadWumpusPic} alt="" height={141 * 1.5} width={124 * 1.5} />
            </ScreenMessage>
        );
    }

    const candisplay = guild.name &&
        (
            searchParams.type === "messages" ||
            searchParams.type === "voiceminutes" ||
            searchParams.type === "invites"
        ) &&
        pagination[searchParams.type].pages >= parseInt(searchParams.page || "0");

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

    if (!Array.isArray(members) || !members.length) {
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

    return (
        <>
            {members
                .sort((a, b) => (b.activity[searchParams.type] ?? 0) - (a.activity[searchParams.type] ?? 0))
                .map((member, i) =>
                    <Member
                        key={member.id}
                        member={member}
                        index={i + (page * 20) - 19}
                        type={searchParams.type}
                        pagination={pagination}
                        members={members}
                    />
                )}

            <Pagination
                key={searchParams.type}
                searchParams={searchParams}
                pages={pagination[searchParams.type].pages}
            />
        </>
    );
}