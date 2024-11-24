import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { AddButton, HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { getGuild } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";

import { getDesign, getPagination, getTopMembers } from "./api";
import Member from "./member.component";
import Pagination from "./pagination.component";

export const revalidate = 3600;

interface Props {
    params: Promise<{ guildId: string; }>;
    searchParams: Promise<{
        page: string;
        type: "messages" | "voiceminutes" | "invites";
    }>;
}

export default async function Home({ searchParams, params }: Props) {
    const search = await searchParams;
    const { guildId } = await params;

    const jar = await cookies();

    const type = search.type || "messages";
    const page = parseInt(search.page || "1");

    if (page !== 1 && !jar.get("session")) redirect(`/login?callback=/leaderboard/${guildId}%3Ftype%3Dmessages%3Fpage=${page}`);

    const guildPromise = getGuild(guildId);
    const membersPromise = getTopMembers(guildId, { page, type: type });
    const designPromise = getDesign(guildId);
    const paginationPromise = getPagination(guildId);

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
            type === "messages" ||
            type === "voiceminutes" ||
            type === "invites"
        ) &&
        pagination[type].pages >= page;

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

    return (<>
        {members
            .sort((a, b) => (b.activity[type] ?? 0) - (a.activity[type] ?? 0))
            .map((member, i) =>
                <Member
                    key={member.id}
                    member={member}
                    index={i + (page * 20) - 19}
                    type={type}
                    pagination={pagination}
                    members={members}
                />
            )}

        <Pagination
            key={type}
            searchParams={search}
            pages={pagination[type].pages}
        />
    </>);
}