"use client";
import { User, userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import SelectInput from "@/components/inputs/SelectMenu";
import { Voice } from "@/typings";
import { deepMerge } from "@/utils/deepMerge";
import { getVoices } from "@/utils/tts";

const TTSVoicesArray = ["en_us_001", "en_us_006", "en_us_007", "en_us_009", "en_us_010", "en_uk_001", "en_uk_003", "en_au_001", "en_au_002", "fr_001", "fr_002", "de_001", "de_002", "es_002", "es_mx_002", "br_003", "br_004", "br_005", "id_001", "jp_001", "jp_003", "jp_005", "jp_006", "kr_002", "kr_004", "kr_003", "en_us_ghostface", "en_us_chewbacca", "en_us_c3po", "en_us_stitch", "en_us_stormtrooper", "en_us_rocket", "en_female_f08_salut_damour", "en_male_m03_lobby", "en_male_m03_sunshine_soon", "en_female_f08_warmy_breeze", "en_female_ht_f08_glorious", "en_male_sing_funny_it_goes_up", "en_male_m2_xhxs_m03_silly", "en_female_ht_f08_wonderful_world"] as Voice[];


export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && user.extended === undefined) return <ErrorBanner message={"Error while fetching user"} />;

    return (
        <div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <SelectInput
                        name="Default Speaker"
                        url="/users/@me/text-to-speech"
                        dataName="defaultVoice"
                        description="This is the default voice for any text to speech conversion."
                        items={TTSVoicesArray.map((voice) => {
                            return {
                                name: getVoices(voice)[0],
                                value: voice
                            };
                        })}
                        __defaultState={user?.extended?.tts?.defaultVoice}
                        onSave={(options) => {
                            if (!user) return;
                            userStore.setState(deepMerge<User>(user, { extended: { tts: { ...user.extended?.tts, defaultVoice: options.value as Voice } } }));
                        }}
                    />
                </div>

                <div className="lg:w-1/2">
                    <SelectInput
                        name="Default Filetype"
                        url="/users/@me/text-to-speech"
                        dataName="defaultFiletype"
                        description="The default audio format for file based tts."
                        items={["mp3", "wav", "ogg"].map((type) => {
                            return {
                                name: `.${type}`,
                                value: type
                            };
                        })}
                        __defaultState={user?.extended?.tts?.defaultFiletype}
                        onSave={(options) => {
                            if (!user) return;
                            userStore.setState(deepMerge<User>(user, { extended: { tts: { defaultFiletype: options.value as "mp3" | "wav" | "ogg" } } }));
                        }}
                    />
                </div>
            </div>

        </div>
    );
}