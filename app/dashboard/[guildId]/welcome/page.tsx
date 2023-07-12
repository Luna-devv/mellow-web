
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { guildStore } from "@/common/guilds";
import { widthStore } from "@/common/width";
import ErrorBanner from "@/components/Error";
import MultiSelectMenu from "@/components/inputs/MultiSelectMenu";
import NumberInput from "@/components/inputs/NumberInput";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import MessageCreatorEmbed from "@/components/messageCreator/Embed";
import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsModulesWelcomeGetResponse, ApiV1GuildsRolesGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const width = widthStore((w) => w);
    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();
    const [channels, setChannels] = useState<ApiV1GuildsChannelsGetResponse[]>([]);
    const [roles, setRoles] = useState<ApiV1GuildsRolesGetResponse[]>([]);
    const [welcome, setWelcome] = useState<ApiV1GuildsModulesWelcomeGetResponse>();

    const params = useParams();

    useEffect(() => {

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
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching welcome data");
            });

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
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching channels");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/roles`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsRolesGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setRoles(response);
                        break;
                    }
                    default: {
                        setRoles([]);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

    }, []);

    if (welcome === undefined) return (
        <div>
            {error && <ErrorBanner message={error} />}
        </div>
    );

    return (
        <div>

            <Switch
                name="Welcome module enabled."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="enabled"
                defaultState={welcome?.enabled || false}
                disabled={false}
            />

            <Switch
                name="Restore members roles and nickname on rejoin."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="restore"
                defaultState={welcome?.restore || false}
                disabled={false}
            />

            <NumberInput
                name="After how many seconds the message should be deleted."
                description="Set to 0 to disable."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="deleteAfter"
                defaultState={welcome?.deleteAfter ?? 0}
                disabled={false}
            />

            <div className="flex md:gap-4 gap-3">
                <SelectMenu
                    name="Channel"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="channelId"
                    items={channels.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                    description="Select the channel where the welcome message should be send into."
                    __defaultState={welcome?.channelId}
                />

                <button
                    id="test-button"
                    className="flex justify-center items-center bg-violet-600 hover:bg-violet-600/80 text-white py-2 px-4 rounded-md duration-200 mt-8 h-12 md:w-32"
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

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Roles"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="roleIds"
                        items={roles.sort((a, b) => b.position - a.position).map((r) => { return { name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }; })}
                        description="Select roles which members should get."
                        defaultV={welcome?.roleIds || []}
                        max={5}
                    />
                </div>

                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Pings"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="pingIds"
                        items={channels.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.filter((mp) => mp !== "EmbedLinks").join(", ") }; })}
                        description="Select in what channels user should get ghostpinged."
                        defaultV={welcome?.pingIds || []}
                        max={5}
                    />
                </div>
            </div>

            <MessageCreatorEmbed
                name="Message"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="message"
                defaultMessage={welcome?.message}
            />

            <MessageCreatorEmbed
                name="Direct Message"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="dm.message"
                defaultMessage={welcome?.dm?.message}
                collapseable={true}
            >
                <Switch
                    name="Enabled"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="dm.enabled"
                    defaultState={welcome?.dm?.enabled || false}
                    disabled={false}
                />
            </MessageCreatorEmbed>

        </div>
    );
}