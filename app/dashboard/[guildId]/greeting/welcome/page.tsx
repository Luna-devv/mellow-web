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
import { Section } from "@/components/section";
import { ApiError,ApiV1GuildsModulesWelcomeGetResponse } from "@/typings";
import { createSelectableEmojiItems, createSelectableItems } from "@/utils/create-selectable-items";

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
                        setError((response as unknown as ApiError).message);
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

    return (<>
        <Head />

        <Switch
            name="Welcome module enabled"
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="enabled"
            defaultState={welcome?.enabled}
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
            defaultState={welcome?.restore}
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
                items={createSelectableItems(guild?.channels)}
                description="Select the channel where the welcome message should be send into."
                defaultState={welcome?.channelId}
                disabled={!welcome.enabled}
                showClear
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
                    items={createSelectableItems(guild?.roles)}
                    description="Select roles which members should get."
                    defaultState={welcome?.roleIds}
                    max={5}
                    disabled={!welcome.enabled}
                />
            </div>

            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Pings"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="pingIds"
                    items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages"])}
                    description="Select in what channels user should get ghostpinged."
                    defaultState={welcome?.pingIds}
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
                    items={createSelectableEmojiItems(guild?.emojis)}
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
                    items={createSelectableEmojiItems(guild?.emojis)}
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
            messageAttachmentComponent={welcome.card.enabled &&
                <Image
                    src={`https://image-api.wamellow.com/?type=join&username=${encodeURIComponent(user?.username as string)}&members=1090&hash=${encodeURIComponent(user?.id as string)}/${encodeURIComponent(user?.avatar as string)}${welcome.card.background ? `&background=${encodeURIComponent(welcome.card.background)}` : ""}`}
                    width={1024 / 2}
                    height={(256 + 16) / 2}
                    loading="lazy"
                    alt=""
                />
            }
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

                {welcome.card.enabled && <>
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
            defaultMessage={welcome.dm?.message}
            isCollapseable={true}
            disabled={!welcome.enabled}
        >

            <div className="m-2">
                <Switch
                    name="Enabled"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="dm.enabled"
                    defaultState={welcome.dm?.enabled}
                    disabled={!welcome.enabled}
                />
            </div>

        </MessageCreatorEmbed>

        <Section
            className="mb-6"
            title="Click to say hi!"
        >
            Bring Discord&apos;s &quot;Wave to say hi!&quot; feature on customized messages, just with a random greet!
        </Section>

        <Switch
            name="Enable button"
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="button.enabled"
            defaultState={welcome.button?.enabled}
            disabled={!welcome.enabled}
            onSave={(s) => {
                setWelcome({
                    ...welcome,
                    button: {
                        ...welcome.button,
                        enabled: s
                    }
                });
            }}
        />

        <Switch
            name="Ping new member"
            description="Whenever the mention in the greet message should ping or not."
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="button.ping"
            defaultState={welcome.button?.ping || false}
            disabled={!welcome.enabled || !welcome.button?.enabled}
        />

        <div className="lg:flex gap-3 pt-3">
            <div className="lg:w-1/2">
                <SelectMenu
                    name="Button color"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="button.style"
                    items={
                        [
                            ["292b34", "Grey", 2],
                            ["5865f2", "Blurple", 1],
                            ["248046", "Green", 3],
                            ["da373c", "Red", 4]
                        ]
                            .map(([color, name, id]) => ({
                                icon: <div className="rounded-md h-6 w-6" style={{ backgroundColor: `#${color}` }} />,
                                name: name as string,
                                value: id
                            }))
                    }
                    description="Select the color of the button."
                    defaultState={welcome?.button?.style}
                    disabled={!welcome.enabled || !welcome.button?.enabled}
                />
            </div>
            <div className="lg:w-1/2">
                <SelectMenu
                    name="Button emoji"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="button.emoji"
                    items={createSelectableEmojiItems(guild?.emojis)}
                    description="Select an emoji which will be used in the button."
                    defaultState={welcome?.button?.emoji}
                    disabled={!welcome.enabled || !welcome.button?.enabled}
                />
            </div>
        </div>

        <div className="h-[138px]" />
    </>);
}