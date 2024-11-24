"use client";

import { type User, userStore } from "@/common/user";
import SelectInput from "@/components/inputs/select-menu";
import { deepMerge } from "@/utils/deepMerge";
import { type actor, getVoices, voices } from "@/utils/tts";

export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && !user.extended) return <></>;

    return (
        <div>

            <div className="lg:flex gap-3">
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

                <div className="lg:w-1/2">
                    <SelectInput
                        name="Default Filetype"
                        url="/users/@me/text-to-speech"
                        dataName="defaultFiletype"
                        description="The default audio format for file based tts."
                        items={["mp3", "wav", "ogg"].map((type) => ({
                            name: `.${type}`,
                            value: type
                        }))}
                        defaultState={user?.extended?.tts?.defaultFiletype}
                        onSave={(options) => {
                            if (!user) return;
                            userStore.setState(deepMerge<User>(user, { extended: { tts: { defaultFiletype: options.value as "mp3" | "wav" | "ogg" } } }));
                        }}
                    />
                </div>
            </div>

            <iframe
                className="mt-6 aspect-video rounded-lg"
                width={"100%"}
                src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                title="Wamellow Text to Speech tutorial"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />

        </div>
    );
}