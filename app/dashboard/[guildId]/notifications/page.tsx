"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { HiArrowLeft, HiChat, HiExternalLink, HiViewGridAdd } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { guildStore } from "@/common/guilds";
import Fetch from "@/components/button-fetch";
import MessageCreatorEmbed from "@/components/embed-creator";
import SelectMenu from "@/components/inputs/select-menu";
import { ScreenMessage } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";

import { ChannelSelector } from "./channel-selector.component";

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

    const Head = () => (
        <div className="flex items-start justify-between gap-2 relative bottom-2 mb-5 md:mb-3">
            <div className="flex flex-col md:flex-row gap-2">
                <Button
                    as={Link}
                    href={`/dashboard/${guild?.id}/notifications`}
                    startContent={<HiArrowLeft />}
                    size="sm"
                >
                    Back to channels
                </Button>

                <div className="flex items-center gap-1.5">
                    <Image
                        alt={`${notification?.creator.username}'s avatar`}
                        className="rounded-full size-5.5"
                        src={notification?.creator.avatarUrl || ""}
                        width={24}
                        height={24}
                    />

                    <div className="flex flex-col">
                        <span className="text-xxs -mb-1">
                            Editing:
                        </span>
                        <span className="text-neutral-100 font-medium">
                            {notification?.creator.username}
                        </span>
                    </div>
                </div>
            </div>

            <Button
                as={Link}
                href="/docs/notifications"
                target="_blank"
                endContent={<HiExternalLink />}
                size="sm"
            >
                Read docs & view placeholders
            </Button>
        </div>
    );

    if (!notification) {
        return (
            <ChannelSelector
                notifications={data || []}
                addNotification={addNotification}
                setNotificationId={setNotificationId}
                removeNotification={removeNotification}
            />
        );
    }

    return (<>
        <Head />

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