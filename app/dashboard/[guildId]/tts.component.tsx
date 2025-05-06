import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { ChannelType } from "discord-api-types/v10";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiExternalLink } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import { createSelectableItems } from "@/utils/create-selectable-items";

export function TTSSettings() {
    const guild = guildStore((g) => g);
    const params = useParams();

    return (
        <div className="lg:flex gap-6 mt-5">
            <div className="lg:w-1/2 flex flex-col gap-2">
                <SelectMenu
                    name="Chat to Speech channel"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.channelId"
                    items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"], [ChannelType.GuildText, ChannelType.GuildVoice])}
                    description="Select a channel what channel should be used for tts."
                    defaultState={guild?.tts.channelId}
                    showClear
                />
                <SelectMenu
                    name="Usage logs"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.logChannelId"
                    items={createSelectableItems(guild?.channels)}
                    description="Select a channel where usage logs should be posted into."
                    defaultState={guild?.tts.logChannelId}
                    showClear
                />
                <SelectMenu
                    name="Priority role"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.priorityRoleId"
                    items={createSelectableItems(guild?.roles)}
                    description="People with this role bypass the queue and speak immediately."
                    defaultState={guild?.tts.priorityRoleId}
                    showClear
                />
                <Switch
                    name="Announce user"
                    badge="Experimental"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.announceUser"
                    description="If I should say who is currently speaking via tts."
                    defaultState={guild?.tts.announceUser || false}
                />
                <Switch
                    name="Queue messages"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.queue"
                    description="Queue sent messages instead of refusing to speak."
                    defaultState={guild?.tts.queue || false}
                />
                <NumberInput
                    name="Max message length"
                    description="The maximum length of a message that can be spoken."
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.maxLength"
                    defaultState={guild?.tts.maxLength || 4000}
                    max={4000}
                />
            </div>

            <Faq />
        </div>
    );
}

function Faq() {
    const cookies = useCookies();

    return (
        <Accordion
            className="lg:w-1/2"
            defaultExpandedKeys={["1"]}
            disableAnimation={cookies.get("reduceMotions") === "true"}
        >
            <AccordionItem
                key="1"
                aria-label="how this works"
                title="How this works"
            >
                Users in a voice channel can send messages to this channel, and Wamellow will read them aloud in the voice channel. Please note that Wamellow can only be in one voice channel at a time.

                <iframe
                    className="mt-4 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                    title="Wamellow Text to Speech tutorial"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />

                <Button
                    as={Link}
                    className="my-2"
                    href="/docs/text-to-speech"
                    target="_blank"
                    endContent={<HiExternalLink />}
                    size="sm"
                >
                    Read the documentation
                </Button>
            </AccordionItem>
            <AccordionItem
                key="2"
                aria-label="how to blacklist users"
                title="How to blacklist users"
            >
                Blacklist a user using discord channel permissions.

                <Link
                    href="https://cdn.waya.one/r/YcU2CC.gif"
                    target="_blank"
                >
                    <Image
                        alt="blacklist a user with discord channel permissions"
                        className="mt-4 rounded-md"
                        height={945 / 2}
                        src="https://cdn.waya.one/r/YcU2CC.gif"
                        width={1040 / 2}
                    />
                </Link>
            </AccordionItem>
        </Accordion>
    );
}