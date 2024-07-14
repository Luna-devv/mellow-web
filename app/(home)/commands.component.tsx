import { Chip } from "@nextui-org/react";
import { HiFire, HiInformationCircle } from "react-icons/hi";

import Box from "@/components/box";
import { defaultFetchOptions } from "@/lib/api";
import { intl } from "@/utils/numbers";

interface Commands {
    name: string;
    description: string;
    uses: number;
}

export async function Commands() {

    const commands = await fetch(`${process.env.NEXT_PUBLIC_API}/commands`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as Commands[] | null;

    return (
        <Box
            none
            className="p-5 pb-3 dark:bg-wamellow bg-wamellow-100 rounded-lg my-4 w-full"
        >
            <div className="flex">
                <Chip
                    color="secondary"
                    variant="flat"
                    size="sm"
                    startContent={<HiFire className="ml-1" />}
                >
                    <span className="font-semibold">Popular Slash Commands</span>
                </Chip>
                <div className="ml-auto flex items-center gap-1 opacity-80">
                    <span className="text-xs">Since 7th December</span>
                    <HiInformationCircle />
                </div>
            </div>

            {commands && Array.isArray(commands) ?
                <div className="divide-y divide-wamellow">
                    {commands
                        .sort((a, b) => b.uses - a.uses)
                        .slice(0, 6)
                        .map((command) => (
                            <div
                                key={command.name}
                                className="text-base py-4 flex flex-col md:flex-row gap-4 md:items-center"
                            >
                                <div className="-mb-2 md:mb-0 flex items-center h-min">
                                    <span className="dark:text-neutral-100 text-neutral-900 text-xl font-semibold md:font-medium">/{command.name}</span>
                                    <span className="ml-auto italic text-sm md:hidden opacity-80">{intl.format(command.uses)} uses</span>
                                </div>
                                <span>{command.description}</span>
                                <span className="ml-auto italic text-sm hidden md:block">{intl.format(command.uses)} uses</span>
                            </div>
                        ))
                    }
                </div>
                :
                <div className="flex flex-col items-center my-10">
                    <div className="text-3xl dark:text-neutral-100 text-neutral-900 font-semibold mb-4">Something went wrong...</div>
                    <div className="text-md dark:text-neutral-400 text-neutral-600 font-semibold">The commands list could not be loaded at this time</div>
                </div>
            }

        </Box>
    );
}