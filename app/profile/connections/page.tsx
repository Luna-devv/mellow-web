"use client";

import Image from "next/image";
import { BsSpotify } from "react-icons/bs";
import { HiFingerPrint, HiTrash } from "react-icons/hi";
import { SiBluesky } from "react-icons/si";
import { useQuery } from "react-query";

import Notice, { NoticeType } from "@/components/notice";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { type ApiV1UsersMeConnectionsGetResponse, ConnectionType } from "@/typings";
import { cn } from "@/utils/cn";

const CONNECTION_TYPES = Object
    .entries(ConnectionType)
    .filter(([key, value]) => typeof key === "string" && typeof value === "number") as [string, ConnectionType][];

export default function Home() {
    const url = "/users/@me/connections" as const;

    const { isLoading, data, error } = useQuery(
        url,
        () => getData<ApiV1UsersMeConnectionsGetResponse[]>(url),
        cacheOptions
    );

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    return (
        <div className="space-y-2">
            <Notice
                type={NoticeType.Info}
                message="This is still in testing, don&apos;t expect it to work properly yet!"
            />

            {CONNECTION_TYPES.map(([name, type]) => (
                <Connection key={name} name={name} type={type} data={data} />
            ))}
        </div>
    );
}

function Connection(
    { name, type, data }:
    { name: string; type: ConnectionType; data: ApiV1UsersMeConnectionsGetResponse[]; }
) {
    const connection = data.find((entry) => entry.type === type);
    const disabled = type === ConnectionType.Spotify && !connection;

    return (
        <div
            key={name}
            className="flex gap-3 justify-between p-4 bg-wamellow rounded-xl w-full"
        >
            {connection
                ? <Image
                    alt={`user's ${name} avatar`}
                    className="rounded-full size-12 shrink-0"
                    height={56}
                    src={connection?.avatar || "/discord.webp"}
                    width={56}
                />
                : (
                    <div className="bg-wamellow-100 rounded-full size-12 flex items-center justify-center text-neutral-300 shrink-0">
                        <Icon type={type} />
                    </div>
                )
            }

            <div className="truncate">
                <span className={cn("font-medium text-lg text-red-400 ", connection && "text-neutral-100")}>
                    {connection ? connection.username : "Not connected"}
                </span>
                <div className="flex items-center gap-1">
                    <Icon type={type} />
                    {name}
                </div>
            </div>

            <Button
                className="ml-auto"
                onClick={() => {
                    if (disabled) return;
                    // idk with router.push logout doesn't update
                    window.location.href = `/login/${name.toLowerCase()}${connection ? "?logout=true" : ""}`;
                }}
                disabled={disabled}
            >
                {connection ? <HiTrash /> : <HiFingerPrint />}
                {connection ? "Disconnect" : "Connect"}
            </Button>
        </div>
    );
}

function Icon({ type }: { type: ConnectionType; }) {
    switch (type) {
        case ConnectionType.Spotify: return <BsSpotify />;
        case ConnectionType.Bluesky: return <SiBluesky />;
    }
}