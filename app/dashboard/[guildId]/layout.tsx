"use client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiCursorClick, HiShare } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { webStore } from "@/common/webstore";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import ErrorBanner from "@/components/Error";
import { ListTab } from "@/components/List";
import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse, RouteErrorResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const guild = guildStore((g) => g);
    const web = webStore((w) => w);

    const [error, setError] = useState<string>();

    const params = useParams();
    const path = usePathname();
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setError(undefined);
                        guildStore.setState(response);
                        break;
                    }
                    default: {
                        guildStore.setState(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching guilds");
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
                        guildStore.setState({
                            ...guild,
                            channels: response
                        });
                        break;
                    }
                    default: {
                        guildStore.setState({
                            ...guild,
                            channels: []
                        });
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
                        guildStore.setState({
                            ...guild,
                            roles: response
                        });
                        break;
                    }
                    default: {
                        guildStore.setState({
                            ...guild,
                            roles: response
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/emojis`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsEmojisGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {

                        guildStore.setState({
                            ...guild,
                            emojis: response
                        });
                        break;
                    }
                    default: {

                        guildStore.setState({
                            ...guild,
                            emojis: response
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

    }, []);

    if (error) return <ErrorBanner message={error} />;
    if (!guild?.id) return <></>;

    return (
        <div className="flex flex-col w-full">
            <title>{`${guild?.name}'s Dashboard`}</title>

            <div className="flex gap-2 mb-5 text-sm">
                <Button
                    as={Link}
                    href="/dashboard"
                    startContent={<HiArrowNarrowLeft />}
                >
                    Serverlist
                </Button>
                {web.devToolsEnabled &&
                    <CopyToClipboardButton
                        text={getCanonicalUrl("leaderboard", params.guildId)}
                        items={[
                            { icon: <HiShare />, name: "Copy page url", description: "Creates a link to this specific page", text: getCanonicalUrl(...path.split("/").slice(1)) },
                            { icon: <HiCursorClick />, name: "Copy dash-to url", description: "Creates a dash-to link to the current tab", text: getCanonicalUrl(`dashboard?to=${path.split("/dashboard/")[1].split("/")[1] || "/"}`) }
                        ]}
                    />
                }
            </div>

            {error && <ErrorBanner message={error} />}

            <div className="text-lg flex items-center">
                <Image src={guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith("a_") && !web.reduceMotions ? "gif" : "webp"}?size=64` : "/discord.png"} width={64} height={64} alt="Server" className="rounded-full h-14 w-14 mr-3" />
                <div>
                    <div className="text-xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                    <div className="text-sm">{intl.format(guild?.memberCount || 0)} members</div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Overview",
                        value: "/"
                    },
                    {
                        name: "Leaderboards",
                        value: "/leaderboards"
                    },
                    {
                        name: "Greetings",
                        value: "/greeting"
                    },
                    // {
                    //     name: "Custom Commands",
                    //     value: "/actions"
                    // },
                    {
                        name: "Starboard",
                        value: "/starboard"
                    }
                ]}
                url={`/dashboard/${params.guildId}`}
                disabled={!guild}
            />

            {children}

        </div >
    );
}