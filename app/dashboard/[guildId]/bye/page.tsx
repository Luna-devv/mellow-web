
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { guildStore } from "@/common/guilds";
import { widthStore } from "@/common/width";
import ErrorBanner from "@/components/Error";
import NumberInput from "@/components/inputs/NumberInput";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import MessageCreatorEmbed from "@/components/messageCreator/Embed";
import { ApiV1GuildsModulesByeGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const width = widthStore((w) => w);
    const guild = guildStore((g) => g);

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
            {error && <ErrorBanner message={error} />}
        </div>
    );

    return (
        <div>

            <Switch
                name="Bye module enabled."
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="enabled"
                defaultState={bye?.enabled || false}
                disabled={false}
            />

            <NumberInput
                name="After how many seconds the message should be deleted."
                description="Set to 0 to disable."
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="deleteAfter"
                defaultState={bye?.deleteAfter ?? 0}
                disabled={false}
            />

            <div className="flex md:gap-4 gap-3">
                <SelectMenu
                    name="Channel"
                    url={`/guilds/${guild?.id}/modules/bye`}
                    dataName="channelId"
                    items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                    description="Select the channel where the bye message should be send into."
                    __defaultState={bye?.channelId}
                />

                <button
                    id="test-button"
                    className="flex justify-center items-center bg-violet-600 hover:bg-violet-600/80 text-white py-2 px-4 rounded-md duration-200 mt-8 h-12 md:w-32"
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
                    {width > 768 ? <span>Send Test</span> : <span>Test</span>}
                </button>
            </div>

            <MessageCreatorEmbed
                name="Message"
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="message"
                defaultMessage={bye?.message}
            />

        </div>
    );
}