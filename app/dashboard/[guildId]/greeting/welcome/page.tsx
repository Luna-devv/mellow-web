"use client";
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
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api/hook";
import type { ApiV1GuildsModulesWelcomeGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { createSelectableEmojiItems, createSelectableItems } from "@/utils/create-selectable-items";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiArrowLeft, HiChat, HiExternalLink } from "react-icons/hi";

export default function Home() {
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const params = useParams();
    const { data, isLoading, error, edit } = useApi<ApiV1GuildsModulesWelcomeGetResponse>(`/guilds/${params.guildId}/modules/welcome`);

    const Head = () => (
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                asChild
                size="sm"
            >
                <Link href={`/dashboard/${guild?.id}/greeting`}>
                    <HiArrowLeft />
                    Back
                </Link>
            </Button>
            <Button
                asChild
                size="sm"
            >
                <Link
                    href="/docs/farewell"
                    target="_blank"
                >
                    <HiExternalLink />
                    Read docs & view placeholders
                </Link>
            </Button>
        </div>
    );

    if (isLoading) return <></>;

    if (!data || error) return (
        <div>
            <Head />
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        <Head />

        <Switch
            label="Welcome module enabled"
            endpoint={`/guilds/${guild?.id}/modules/welcome`}
            k="enabled"
            defaultState={data.enabled || false}
            disabled={false}
            onSave={(s) => edit("enabled", s)}
        />

        <Switch
            label="Restore members roles and nickname on rejoin"
            endpoint={`/guilds/${guild?.id}/modules/welcome`}
            k="restore"
            defaultState={data.restore}
            disabled={!data.enabled}
            onSave={(s) => edit("restore", s)}
        />

        <Switch
            label="Delete welcome message after leave"
            description="This only takes affect if the user joined less than 24h ago."
            endpoint={`/guilds/${guild?.id}/modules/welcome`}
            k="deleteAfterLeave"
            defaultState={data.deleteAfterLeave || false}
            disabled={!data.enabled}
            onSave={(s) => edit("deleteAfterLeave", s)}
        />

        <NumberInput
            name="After how many seconds the message should be deleted"
            description="Set to 0 to disable."
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="deleteAfter"
            defaultState={data.deleteAfter ?? 0}
            disabled={!data.enabled}
            onSave={(n) => edit("deleteAfter", n)}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                className="w-2/3 md:w-5/6"
                name="Channel"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="channelId"
                items={createSelectableItems(guild?.channels)}
                description="Select the channel where the welcome message should be send into."
                defaultState={data.channelId}
                disabled={!data.enabled}
                showClear
                onSave={(o) => edit("channelId", o.value)}
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
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select roles which members should get."
                    defaultState={data.roleIds}
                    max={5}
                    disabled={!data.enabled}
                    onSave={(o) => edit("roleIds", o.map(({ value }) => value))}
                />
            </div>

            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Pings"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="pingIds"
                    items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages"])}
                    description="Select in what channels user should get ghostpinged."
                    defaultState={data.pingIds}
                    max={5}
                    disabled={!data.enabled}
                    onSave={(o) => edit("pingIds", o.map(({ value }) => value))}
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
                    defaultState={data.reactions?.firstMessageEmojis}
                    max={2}
                    disabled={!data.enabled}
                    onSave={(o) => {
                        edit("reactions", {
                            ...data.reactions,
                            firstMessageEmojis: o.map(({ value }) => value)
                        });
                    }}
                />
            </div>

            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Welcome message reactions"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="reactions.welcomeMessageEmojis"
                    items={createSelectableEmojiItems(guild?.emojis)}
                    description="Select emotes which will be reacted with on welcome messages."
                    defaultState={data.reactions?.welcomeMessageEmojis}
                    max={2}
                    disabled={!data.enabled}
                    onSave={(o) => {
                        edit("reactions", {
                            ...data.reactions,
                            welcomeMessageEmojis: o.map(({ value }) => value)
                        });
                    }}
                />
            </div>
        </div>

        <MessageCreatorEmbed
            name="Message"
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="message"
            defaultMessage={data.message}
            messageAttachmentComponent={data.card.enabled && (
                <Image
                    src={`https://image-api.wamellow.com/?type=join&username=${encodeURIComponent(user!.username)}&members=1090&hash=${encodeURIComponent(user!.id)}/${encodeURIComponent(user!.avatar!)}${data.card.background ? `&background=${encodeURIComponent(data.card.background)}` : ""}`}
                    width={1_024 / 2}
                    height={(256 + 16) / 2}
                    loading="lazy"
                    alt=""
                />
            )}
            showMessageAttachmentComponentInEmbed={data.card.inEmbed}
            disabled={!data.enabled}
            onSave={(message) => edit("message", message)}
        >

            <div className={cn("mt-2 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl p-6", !data.card.enabled && "pb-0")}>
                <Switch
                    label="Show image card"
                    endpoint={`/guilds/${guild?.id}/modules/welcome`}
                    k="card.enabled"
                    defaultState={data.card.enabled}
                    disabled={!data.enabled}
                    onSave={(s) => {
                        edit("card", {
                            ...data.card,
                            enabled: s
                        });
                    }}
                />

                {data.card.enabled && <>
                    <Switch
                        label="Set image inside embed"
                        endpoint={`/guilds/${guild?.id}/modules/welcome`}
                        k="card.inEmbed"
                        defaultState={data.card.inEmbed || false}
                        disabled={!data.card.enabled || !data.enabled}
                        onSave={(s) => {
                            edit("card", {
                                ...data.card,
                                inEmbed: s
                            });
                        }}
                    />

                    <ImageUrlInput
                        name="Card Background"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        ratio="aspect-4/1"
                        dataName="card.background"
                        description="Enter a url which should be the background for the image card. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                        defaultState={data.card.background || ""}
                        disabled={!data.card.enabled || !data.enabled}
                        onSave={(s) => {
                            edit("card", {
                                ...data.card,
                                background: s
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
            defaultMessage={data.dm?.message}
            isCollapseable={true}
            disabled={!data.enabled}
            onSave={(message) => {
                edit("dm", {
                    ...data.dm,
                    message
                });
            }}
        >

            <div className="m-2">
                <Switch
                    label="Enabled"
                    endpoint={`/guilds/${guild?.id}/modules/welcome`}
                    k="dm.enabled"
                    defaultState={data.dm?.enabled}
                    disabled={!data.enabled}
                    onSave={(s) => {
                        edit("dm", {
                            ...data.dm,
                            enabled: s
                        });
                    }}
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
            label="Enable button"
            endpoint={`/guilds/${guild?.id}/modules/welcome`}
            k="button.enabled"
            defaultState={data.button?.enabled}
            disabled={!data.enabled}
            onSave={(s) => {
                edit("button", {
                    ...data.button,
                    enabled: s
                });
            }}
        />

        <Switch
            label="Ping new member"
            description="Whenever the mention in the greet message should ping or not."
            endpoint={`/guilds/${guild?.id}/modules/welcome`}
            k="button.ping"
            defaultState={data.button?.ping || false}
            disabled={!data.enabled || !data.button?.enabled}
            onSave={(s) => {
                edit("button", {
                    ...data.button,
                    ping: s
                });
            }}
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
                    defaultState={data.button?.style || 1}
                    disabled={!data.enabled || !data.button?.enabled}
                    onSave={(o) => {
                        edit("button", {
                            ...data.button,
                            style: o.value as 1
                        });
                    }}
                />
            </div>
            <div className="lg:w-1/2">
                <SelectMenu
                    name="Button emoji"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="button.emoji"
                    items={createSelectableEmojiItems(guild?.emojis)}
                    description="Select an emoji which will be used in the button."
                    defaultState={data.button?.emoji}
                    disabled={!data.enabled || !data.button?.enabled}
                    onSave={(o) => {
                        edit("button", {
                            ...data.button,
                            emoji: o.value
                        });
                    }}
                />
            </div>
        </div>

        <div className="h-[138px]" />
    </>);
}