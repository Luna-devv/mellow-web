
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { errorStore } from "@/common/error";
import { guildStore } from "@/common/guilds";
import { widthStore } from "@/common/width";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import MessageCreatorEmbed from "@/components/messageCreator/Embed";
import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsModulesWelcomeGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const width = widthStore((w) => w);
    const guild = guildStore((g) => g);

    const [channels, setChannels] = useState<ApiV1GuildsChannelsGetResponse[]>([]);
    const [welcome, setWelcome] = useState<ApiV1GuildsModulesWelcomeGetResponse>();

    const params = useParams();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/channels`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsChannelsGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setChannels(response);
                        break;
                    }
                    default: {
                        setChannels([]);
                        errorStore.setState((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                errorStore.setState("Error while fetching channels");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/welcome`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesWelcomeGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setWelcome(response);
                        break;
                    }
                    default: {
                        setWelcome(undefined);
                        errorStore.setState((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                errorStore.setState("Error while fetching welcome data");
            });
    }, []);

    if (!welcome) return <></>;

    return (
        <div>

            <div className="flex md:gap-4 gap-3">
                <SelectMenu
                    name="Channel"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="channel"
                    items={channels.map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                    description="Select the channel where the welcome message should be send into"
                    defaultV={welcome.channel}
                />

                <button
                    id="test-button"
                    className="flex justify-center items-center bg-violet-600 hover:bg-violet-500 text-white py-2 px-4 rounded-md duration-200 mt-8 h-12 md:w-32"
                    onClick={() => {
                        if (document.getElementById("test-button")?.classList.contains("cursor-not-allowed")) return;
                        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/welcome/test`, {
                            method: "POST",
                            headers: {
                                authorization: localStorage.getItem("token") as string
                            }
                        })
                            .then(async (res) => {
                                console.log(res);
                                const response = await res.json() as ApiV1GuildsModulesWelcomeGetResponse;
                                if (!response) return;

                                switch (res.status) {
                                    case 200: {
                                        document.getElementById("test-button")?.classList.add(..."bg-green-700 hover:bg-green-600 cursor-not-allowed".split(" "));
                                        document.getElementById("test-button")?.classList.remove(..."bg-violet-600 hover:bg-violet-500".split(" "));

                                        setTimeout(() => {
                                            document.getElementById("test-button")?.classList.remove(..."bg-green-700 hover:bg-green-600 cursor-not-allowed".split(" "));
                                            document.getElementById("test-button")?.classList.add(..."bg-violet-600 hover:bg-violet-500".split(" "));
                                        }, 1_000 * 8);

                                        break;
                                    }
                                    default: {
                                        errorStore.setState((response as unknown as RouteErrorResponse).message);
                                        break;
                                    }
                                }

                            })
                            .catch(() => {
                                errorStore.setState("Error while sending test");
                            });
                    }}
                >
                    {width > 768 ? <span>Send Test</span> : <span>Test</span>}
                </button>
            </div>

            <MessageCreatorEmbed
                name="Message"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="message"
                defaultMessage={welcome.message}
            >
                <Switch
                    name="Enabled"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="enabled"
                    defaultState={welcome.enabled}
                    disabled={false}
                />
            </MessageCreatorEmbed>

        </div >
    );
}