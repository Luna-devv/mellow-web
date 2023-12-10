
"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import MessageCreatorEmbed from "@/components/embed-creator";
import ErrorBanner from "@/components/Error";
import ImageUrlInput from "@/components/inputs/ImageUrlInput";
import NumberInput from "@/components/inputs/NumberInput";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import { ApiV1GuildsModulesByeGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const web = webStore((w) => w);
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [bye, setBye] = useState<ApiV1GuildsModulesByeGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/bye`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesByeGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setBye(response);
                        break;
                    }
                    default: {
                        setBye(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching bye data");
            });

    }, []);

    if (bye === undefined) return (
        <div>
            <Link href={`/dashboard/${guild?.id}/greeting`} className="button-underline relative bottom-3 mb-4">
                <HiArrowNarrowLeft /> Greetings
            </Link>
            {error && <ErrorBanner message={error} />}
        </div>
    );

    return (
        <div>

            <Link href={`/dashboard/${guild?.id}/greeting`} className="button-underline relative bottom-3 mb-4">
                <HiArrowNarrowLeft /> Greetings
            </Link>

            <Switch
                name="Bye module enabled."
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="enabled"
                defaultState={bye?.enabled || false}
                disabled={false}
                onSave={(s) => {
                    setBye({
                        ...bye,
                        enabled: s
                    });
                }}
            />

            <NumberInput
                name="After how many seconds the message should be deleted."
                description="Set to 0 to disable."
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="deleteAfter"
                defaultState={bye?.deleteAfter ?? 0}
                disabled={!bye.enabled}
            />

            <div className="flex md:gap-4 gap-3">
                <SelectMenu
                    name="Channel"
                    url={`/guilds/${guild?.id}/modules/bye`}
                    dataName="channelId"
                    items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                    description="Select the channel where the bye message should be send into."
                    defaultState={bye?.channelId}
                    disabled={!bye.enabled}
                />

                <button
                    id="test-button"
                    className={`flex justify-center items-center bg-violet-600 hover:bg-violet-600/80 text-white py-2 px-4 rounded-md duration-100 mt-8 h-12 md:w-32 ${!bye.enabled && "cursor-not-allowed opacity-50"}`}
                    onClick={() => {
                        if (document.getElementById("test-button")?.classList.contains("cursor-not-allowed")) return;
                        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/bye/test`, {
                            method: "POST",
                            headers: {
                                authorization: localStorage.getItem("token") as string
                            }
                        })
                            .then(async (res) => {
                                console.log(res);
                                const response = await res.json() as ApiV1GuildsModulesByeGetResponse;
                                if (!response) return;

                                switch (res.status) {
                                    case 200: {
                                        document.getElementById("test-button")?.classList.add(..."bg-green-700 hover:bg-green-600 cursor-not-allowed".split(" "));
                                        document.getElementById("test-button")?.classList.remove(..."bg-violet-600 hover:bg-violet-600/80".split(" "));

                                        setTimeout(() => {
                                            document.getElementById("test-button")?.classList.remove(..."bg-green-700 hover:bg-green-600 cursor-not-allowed".split(" "));
                                            document.getElementById("test-button")?.classList.add(..."bg-violet-600 hover:bg-violet-600/80".split(" "));
                                        }, 1_000 * 8);

                                        break;
                                    }
                                    default: {
                                        setError((response as unknown as RouteErrorResponse).message);
                                        break;
                                    }
                                }

                            })
                            .catch(() => {
                                setError("Error while sending test");
                            });
                    }}
                >
                    {web.width > 768 ? <span>Send Test</span> : <span>Test</span>}
                </button>
            </div>

            <MessageCreatorEmbed
                name="Message"
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="message"
                defaultMessage={bye?.message}
                messageAttachmentComponent={bye.card.enabled && <Image src={`https://image-api.wamellow.com/?type=join&username=${encodeURIComponent(user?.username as string)}&members=1090&hash=${encodeURIComponent(user?.id as string)}/${encodeURIComponent(user?.avatar as string)}${bye.card.background ? `&background=${encodeURIComponent(bye.card.background)}` : ""}`} width={1024 / 2} height={(256 + 16) / 2} loading="lazy" alt="" />}
                showMessageAttachmentComponentInEmbed={bye.card.inEmbed}
                disabled={!bye.enabled}
            >

                <div className={`mt-2 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl p-6 ${!bye.card.enabled && "pb-[0px]"}`}>

                    <Switch
                        name="Show image card."
                        url={`/guilds/${guild?.id}/modules/bye`}
                        dataName="card.enabled"
                        defaultState={bye.card.enabled}
                        disabled={!bye.enabled}
                        onSave={(s) => {
                            setBye({
                                ...bye,
                                card: {
                                    ...bye.card,
                                    enabled: s
                                }
                            });
                        }}
                    />

                    {bye.card.enabled &&
                        <>
                            <Switch
                                name="Set image inside embed."
                                url={`/guilds/${guild?.id}/modules/bye`}
                                dataName="card.inEmbed"
                                defaultState={bye.card.inEmbed || false}
                                disabled={!bye.card.enabled || !bye.enabled}
                                onSave={(s) => {
                                    setBye({
                                        ...bye,
                                        card: {
                                            ...bye.card,
                                            inEmbed: s
                                        }
                                    });
                                }}
                            />

                            <ImageUrlInput
                                name="Card Background"
                                url={`/guilds/${guild?.id}/modules/bye`}
                                ratio="aspect-[4/1]"
                                dataName="card.background"
                                description="Enter a url which should be the background for the image card. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                                defaultState={bye.card.background || ""}
                                disabled={!bye.card.enabled || !bye.enabled}
                                onSave={(v) => {
                                    setBye({
                                        ...bye,
                                        card: {
                                            ...bye.card,
                                            background: v
                                        }
                                    });
                                }}
                            />
                        </>}

                </div>

            </MessageCreatorEmbed>

        </div>
    );
}