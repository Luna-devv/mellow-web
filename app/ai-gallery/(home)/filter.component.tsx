"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Switch from "@/components/inputs/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchFilter(
    {
        searchParams
    }: {
        searchParams: {
            page: string;
            model: string;
            nsfw: string;
        };
    }
) {
    const router = useRouter();

    const [isEmbedded, setEmbedded] = useState(false);

    useEffect(() => {
        setEmbedded(window.self !== window.top);
    }, []);

    if (isEmbedded) return <></>;

    return (
        <Popover
        >
            <PopoverTrigger asChild>
                <Button>
                    Search Filter
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="space-y-2"
                align="end"
            >
                <h4 className="font-medium leading-none">Search Options</h4>
                <div className="flex flex-col gap-2 w-full">
                    <Switch
                        className="-mb-5"
                        name="Show 18+"
                        defaultState={searchParams.nsfw === "true"}
                        onSave={(checked) => {
                            const params = new URLSearchParams(searchParams);
                            params.delete("nsfw");

                            if (!checked) params.append("nsfw", "true");

                            router.replace(`?${params.toString()}`);
                        }}
                    />
                </div>
            </PopoverContent>

        </Popover>
    );

}