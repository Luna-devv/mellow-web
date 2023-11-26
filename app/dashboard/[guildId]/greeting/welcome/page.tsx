
"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import ErrorBanner from "@/components/Error";
import GoBack from "@/components/GoBack";
import ImageUrlInput from "@/components/inputs/ImageUrlInput";
import MultiSelectMenu from "@/components/inputs/MultiSelectMenu";
import NumberInput from "@/components/inputs/NumberInput";
import SelectMenu from "@/components/inputs/SelectMenu";
import Switch from "@/components/inputs/Switch";
import MessageCreatorEmbed from "@/components/messageCreator/Embed";
import { ApiV1GuildsModulesWelcomeGetResponse, RouteErrorResponse } from "@/typings";

export default function Home() {
    const web = webStore((w) => w);
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [welcome, setWelcome] = useState<ApiV1GuildsModulesWelcomeGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/welcome`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
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

    if (welcome === undefined) return (
        <div>
            <GoBack url={`/dashboard/${guild?.id}/greeting`} />
            {error && <ErrorBanner message={error} />}
        </div>
    );

    return (
        <div>

            <GoBack url={`/dashboard/${guild?.id}/greeting`} />

            <Switch
                name="Welcome module enabled."
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
                name="Restore members roles and nickname on rejoin."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="restore"
                defaultState={welcome?.restore || false}
                disabled={!welcome.enabled}
            />

            <NumberInput
                name="After how many seconds the message should be deleted."
                description="Set to 0 to disable."
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="deleteAfter"
                defaultState={welcome?.deleteAfter ?? 0}
                disabled={!welcome.enabled}
            />

            <div className="flex md:gap-4 gap-3">
                <SelectMenu
                    name="Channel"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="channelId"
                    items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.join(", ") }; })}
                    description="Select the channel where the welcome message should be send into."
                    defaultState={welcome?.channelId}
                    disabled={!welcome.enabled || false}
                />

                <button
                    id="test-button"
                    className={`flex justify-center items-center bg-violet-600 hover:bg-violet-600/80 text-white py-2 px-4 rounded-md duration-100 mt-8 h-12 md:w-32 ${!welcome.enabled && "cursor-not-allowed opacity-50"}`}
                    disabled={!welcome.enabled}
                    onClick={() => {
                        if (document.getElementById("test-button")?.classList.contains("cursor-not-allowed")) return;
                        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/welcome/test`, {
                            method: "POST",
                            headers: {
                                authorization: localStorage.getItem("token") as string
                            }
                        })
                            .then(async (res) => {
                                console.log(res);
                                const response = await res.json() as ApiV1GuildsModulesWelcomeGetResponse;
                                if (!response) return;

                                switch (res.status) {
                                    case 200: {
                                        document.getElementById("test-button")?.classList.add(..."bg-green-700 hover:bg-green-600 cursor-not-allowed".split(" "));
                                        document.getElementById("test-button")?.classList.remove(..."bg-violet-600 hover:bg-violet-600/80".split(" "));

                                        setTimeout(() => {
                                            document.getElementById("test-button")?.classList.remove(..."bg-green-700 hover:bg-green-600 cursor-not-allowed".split(" "));
                                            document.getElementById("test-button")?.classList.add(..."bg-violet-600 hover:bg-violet-600/80".split(" "));
                                        }, 1_000 * 8);

                                        break;
                                    }
                                    default: {
                                        setError((response as unknown as RouteErrorResponse).message);
                                        break;
                                    }
                                }

                            })
                            .catch(() => {
                                setError("Error while sending test");
                            });
                    }}
                >
                    {web.width > 768 ? <span>Send Test</span> : <span>Test</span>}
                </button>
            </div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <MultiSelectMenu
                        name="Roles"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        dataName="roleIds"
                        items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => { return { name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }; })}
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
                        items={guild?.channels?.sort((a, b) => a.name.localeCompare(b.name)).map((c) => { return { name: `#${c.name}`, value: c.id, error: c.missingPermissions.filter((mp) => mp !== "EmbedLinks").join(", ") }; })}
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
                messageAttachmentComponent={welcome.card.enabled && <Image src={`https://imagerenderer.waya.one/?type=join&username=${encodeURIComponent(user?.username as string)}&members=1090&hash=${encodeURIComponent(user?.id as string)}/${encodeURIComponent(user?.avatar as string)}${welcome.card.background ? `&background=${encodeURIComponent(welcome.card.background)}` : ""}`} width={1024 / 2} height={(256 + 16) / 2} loading="lazy" alt="" />}
                showMessageAttachmentComponentInEmbed={welcome.card.inEmbed}
                disabled={!welcome.enabled}
            >

                <div className={`mt-2 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl p-6 ${!welcome.card.enabled && "pb-[0px]"}`}>

                    <Switch
                        name="Show image card."
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
                collapseable={true}
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