"use client";
import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import Fetch from "@/components/button-fetch";
import MessageCreatorEmbed from "@/components/embed-creator";
import ImageUrlInput from "@/components/inputs/image-url-input";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import Notice from "@/components/notice";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api/hook";
import type { ApiV1GuildsModulesByeGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { createSelectableItems } from "@/utils/create-selectable-items";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiArrowLeft, HiChat, HiExternalLink } from "react-icons/hi";

export default function Home() {
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const params = useParams();
    const { data, isLoading, error, edit } = useApi<ApiV1GuildsModulesByeGetResponse>(`/guilds/${params.guildId}/modules/bye`);

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
                    href="/docs/greetings"
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
            label="Farewell module enabled"
            endpoint={`/guilds/${guild?.id}/modules/bye`}
            k="enabled"
            defaultState={data.enabled || false}
            onSave={(s) => edit("enabled", s)}
        />

        <NumberInput
            name="After how many seconds the message should be deleted"
            description="Set to 0 to disable"
            url={`/guilds/${guild?.id}/modules/bye`}
            dataName="deleteAfter"
            defaultState={data.deleteAfter ?? 0}
            disabled={!data.enabled}
            onSave={(n) => edit("deleteAfter", n)}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                name="Channel"
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="channelId"
                items={createSelectableItems(guild?.channels)}
                description="Select the channel where the farewell message should be send into"
                defaultState={data.channelId}
                disabled={!data.enabled}
                onSave={(o) => edit("channelId", o.value)}
            />

            <Fetch
                className="w-1/3 md:w-1/6 relative top-8"
                url={`/guilds/${params.guildId}/modules/bye/test`}
                icon={<HiChat className="min-h-4 min-w-4" />}
                label="Test Message"
                method="POST"
                size="lg"
            />
        </div>

        <MessageCreatorEmbed
            name="Message"
            url={`/guilds/${guild?.id}/modules/bye`}
            dataName="message"
            defaultMessage={data.message}
            messageAttachmentComponent={data.card.enabled && (
                <Image
                    src={`https://image-api.wamellow.com/?type=leave&username=${encodeURIComponent(user!.username)}&members=1090&hash=${encodeURIComponent(user!.id)}/${encodeURIComponent(user!.avatar!)}${data.card.background ? `&background=${encodeURIComponent(data.card.background)}` : ""}`}
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
                    endpoint={`/guilds/${guild?.id}/modules/bye`}
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
                        endpoint={`/guilds/${guild?.id}/modules/bye`}
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
                        url={`/guilds/${guild?.id}/modules/bye`}
                        ratio="aspect-[4/1]"
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
    </>);
}