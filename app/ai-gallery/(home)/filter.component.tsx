"use client";

import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";

import Switch from "@/components/inputs/switch";

export default function SearchFilter(
    {
        searchParams
    }: {
        searchParams: { page: string, model: string; nsfw: string };
    }
) {
    const router = useRouter();
    const cookies = useCookies();

    const [isEmbedded, setEmbedded] = useState(false);

    useEffect(() => {
        setEmbedded(window.self !== window.top);
    }, []);

    if (isEmbedded) return <></>;

    return (
        <Popover
            offset={6}
            placement="bottom"
        >

            <Badge
                color="secondary"
                content="enable 18+"
                placement="top-left"
                isInvisible={cookies.get("dismissed-ai-nsfw") === "true"}
            >
                <PopoverTrigger>
                    <Button
                        onClick={() =>
                            cookies.set(
                                "dismissed-ai-nsfw",
                                "true",
                                {
                                    expires: 28,
                                    sameSite: "Strict"
                                }
                            )
                        }
                    >
                        Search filter
                    </Button>
                </PopoverTrigger>
            </Badge>

            <PopoverContent
                className="w-[240px] backdrop-blur-xl backdrop-brightness-50 bg-black/80"
            >
                {(titleProps) => (
                    <div className="px-1 pt-2 w-full">
                        <p className="text-small font-bold text-foreground" {...titleProps}>
                            Search options
                        </p>
                        <div className="mt-2 flex flex-col gap-2 w-full">
                            <Switch
                                name="Show 18+"
                                defaultState={searchParams.nsfw === "true"}
                                onSave={(checked) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.delete("nsfw");

                                    if (checked) params.append("nsfw", "true");

                                    router.replace(`?${params.toString()}`);
                                }}
                            />
                        </div>
                    </div>
                )}
            </PopoverContent>

        </Popover>
    );

}