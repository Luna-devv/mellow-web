"use client";

import { type User, userStore } from "@/common/user";
import SelectInput from "@/components/inputs/select-menu";
import { TTSFaq } from "@/components/tts-faq";
import { deepMerge } from "@/utils/deepMerge";
import { type actor, getVoices, voices } from "@/utils/tts";

export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && !user.extended) return <></>;

    return (
        <div>
            <div className="lg:flex gap-6 mt-5">
                <div className="lg:w-1/2">
                    <SelectInput
                        name="Default Speaker"
                        url="/users/@me/text-to-speech"
                        dataName="defaultVoice"
                        description="This is the default voice for any text to speech conversion."
                        items={voices.map((voice) => ({
                            name: getVoices(voice)[0],
                            value: voice
                        }))}
                        defaultState={user?.extended?.tts?.defaultVoice}
                        onSave={(options) => {
                            if (!user) return;
                            userStore.setState(deepMerge<User>(user, { extended: { tts: { ...user.extended?.tts, defaultVoice: options.value as keyof typeof actor } } }));
                        }}
                    />
                </div>

                <TTSFaq />
            </div>
        </div>
    );
}