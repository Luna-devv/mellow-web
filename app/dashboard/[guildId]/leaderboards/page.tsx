
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiChartBar } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { webStore } from "@/common/webstore";
import ErrorBanner from "@/components/Error";
import ColorInput from "@/components/inputs/ColorInput";
import ImageUrlInput from "@/components/inputs/ImageUrlInput";
import { ApiV1GuildsModulesLeaderboardGetResponse, RouteErrorResponse } from "@/typings";

import OverviewLinkComponent from "../../../../components/OverviewLinkComponent";

export default function Home() {
    const guild = guildStore((g) => g);
    const web = webStore((w) => w);

    const [error, setError] = useState<string>();
    const [leaderboard, setLeaderboard] = useState<ApiV1GuildsModulesLeaderboardGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/leaderboard`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesLeaderboardGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setLeaderboard(response);
                        break;
                    }
                    default: {
                        setLeaderboard(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching leaderboard data");
            });

    }, []);

    if (leaderboard === undefined) return (
        <div>
            {error && <ErrorBanner message={error} />}
        </div>
    );

    return (
        <div>

            <div className={`flex gap-4 border-2 border-violet-400 p-4 mb-4 rounded-lg ${!web.devToolsEnabled && "opacity-50 cursor-not-allowed"}`}>

                <div className="lg:w-1/2 flex gap-2 w-full">

                    <div className="w-1/2">
                        <ColorInput
                            name="Text Color"
                            url={`/guilds/${guild?.id}/modules/leaderboard`}
                            dataName="textColor"
                            description="Color used for text."
                            __defaultState={leaderboard?.textColor ?? 0xe5e5e5}
                            resetState={0xe5e5e5}
                            disabled={!web.devToolsEnabled}
                        />
                    </div>

                    <div className="w-1/2">
                        <ColorInput
                            name="Accent Color"
                            url={`/guilds/${guild?.id}/modules/leaderboard`}
                            dataName="accentColor"
                            description="Color used for secondary text."
                            __defaultState={leaderboard?.accentColor ?? 0x8b5cf6}
                            resetState={0x8b5cf6}
                            disabled={!web.devToolsEnabled}
                        />
                    </div>

                </div>

                <div className="w-1/2">
                    <ColorInput
                        name="Background Color"
                        url={`/guilds/${guild?.id}/modules/leaderboard`}
                        dataName="backgroundColor"
                        description="Color used for the background."
                        __defaultState={leaderboard?.backgroundColor ?? 0x18191c}
                        resetState={0x18191c}
                        disabled={!web.devToolsEnabled}
                    />
                </div>

            </div>

            <ImageUrlInput
                name="Banner"
                url={`/guilds/${guild?.id}/modules/leaderboard`}
                ratio="aspect-[4/1]"
                dataName="banner"
                description="Enter a url which should be the banner of the leaderboard web page. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                __defaultState={leaderboard.banner || ""}
            />

            <OverviewLinkComponent
                className="mt-8"
                title="View Leaderboard"
                message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                url={`/leaderboard/${params.guildId}`}
                icon={<HiChartBar />}
            />

        </div >
    );
}