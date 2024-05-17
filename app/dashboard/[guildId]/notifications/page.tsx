"use client";

import { Button, Chip, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { HiChat, HiExternalLink, HiViewGridAdd } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { guildStore } from "@/common/guilds";
import MessageCreatorEmbed from "@/components/embed-creator";
import { ScreenMessage } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";

import CreateNotification, { Style } from "./create.component";
import DeleteNotification from "./delete.component";
import { BiLogoYoutube } from "react-icons/bi";
import SelectMenu from "@/components/inputs/select-menu";
import Fetch from "@/components/button-fetch";
import Link from "next/link";

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

    useEffect(() => {
        if (!Array.isArray(data)) return;
        if (data && !notification && data[0]) setNotificationId(data[0].id);
    }, [data]);

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

    return (<>

        <div className="flex flex-wrap items-center gap-2 -mt-2 mb-5">
            {data
                .sort((a, b) => a.creator.username.localeCompare(b.creator.username))
                .map((notification) => (
                    <Chip
                        key={"guildnotifications-" + notification.id}
                        as={Button}
                        className="default border-0"
                        variant={id === notification.id ? "flat" : "faded"}
                        color={id === notification.id ? "secondary" : undefined}
                        startContent={
                            <span className="opacity-50 relative left-2">
                                <BiLogoYoutube />
                            </span>
                        }
                        onClick={() => setNotificationId(notification.id)}
                    >
                        {notification.creator.username + " "}
                    </Chip>
                ))
            }

            <CreateNotification
                guildId={guild?.id as string}
                style={Style.Compact}
                addNotification={addNotification}
                setNotificationId={setNotificationId}
            />

            <div className="ml-auto flex items-center gap-4">
                <Tooltip content="Created notifications / Limit" closeDelay={0}>
                    <span className="dark:text-neutral-600 text-neutral-400 cursor-default">{data.length}/{30}</span>
                </Tooltip>

                <Button
                    as={Link}
                    href="/docs/greetings"
                    target="_blank"
                    endContent={<HiExternalLink />}
                >
                    Read docs & view placeholders
                </Button>

                <DeleteNotification
                    guildId={guild?.id as string}
                    id={id}
                    name={notification?.creator.username}
                    removeNotification={removeNotification}
                />
            </div>

        </div>

        {notification &&
            <>

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
            </>
        }

        {!data.length &&
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
                        <CreateNotification
                            guildId={guild?.id as string}
                            style={Style.Big}
                            addNotification={addNotification}
                            setNotificationId={setNotificationId}
                        />
                    </div>

                </div>
            </div>
        }

    </>);
}

function convertCamelCaseToSpaced(input: string): string {
    const spacedString = input.replace(/([A-Z])/g, " $1");
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}