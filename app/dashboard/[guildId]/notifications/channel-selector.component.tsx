"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { HiExternalLink, HiPencil } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";

import CreateNotification, { Style } from "./create.component";
import DeleteNotification from "./delete.component";

interface Props {
    notifications: ApiV1GuildsModulesNotificationsGetResponse[];

    addNotification: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    setNotificationId: (id: string) => void;
    removeNotification: (id: string) => void;
}

export function ChannelSelector({
    notifications,

    addNotification,
    setNotificationId,
    removeNotification
}: Props) {
    const guild = guildStore((g) => g);

    return (<>
        <div className="flex flex-col gap-2">
            {notifications
                .sort((a, b) => a.creator.username.localeCompare(b.creator.username))
                .map((notification) => (
                    <Channel
                        key={"notification-" + notification.id}
                        notification={notification}
                        onClick={() => setNotificationId(notification.id)}
                    >
                        <Button
                            color="secondary"
                            variant="flat"
                            onClick={() => setNotificationId(notification.id)}
                            startContent={<HiPencil />}
                        >
                            Edit
                        </Button>
                        <DeleteNotification
                            guildId={guild?.id as string}
                            id={notification.id}
                            name={notification?.creator.username}
                            removeNotification={removeNotification}
                        />
                    </Channel>
                ))
            }
        </div>

        <div className="flex items-start justify-between w-full mt-3">
            <CreateNotification
                guildId={guild?.id as string}
                style={Style.Compact}
                addNotification={addNotification}
                setNotificationId={setNotificationId}
            />

            <Button
                as={Link}
                className="w-full md:w-[unset]"
                href="/docs/notifications"
                target="_blank"
                endContent={<HiExternalLink />}
            >
                Read docs & view placeholders
            </Button>
        </div>

        {!notifications.length &&
            <CreateNotificationBanner>
                <CreateNotification
                    guildId={guild?.id as string}
                    style={Style.Big}
                    addNotification={addNotification}
                    setNotificationId={setNotificationId}
                />
            </CreateNotificationBanner>
        }
    </>);
}

function Channel({
    notification,
    children,
    onClick
}: {
    notification: ApiV1GuildsModulesNotificationsGetResponse;
    children: React.ReactNode;
    onClick: () => void;
}) {
    const guild = guildStore((g) => g);
    const channel = guild?.channels?.find((channel) => channel.id === notification.channelId);

    return (
        <button
            className="flex justify-between p-4 bg-wamellow rounded-xl w-full duration-100"
            onClick={onClick}
        >
            <div className="flex gap-3 items-center">
                <Image
                    alt={`${notification.creator.username}'s avatar`}
                    className="rounded-full"
                    src={notification.creator.avatarUrl}
                    width={46}
                    height={46}
                />

                <div className="flex flex-col items-start">
                    <span className="text-neutral-100 text-lg font-medium -mb-[0.5]">
                        {notification.creator.username}
                    </span>

                    <div className="bg-blurple/50 text-neutral-100 px-1 rounded-md">
                        #{channel?.name || "unknown"}
                    </div>
                </div>
            </div>

            <div className="space-x-2">
                {children}
            </div>
        </button>
    );
}

function CreateNotificationBanner({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div
            className="w-full flex flex-col items-center justify-center"
            style={{ marginTop: "20vh" }}
        >
            <div>

                <div className="mb-10 flex flex-col items-center text-center">
                    <span className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">You dont have any notifications yet</span> <br />
                    <span className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold">Notify your community when new videos are released</span>
                </div>

                <div className="w-full flex flex-col items-center">
                    {children}
                </div>

            </div>
        </div>
    )
}