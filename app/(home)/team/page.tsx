import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { getUser } from "@/lib/discord/user";
import { filterDuplicates } from "@/lib/filter-duplicates";
import MommyPic from "@/public/mommy.webp";
import cn from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

enum TeamType {
    Developer = "developer",
    AdditionalProgramming = "additional-programming",
    Blahaj = "blahaj",
    Donator = "donator"
}

const data = [
    {
        id: "821472922140803112",
        team: TeamType.Developer,
        social: "https://lunish.nl/kofi"
    },

    {
        name: "Lea",
        avatarUrl: "/lea.webp",
        team: TeamType.Blahaj
    },
    {
        name: "Lucy",
        avatarUrl: "/lucy.webp",
        team: TeamType.Blahaj
    },
    {
        name: "Lauren",
        avatarUrl: "/lauren.webp",
        team: TeamType.Blahaj
    },

    {
        id: "845287163712372756",
        team: TeamType.AdditionalProgramming,
        social: "https://ko-fi.com/aurora_loves_women"
    },
    {
        id: "903534295652663326",
        team: TeamType.AdditionalProgramming,
        social: "https://ismcserver.online"
    },

    {
        id: "301482272497074189",
        team: TeamType.Donator
    },
    {
        id: "797012765352001557",
        team: TeamType.Donator,
        social: "https://crni.xyz/"
    },
    {
        id: "1044032607207301160",
        team: TeamType.Donator,
        social: "https://notifyme.bot/"
    },
    {
        id: "742224557632389160",
        team: TeamType.Donator
    },
    {
        id: "340243638892101646",
        team: TeamType.Donator,
        social: "https://sattler.dev/"
    },
    {
        id: "911823996767600730",
        team: TeamType.Donator,
        social: "https://ibcheechy.com/"
    }
] as const;

export const generateMetadata = async (): Promise<Metadata> => {
    const title = "Team";
    const description = "Meet the creators of Wamellow and its products. Our dedicated team, including developers and donors, drives innovation and community growth.";
    const url = getCanonicalUrl("team");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: {
                url: `${getBaseUrl()}/mommy.webp`,
                type: "image/webp"
            }
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: {
                url: `${getBaseUrl()}/mommy.webp`,
                alt: title
            }
        }
    };
};

export default function Home() {
    return (
        <div>
            <h2 className="text-2xl font-medium text-neutral-200">Team 🍪</h2>
            <div className="max-w-xl">
                Meet the creators of Wamellow and its products. Our dedicated team, including developers and donors, drives innovation and community growth
            </div>

            <div className="relative divide-y-1 divide-wamellow">
                {filterDuplicates(data.map((person) => person.team)).map((team) => (
                    <div
                        key={team}
                        className="py-5"
                    >
                        <h3 className="text-lg font-medium text-neutral-200">
                            {team.split("-").map((str) => str.replace(/^\w/, (char) => char.toUpperCase())).join(" ")}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-3">
                            {data
                                .filter((person) => person.team === team)
                                .map((person) => (
                                    person.team === TeamType.Blahaj
                                        ?
                                        <Person
                                            key={person.name}
                                            username={person.name.toLowerCase()}
                                            globalName={person.name}
                                            avatarUrl={person.avatarUrl}
                                            social={"social" in person ? person.social as string : undefined}
                                        />
                                        :
                                        <PersonUser
                                            key={person.id}
                                            id={person.id}
                                            social={"social" in person ? person.social as string : undefined}
                                        />
                                ))
                            }
                        </div>
                    </div>
                ))}

                <Image
                    alt="no mommy? 😢"
                    className="absolute right-0 top-0 shrink-0 aspect-square rounded-lg"
                    height={128}
                    src={MommyPic}
                    width={128}
                />
            </div>

        </div>
    );
}

async function PersonUser({
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

function Person({
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