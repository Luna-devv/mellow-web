"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { HiChat, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import Fetch from "@/components/button-fetch";
import { CreateSplash } from "@/components/dashboard/lists/create-splash";
import { useList } from "@/components/dashboard/lists/hook";
import { Navigation } from "@/components/dashboard/lists/navigation";
import { ItemSelector } from "@/components/dashboard/lists/selector";
import MessageCreatorEmbed from "@/components/embed-creator";
import SelectMenu from "@/components/inputs/select-menu";
import { ScreenMessage } from "@/components/screen-message";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

import { DeleteNotification } from "./delete.component";
import { CreateNotificationSelect, Style } from "./select.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/notifications` as const;
    const {
        item,
        items,
        setItemId,
        editItem,
        addItem,
        removeItem,
        isLoading,
        error
    } = useList<ApiV1GuildsModulesNotificationsGetResponse>({ url });

    if (error) {
        return (
            <ScreenMessage
                top="20vh"
                title="Something went wrong on this page.."
                description={error}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !items) return <></>;

    if (!item) {
        return (
            <ItemSelector<ApiV1GuildsModulesNotificationsGetResponse>
                items={items}

                set={setItemId}
                sort={(a, b) => a.creator.username.localeCompare(b.creator.username)}
                name={(item) => item.creator.username}

                docs="/notifications"

                createButton={(options) => (
                    <CreateNotificationSelect
                        style={options.style}
                        add={addItem}
                        set={setItemId}
                    />
                )}

                deleteButton={(options) => (
                    <DeleteNotification
                        id={options.id}
                        name={options.name}
                        remove={removeItem}
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
                    <CreateNotificationSelect
                        style={Style.Big}
                        add={addItem}
                        set={setItemId}
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
                    alt={`${item?.creator.username}'s avatar`}
                    className="rounded-full size-5.5"
                    src={item?.creator.avatarUrl || ""}
                    width={24}
                    height={24}
                />
            }
            name={item.creator.username}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                name="Channel"
                url={url + "/" + item.id}
                dataName="channelId"
                items={createSelectableItems(guild?.channels)}
                description="Select a channel where notifications should be send into."
                defaultState={item.channelId}
                onSave={(o) => editItem("channelId", o.value as string)}
            />

            <Fetch
                className="w-1/3 md:w-1/6 relative top-8"
                url={url + "/" + item.id + "/test"}
                icon={<HiChat className="min-h-4 min-w-4" />}
                label="Test Message"
                method="POST"
                size="lg"
            />
        </div>

        <SelectMenu
            className="md:w-1/2 w-full"
            name="Ping role"
            url={url + "/" + item.id}
            dataName="roleId"
            items={[
                { name: "@everyone (everyone in server)", value: "everyone" },
                { name: "@here (everyone online)", value: "here" },
                ...createSelectableItems(guild?.roles)
            ]}
            description="Select a role which should get pinged on uploads."
            defaultState={item.roleId}
            onSave={(o) => editItem("roleId", o.value as string)}
            showClear
        />

        <MessageCreatorEmbed
            key={item.id}
            name="Message"
            url={url + "/" + item.id}
            dataName="message"
            defaultMessage={item.message}
            onSave={(value) => editItem("message", { content: value.content ?? null, embed: value.embed })}
        />
    </>);
}