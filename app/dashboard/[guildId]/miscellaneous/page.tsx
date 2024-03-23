"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import { ScreenMessage } from "@/components/screen-message";
import { ApiV1GuildsModulesEmbedmessagelinksGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();
    const [eml, setEml] = useState<ApiV1GuildsModulesEmbedmessagelinksGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/embed-message-links`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesEmbedmessagelinksGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setEml(response);
                        break;
                    }
                    default: {
                        setEml(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching miscellaneous data");
            });

    }, []);

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

    if (!eml) return <></>;

    return (
        <div>

            <Switch
                name="Embed message links enabled."
                url={`/guilds/${guild?.id}/modules/embed-message-links`}
                dataName="enabled"
                defaultState={eml?.enabled || false}
                disabled={false}
                onSave={(s) => {
                    eml.enabled = s;
                    setEml({ ...eml });
                }}
            />

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <SelectMenu
                        name="Author Display Style"
                        url={`/guilds/${guild?.id}/modules/embed-message-links`}
                        dataName="display"
                        items={[
                            {
                                name: "Message Content",
                                value: 0
                            },
                            {
                                name: "Embed Author (top)",
                                value: 1
                            },
                            {
                                name: "Embed Footer (bottom)",
                                value: 2
                            }
                        ]}
                        description="Where the original message author shoud be displayed."
                        defaultState={eml?.display}
                        disabled={!eml.enabled}
                    />
                </div>
            </div>

        </div>
    );
}