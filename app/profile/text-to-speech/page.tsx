"use client";

import { type User, userStore } from "@/common/user";
import SelectInput from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import { TTSFaq } from "@/components/tts-faq";
import { UserFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { deepMerge } from "@/utils/deepMerge";
import { type actor, getVoices, voices } from "@/utils/tts";

export default function Home() {
    const user = userStore((s) => s!);

    if (user.id && !user.extended) return <></>;

    return (
        <div>
            <div className="lg:flex gap-6 mt-5">
                <div className="lg:w-1/2">
                    <SelectInput
                        name="Default Speaker"
                        url="/users/@me/text-to-speech"
                        dataName="voice"
                        description="This is the default voice for any text to speech conversion."
                        items={voices.map((voice) => ({
                            name: getVoices(voice)[0],
                            value: voice
                        }))}
                        defaultState={user?.extended?.voice}
                        onSave={(options) => {
                            userStore.setState(deepMerge<User>(user, { extended: { voice: options.value as keyof typeof actor } }));
                        }}
                    />
                    <Switch
                        label="Chat to Speech"
                        description="Whenever your messages should be spoken aloud in chat to speech channels."
                        inverted
                        endpoint="/users/@me"
                        k="flags"
                        defaultState={(user.extended!.flags & UserFlags.ChatToSpeechIgnore) !== 0}
                        transform={(value) => transformer(value, user.extended!.flags, UserFlags.ChatToSpeechIgnore)}
                        onSave={(value) => {
                            userStore.setState(deepMerge<User>(user, { extended: { flags: transformer(value, user.extended!.flags, UserFlags.ChatToSpeechIgnore) } }));
                        }}
                    />
                </div>

                <TTSFaq />
            </div>
        </div>
    );
}