import { StatsBar } from "@/components/counter";
import { defaultFetchOptions } from "@/lib/api";
import { convertMonthToName } from "@/utils/time";

export interface Statistics {
    approximateGuildCount: number;
    guildsGained: number;
    approximateUserCount: number;
    usersGained: number;
    approximateVoteCount: number;
    votesGained: number;
    globalGuilds: number;
}

export default async function Stats() {
    const stats = await fetch(`${process.env.NEXT_PUBLIC_API}/statistics`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as Statistics | null;

    return (
        <StatsBar
            items={[
                {
                    name: "Guilds using us",
                    number: stats?.approximateGuildCount || 0,
                    gained: stats?.guildsGained
                },
                {
                    name: "Users using us",
                    number: stats?.approximateUserCount || 0,
                    gained: stats?.usersGained || 0
                },
                {
                    name: "Votes for us",
                    number: stats?.approximateVoteCount || 0,
                    gained: stats?.votesGained || 0,
                    append: `in ${convertMonthToName(new Date().getMonth())}`
                },
                {
                    name: "Our experience with",
                    number: stats?.globalGuilds || 0,
                    gained: "guilds, 5 apps",
                    info: "https://discordlist.gg/user/821472922140803112"
                }
            ]}
        />
    );

}