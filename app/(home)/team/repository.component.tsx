import Link from "next/link";
import { HiBeaker, HiExternalLink, HiStar } from "react-icons/hi";

import { ClientChip } from "@/components/client";
import { getRepository } from "@/lib/github";
import { cn } from "@/utils/cn";

export async function Repository({
    fullname
}: {
    fullname: string;
}) {
    const repo = await getRepository(fullname);

    if (!repo) return <></>;

    return (
        <Link
            className={cn(
                "flex items-center gap-3 p-4 bg-wamellow rounded-xl cursor-default",
                "duration-100 outline-violet-500 hover:outline cursor-pointer"
            )}
            href={repo.html_url}
            target="_blank"
        >
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-lg text-neutral-200 font-medium -mb-0.5">
                        {repo.full_name}
                    </span>
                    <ClientChip
                        startContent={<HiStar className="mx-0.5 size-4" />}
                        variant="flat"
                        color="secondary"
                        size="sm"
                    >
                        {repo.stargazers_count}
                    </ClientChip>
                    <ClientChip
                        startContent={<HiBeaker className="mx-1 size-3" />}
                        size="sm"
                    >
                        {repo.language}
                    </ClientChip>
                </div>
                <span className="opacity-75">{repo.description}</span>
            </div>

            <HiExternalLink className="ml-auto w-5 h-5" />
        </Link>
    );
}