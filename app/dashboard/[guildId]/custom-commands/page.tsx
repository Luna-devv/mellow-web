"use client";

import { Button, Chip, Tooltip } from "@nextui-org/react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { StatsBar } from "@/components/counter";
import MessageCreatorEmbed from "@/components/embed-creator";
import SelectInput from "@/components/inputs/SelectMenu";
import TextInput from "@/components/inputs/TextInput";
import { ScreenMessage } from "@/components/screen-message";
import { Permissions } from "@/lib/discord";
import { ApiV1GuildsModulesTagsGetResponse, RouteErrorResponse } from "@/typings";

import CreateTag, { Style } from "./create.component";
import DeleteTag from "./delete.component";

export default function Home() {
    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();
    const [tags, setTags] = useState<ApiV1GuildsModulesTagsGetResponse[]>([]);

    const pathname = usePathname();
    const search = useSearchParams();
    const router = useRouter();
    const params = useParams();

    const tagId = search.get("id");
    const tag = tags.find((t) => t.tagId === tagId);

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(search);
        params.set(name, value);

        return params.toString();
    }, [search]);

    const setTagId = (id: string) => {
        router.push(pathname + "?" + createQueryString("id", id));
    };

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/tags`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesTagsGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setTags(response);
                        if (!tagId) setTagId(response[0]?.tagId);
                        break;
                    }
                    default: {
                        setTags([]);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching tags data");
            });

    }, []);

    useEffect(() => {
        if (!tag && tags[0]) setTagId(tags[0].tagId);
    }, [tags.length]);

    if (error) {
        return <>
            <ScreenMessage
                title="Something went wrong.."
                description={error}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            />
        </>;
    }

    if (!tags) return <></>;

    function save<T extends keyof ApiV1GuildsModulesTagsGetResponse>(key: keyof ApiV1GuildsModulesTagsGetResponse, value: ApiV1GuildsModulesTagsGetResponse[T]) {
        if (!tagId) return;
        if (!tag) return;

        setTags((tags) => {
            const newtags = tags?.filter((t) => t.tagId !== tagId) || [];
            newtags.push({ ...tag, [key]: value });
            return newtags;
        });
    }

    return (
        <>

            <div className="flex flex-wrap items-center gap-2 -mt-2 mb-5">
                {tags
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((tag) => (
                        <Chip
                            key={"guildTags-" + tag.tagId}
                            as={Button}
                            className="default border-0"
                            variant={tagId === tag.tagId ? "flat" : "faded"}
                            color={tagId === tag.tagId ? "secondary" : undefined}
                            startContent={<span className="opacity-50 relative left-2">{tag.applicationCommandId ? "/" : "wm -"}</span>}
                            onClick={() => setTagId(tag.tagId)}
                        >
                            {tag.name + " "}
                        </Chip>
                    ))}
                <CreateTag guildId={guild?.id as string} style={Style.Compact} setTags={setTags} setTagId={setTagId} />

                <div className="ml-auto flex items-center gap-4">
                    <span className="dark:text-orange-600 text-orange-400 font-medium hidden md:block">This feature is in early testing</span>
                    <Tooltip content="Created tags / Limit" closeDelay={0}>
                        <span className="dark:text-neutral-600 text-neutral-400 cursor-default">{tags.length}/{30}</span>
                    </Tooltip>

                    <DeleteTag guildId={guild?.id as string} tagId={tagId} name={tag?.name} setTags={setTags} />
                </div>

            </div>

            {tag ?
                <>

                    <div className="relative rounded-md overflow-hidden">
                        <StatsBar
                            items={[
                                {
                                    name: "All time Unique Users",
                                    number: 420,
                                    gained: 69,
                                    append: "yesterday"
                                },
                                {
                                    name: "All time Command Uses",
                                    number: 69420,
                                    gained: 42,
                                    append: "yesterday"
                                }
                            ]}
                        />

                        <div className="absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full backdrop-blur-md backdrop-brightness-75" >
                            <div className="text-3xl dark:text-neutral-100 text-neutral-900 font-semibold mb-2">Nothing to see here.. yet..</div>
                            <div className="text-md dark:text-neutral-400 text-neutral-600 font-semibold">Here will be the usage of your custom commands soon</div>
                        </div>
                    </div>

                    <div className="lg:flex gap-3 mt-6">
                        <div className="lg:w-1/2">
                            <TextInput
                                key={tag.tagId}
                                name="Name"
                                url={`/guilds/${guild?.id}/modules/tags/${tag.tagId}`}
                                dataName="name"
                                description="The name of the custom command."
                                defaultState={tag.name}
                                resetState={tag.name}
                                onSave={(value) => save("name", value as string)}
                            />
                        </div>

                        <div className="lg:w-1/2">
                            <SelectInput
                                key={tag.tagId}
                                name="Permissions"
                                url={`/guilds/${guild?.id}/modules/tags/${tag.tagId}`}
                                items={
                                    Permissions.sort((a, b) => a.localeCompare(b)).map((p) => {
                                        return { name: convertCamelCaseToSpaced(p), value: p };
                                    }) || []
                                }
                                dataName="permission"
                                description="The permissions needed to execute this tag."
                                defaultState={tag.permission}
                                onSave={(option) => save("permission", option.value as string)}
                                showClear
                            />
                        </div>
                    </div>

                    <MessageCreatorEmbed
                        key={tag.tagId}
                        name="Message"
                        url={`/guilds/${guild?.id}/modules/tags/${tag.tagId}`}
                        dataName="message"
                        defaultMessage={tag.message}
                    />
                </>
                :
                <div className="w-full flex flex-col items-center justify-center" style={{ marginTop: "20vh" }}>
                    <div>

                        <div className="mb-10 flex flex-col items-center text-center">
                            <span className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">You dont have any tags yet</span> <br />
                            <span className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold">Create new custom commands to get started</span>
                        </div>

                        <div className="w-full flex flex-col items-center">
                            <CreateTag guildId={guild?.id as string} style={Style.Big} setTags={setTags} setTagId={setTagId} />
                        </div>

                    </div>
                </div>
            }

        </>
    );
}

function convertCamelCaseToSpaced(input: string): string {
    const spacedString = input.replace(/([A-Z])/g, " $1");
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}