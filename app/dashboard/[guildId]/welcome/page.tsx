
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { widthStore } from "@/common/width";
import SelectMenu from "@/components/inputs/SelectMenu";
import { ApiV1GuildsChannelsGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const width = widthStore((w) => w);
    const user = userStore((s) => s);
    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();
    const [channels, setChannels] = useState<ApiV1GuildsChannelsGetResponse[]>([]);

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
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching guilds");
            });
    }, []);

    return (
        <div>

            <SelectMenu
                name="Channel"
                url={`/guilds/${guild?.id}`}
                items={channels.map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                description="Select the channel where the welcome message should be send into"
            />

        </div>
    );
}