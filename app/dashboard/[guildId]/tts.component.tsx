import { ChannelType } from "discord-api-types/v10";
import { useParams } from "next/navigation";

import { guildStore } from "@/common/guilds";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import { TTSFaq } from "@/components/tts-faq";
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
                    items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages", "EmbedLinks"], [ChannelType.GuildText, ChannelType.GuildVoice])}
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

            <TTSFaq />
        </div>
    );
}