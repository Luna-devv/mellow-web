import { Metadata } from "next";
import Image from "next/image";
import { BsGithub } from "react-icons/bs";

import MommyPic from "@/public/mommy.webp";
import { filterDuplicates } from "@/utils/filter-duplicates";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import { members, repos, TeamType } from "./constants";
import { Person, PersonUser } from "./person.component";
import { Repository } from "./repository.component";

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
            <div className="max-w-xl mt-1">
                Meet the creators of Wamellow and its products. Our dedicated team, including developers and donors, drives innovation and community growth
            </div>

            <div className="relative divide-y-1 divide-wamellow mb-10">
                {filterDuplicates(members.map((person) => person.team)).map((team) => (
                    <div
                        key={team}
                        className="py-5"
                    >
                        <h3 className="text-lg font-medium text-neutral-200">
                            {team.split("-").map((str) => str.replace(/^\w/, (char) => char.toUpperCase())).join(" ")}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-3">
                            {members
                                .filter((person) => person.team === team)
                                .map((person) => (
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

            <h2 className="text-2xl font-medium text-neutral-200">Open Source <BsGithub className="inline ml-1 mb-1" /></h2>
            <div className="max-w-xl mt-1">
                Some parts of Wamellow are open source and available on GitHub. We welcome contributions from the community to help us improve our products and services.
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3 py-5">
                {repos.map((repo) => (
                    <Repository
                        key={repo}
                        fullname={repo}
                    />
                ))}
            </div>

        </div>
    );
}