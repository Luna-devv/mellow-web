import { type Guild, guildStore } from "@/common/guilds";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import { TTSFaq } from "@/components/tts-faq";
import { GuildFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { ChannelType } from "discord-api-types/v10";
import { useParams } from "next/navigation";
import { useCallback } from "react";

export function TTSSettings() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const edit = useCallback(
        <K extends keyof Guild["tts"]>(key: K, value: Guild["tts"][K]) => {
            guildStore.setState((g) => {
                if (!g) return g;
                g.tts = { ...g.tts, [key]: value };
                return g;
            });
        },
        [guild]
    );

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
                    onSave={(o) => edit("channelId", o.value)}
                    showClear
                />
                <SelectMenu
                    name="Usage logs"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.logChannelId"
                    items={createSelectableItems(guild?.channels)}
                    description="Select a channel where usage logs should be posted into."
                    defaultState={guild?.tts.logChannelId}
                    onSave={(o) => edit("logChannelId", o.value)}
                    showClear
                />
                <SelectMenu
                    name="Priority role"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.priorityRoleId"
                    items={createSelectableItems(guild?.roles)}
                    description="People with this role bypass the queue and speak immediately."
                    defaultState={guild?.tts.priorityRoleId}
                    onSave={(o) => edit("priorityRoleId", o.value)}
                    showClear
                />
                <SelectMenu
                    name="Blacklist role"
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.blacklistRoleId"
                    items={createSelectableItems(guild?.roles)}
                    description="People with this role are not allowed to use tts."
                    defaultState={guild?.tts.blacklistRoleId}
                    onSave={(o) => edit("blacklistRoleId", o.value)}
                    showClear
                />
                <Switch
                    label="Announce user"
                    badge="Experimental"
                    endpoint={`/guilds/${params.guildId}`}
                    k="flags"
                    defaultState={(guild!.flags & GuildFlags.TextToSpeechAnnounceUsers) !== 0}
                    transform={(value) => transformer(value, guild!.flags, GuildFlags.TextToSpeechAnnounceUsers)}
                    onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.TextToSpeechAnnounceUsers) })}
                />
                <Switch
                    label="Queue messages"
                    endpoint={`/guilds/${params.guildId}`}
                    k="flags"
                    defaultState={(guild!.flags & GuildFlags.TextToSpeechQueueMessages) !== 0}
                    transform={(value) => transformer(value, guild!.flags, GuildFlags.TextToSpeechQueueMessages)}
                    onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.TextToSpeechQueueMessages) })}
                />
                <Switch
                    label="Allow bots, apps and webhooks"
                    endpoint={`/guilds/${params.guildId}`}
                    k="flags"
                    defaultState={(guild!.flags & GuildFlags.TextToSpeechAllowBots) !== 0}
                    transform={(value) => transformer(value, guild!.flags, GuildFlags.TextToSpeechAllowBots)}
                    onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.TextToSpeechAllowBots) })}
                />
                <NumberInput
                    name="Max message length"
                    description="The maximum length of a message that can be spoken."
                    url={`/guilds/${params.guildId}`}
                    dataName="tts.maxLength"
                    defaultState={guild?.tts.maxLength || 4_000}
                    max={4_000}
                    onSave={(value) => edit("maxLength", value)}
                />
            </div>

            <TTSFaq />
        </div>
    );
}