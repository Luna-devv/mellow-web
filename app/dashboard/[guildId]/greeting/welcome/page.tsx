"use client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowLeft, HiChat, HiExternalLink } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import Fetch from "@/components/button-fetch";
import MessageCreatorEmbed from "@/components/embed-creator";
import ImageUrlInput from "@/components/inputs/image-url-input";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import Notice from "@/components/notice";
import { ApiV1GuildsModulesWelcomeGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [welcome, setWelcome] = useState<ApiV1GuildsModulesWelcomeGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/welcome`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesWelcomeGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setWelcome(response);
                        break;
                    }
                    default: {
                        setWelcome(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching welcome data");
            });

    }, []);

    const Head = () => (
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                as={Link}
                href={`/dashboard/${guild?.id}/greeting`}
                startContent={<HiArrowLeft />}
                size="sm"
            >
                Back
            </Button>
            <Button
                as={Link}
                href="/docs/greetings"
                target="_blank"
                endContent={<HiExternalLink />}
                size="sm"
            >
                Read docs & view placeholders
            </Button>
        </div>
    );

    if (welcome === undefined) return (
        <div>
            <Head />

            {error && <Notice message={error} />}
        </div>
    );

    return (
        <div>
            <Head />

            <Switch
                name="Welcome module enabled"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="enabled"
                defaultState={welcome?.enabled || false}
                disabled={false}
                onSave={(s) => {
                    setWelcome({
                        ...welcome,
                        enabled: s
                    });
                }}
            />

            <Switch
                name="Restore members roles and nickname on rejoin"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="restore"
                defaultState={welcome?.restore || false}
                disabled={!welcome.enabled}
            />

            <Switch
                name="Delete welcome message after leave"
                description="This only takes affect if the user joined less than 24h ago."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="deleteAfterLeave"
                defaultState={welcome?.deleteAfterLeave || false}
                disabled={!welcome.enabled}
            />

            <NumberInput
                name="After how many seconds the message should be deleted"
                description="Set to 0 to disable."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="deleteAfter"
                defaultState={welcome?.deleteAfter ?? 0}
                disabled={!welcome.enabled}
            />

            <div className="flex md:gap-4 gap-2">
                <SelectMenu
                    className="w-2/3 md:w-5/6"
                    name="Channel"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="channelId"
                    items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }))}
                    description="Select the channel where the welcome message should be send into."
                    defaultState={welcome?.channelId}
                    disabled={!welcome.enabled || false}
                />

                <Fetch
                    className="w-1/3 md:w-1/6 relative top-8"
                    url={`/guilds/${params.guildId}/modules/welcome/test`}
                    icon={<HiChat className="min-h-4 min-w-4" />}
                    label="Test Message"
                    method="POST"
                    size="lg"
                />
            </div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Roles"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="roleIds"
                        items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }))}
                        description="Select roles which members should get."
                        defaultState={welcome?.roleIds || []}
                        max={5}
                        disabled={!welcome.enabled}
                    />
                </div>

                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Pings"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="pingIds"
                        items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({ name: `#${c.name}`, value: c.id, error: c.missingPermissions.filter((mp) => mp !== "EmbedLinks").join(", ") }))}
                        description="Select in what channels user should get ghostpinged."
                        defaultState={welcome?.pingIds || []}
                        max={5}
                        disabled={!welcome.enabled}
                    />
                </div>
            </div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="First user message reactions"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="reactions.firstMessageEmojis"
                        items={[
                            { icon: "👋", name: "Wave", value: "👋" },
                            { icon: "☕", name: "Coffee", value: "☕" },
                            ...guild?.emojis?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => {
                                return { icon: <Image src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`} className="rounded-md h-6 w-6" alt={c.name} height={64} width={64} />, name: c.name.replace(/-|_/g, " "), value: c.id };
                            }) || []
                        ]}
                        description="Select emotes which will be reacted with on members first message."
                        defaultState={welcome?.reactions?.firstMessageEmojis}
                        max={2}
                        disabled={!welcome.enabled}
                    />
                </div>

                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Welcome message reactions"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="reactions.welcomeMessageEmojis"
                        items={[
                            { icon: "👋", name: "Wave", value: "👋" },
                            { icon: "☕", name: "Coffee", value: "☕" },
                            ...guild?.emojis?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => {
                                return { icon: <Image src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`} className="rounded-md h-6 w-6" alt={c.name} height={64} width={64} />, name: c.name.replace(/-|_/g, " "), value: c.id };
                            }) || []
                        ]}
                        description="Select emotes which will be reacted with on welcome messages."
                        defaultState={welcome?.reactions?.welcomeMessageEmojis}
                        max={2}
                        disabled={!welcome.enabled}
                    />
                </div>
            </div>

            <MessageCreatorEmbed
                name="Message"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="message"
                defaultMessage={welcome?.message}
                messageAttachmentComponent={welcome.card.enabled && <Image src={`https://image-api.wamellow.com/?type=join&username=${encodeURIComponent(user?.username as string)}&members=1090&hash=${encodeURIComponent(user?.id as string)}/${encodeURIComponent(user?.avatar as string)}${welcome.card.background ? `&background=${encodeURIComponent(welcome.card.background)}` : ""}`} width={1024 / 2} height={(256 + 16) / 2} loading="lazy" alt="" />}
                showMessageAttachmentComponentInEmbed={welcome.card.inEmbed}
                disabled={!welcome.enabled}
            >

                <div className={`mt-2 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl p-6 ${!welcome.card.enabled && "pb-[0px]"}`}>

                    <Switch
                        name="Show image card"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="card.enabled"
                        defaultState={welcome.card.enabled}
                        disabled={!welcome.enabled}
                        onSave={(s) => {
                            setWelcome({
                                ...welcome,
                                card: {
                                    ...welcome.card,
                                    enabled: s
                                }
                            });
                        }}
                    />

                    {welcome.card.enabled &&
                        <>
                            <Switch
                                name="Set image inside embed."
                                url={`/guilds/${guild?.id}/modules/welcome`}
                                dataName="card.inEmbed"
                                defaultState={welcome.card.inEmbed || false}
                                disabled={!welcome.card.enabled || !welcome.enabled}
                                onSave={(s) => {
                                    setWelcome({
                                        ...welcome,
                                        card: {
                                            ...welcome.card,
                                            inEmbed: s
                                        }
                                    });
                                }}
                            />

                            <ImageUrlInput
                                name="Card Background"
                                url={`/guilds/${guild?.id}/modules/welcome`}
                                ratio="aspect-[4/1]"
                                dataName="card.background"
                                description="Enter a url which should be the background for the image card. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                                defaultState={welcome.card.background || ""}
                                disabled={!welcome.card.enabled || !welcome.enabled}
                                onSave={(v) => {
                                    setWelcome({
                                        ...welcome,
                                        card: {
                                            ...welcome.card,
                                            background: v
                                        }
                                    });
                                }}
                            />
                        </>}

                </div>

            </MessageCreatorEmbed>

            <MessageCreatorEmbed
                name="Direct Message"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="dm.message"
                defaultMessage={welcome?.dm?.message}
                isCollapseable={true}
                disabled={!welcome.enabled}
            >

                <div className="m-2">
                    <Switch
                        name="Enabled"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="dm.enabled"
                        defaultState={welcome?.dm?.enabled || false}
                        disabled={!welcome.enabled}
                    />
                </div>

            </MessageCreatorEmbed>

        </div>
    );
}