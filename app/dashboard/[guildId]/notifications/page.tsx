"use client";

import Image from "next/image";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { HiChat, HiViewGridAdd } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { guildStore } from "@/common/guilds";
import Fetch from "@/components/button-fetch";
import { CreateSplash } from "@/components/dashboard/lists/create-splash";
import { Navigation } from "@/components/dashboard/lists/navigation";
import { ItemSelector } from "@/components/dashboard/lists/selector";
import MessageCreatorEmbed from "@/components/embed-creator";
import SelectMenu from "@/components/inputs/select-menu";
import { ScreenMessage } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";

import CreateNotification, { Style } from "./create.component";
import DeleteNotification from "./delete.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const pathname = usePathname();
    const search = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();

    const url = `/guilds/${params.guildId}/modules/notifications` as const;

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesNotificationsGetResponse[]>(url),
        {
            enabled: !!params.guildId,
            ...cacheOptions
        }
    );

    const id = search.get("id");
    const notification = (Array.isArray(data) ? data : []).find((t) => t.id === id);

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(search);
        params.set(name, value);

        return params.toString();
    }, [search]);

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                top="20vh"
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    const setNotificationId = (id: string) => {
        router.push(pathname + "?" + createQueryString("id", id));
    };

    const editNotification = <T extends keyof ApiV1GuildsModulesNotificationsGetResponse>(k: keyof ApiV1GuildsModulesNotificationsGetResponse, value: ApiV1GuildsModulesNotificationsGetResponse[T]) => {
        if (!notification) return;

        queryClient.setQueryData<ApiV1GuildsModulesNotificationsGetResponse[]>(url, () => [
            ...(data?.filter((t) => t.id !== notification.id) || []),
            { ...notification, [k]: value }
        ]);
    };

    const addNotification = (notification: ApiV1GuildsModulesNotificationsGetResponse) => {
        queryClient.setQueryData<ApiV1GuildsModulesNotificationsGetResponse[]>(url, () => [
            ...(data || []),
            notification
        ]);
    };

    const removeNotification = (id: string) => {
        queryClient.setQueryData<ApiV1GuildsModulesNotificationsGetResponse[]>(url, () =>
            data?.filter((t) => t.id !== id) || []
        );
    };

    if (!notification) {
        return (
            <ItemSelector<ApiV1GuildsModulesNotificationsGetResponse>
                items={(data || []) as ApiV1GuildsModulesNotificationsGetResponse[]}

                set={setNotificationId}
                sort={(a, b) => a.creator.username.localeCompare(b.creator.username)}
                name={(item) => item.creator.username}

                docs="/notifications"

                createButton={(options) => (
                    <CreateNotification
                        style={options.style}
                        add={addNotification}
                        set={setNotificationId}
                    />
                )}

                deleteButton={(options) => (
                    <DeleteNotification
                        id={options.id}
                        name={options.name}
                        remove={removeNotification}
                    />
                )}

                item={(item) => {
                    const channel = guild?.channels?.find((channel) => channel.id === item.channelId);

                    return (<>
                        <Image
                            alt={`${item.creator.username}'s avatar`}
                            className="rounded-full"
                            src={item.creator.avatarUrl}
                            width={46}
                            height={46}
                        />

                        <div className="flex flex-col items-start">
                            <span className="text-neutral-100 text-lg font-medium -mb-[0.5]">
                                {item.creator.username}
                            </span>

                            <div className="bg-blurple/50 text-neutral-100 px-1 rounded-md">
                                #{channel?.name || "unknown"}
                            </div>
                        </div>
                    </>);
                }}
            >
                <CreateSplash
                    name="notifications"
                    description="Notify your community when new videos are released."
                >
                    <CreateNotification
                        style={Style.Big}
                        add={addNotification}
                        set={setNotificationId}
                    />
                </CreateSplash>
            </ItemSelector>
        );
    }

    return (<>
        <Navigation
            href="/notifications"
            docs="/notifications"

            icon={
                <Image
                    alt={`${notification?.creator.username}'s avatar`}
                    className="rounded-full size-5.5"
                    src={notification?.creator.avatarUrl || ""}
                    width={24}
                    height={24}
                />
            }
            name={notification.creator.username}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                name="Channel"
                url={url + "/" + notification.id}
                dataName="channelId"
                items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }))}
                description="Select a channel where notifications should be send into."
                defaultState={notification.channelId}
                onSave={(o) => editNotification("channelId", o.value as string)}
            />

            <Fetch
                className="w-1/3 md:w-1/6 relative top-8"
                url={url + "/" + notification.id + "/test"}
                icon={<HiChat className="min-h-4 min-w-4" />}
                label="Test Message"
                method="POST"
                size="lg"
            />
        </div>

        <SelectMenu
            className="md:w-1/2 w-full"
            name="Ping role"
            url={url + "/" + notification.id}
            dataName="roleId"
            items={[
                { name: "@everyone (everyone in server)", value: "everyone" },
                { name: "@here (everyone online)", value: "here" },
                ...guild?.roles?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `@${c.name}`, value: c.id, color: c.color })) || []
            ]}
            description="Select a role which should get pinged on uploads."
            defaultState={notification.roleId}
            onSave={(o) => editNotification("roleId", o.value as string)}
            showClear
        />

        <MessageCreatorEmbed
            key={notification.id}
            name="Message"
            url={url + "/" + notification.id}
            dataName="message"
            defaultMessage={notification.message}
            onSave={(value) => editNotification("message", value as string)}
        />
    </>);
}