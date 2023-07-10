"use client";
import { userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import ImageUrlInput from "@/components/inputs/ImageUrlInput";
import SelectInput from "@/components/inputs/SelectMenu";
import TextInput from "@/components/inputs/TextInput";

export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && user.extended === undefined) return <ErrorBanner message={"Error while fetching user"} />;

    return (
        <div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <SelectInput
                        name="Secondary Text"
                        url="/users/@me/rank"
                        dataName="subText.type"
                        description="This text will be displayed bellow the /rank progressbar."
                        items={[
                            {
                                name: "None",
                                value: "0"
                            },
                            {
                                name: "ETA to next milestone reach date",
                                value: "1"
                            },
                            {
                                name: "ETA to next milestone reach relative date",
                                value: "2"
                            },
                            {
                                name: "Custom text",
                                value: "3",
                                error: "Not done yet"
                            }
                        ]}
                        defaultV={user?.extended?.rank.subText.type.toString()}
                    />
                </div>

                <div className="lg:w-1/2 flex gap-2 w-full">

                    <div className="w-1/2">
                        <TextInput
                            key="textColor"
                            name="Text Color"
                            url="/users/@me/rank"
                            dataName="textColor"
                            description="Color used for your username."
                            type="color"
                            __defaultState={user?.extended?.rank.textColor ?? 0}
                        />
                    </div>

                    <div className="w-1/2">
                        <TextInput
                            key="barColor"
                            name="Bar Color"
                            url="/users/@me/rank"
                            dataName="barColor"
                            description="Color used for the progress bar."
                            type="color"
                            __defaultState={user?.extended?.rank.barColor ?? 0}
                        />
                    </div>

                </div>
            </div>

            <ImageUrlInput
                name="Background"
                url="/users/@me/rank"
                dataName="background"
                description="Enter a url which should be the background of your /rank card. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                __defaultState={user?.extended?.rank.background || ""}
            />

        </div>
    );
}