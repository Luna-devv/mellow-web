
"use client";

import { userStore } from "@/common/user";
import ErrorBanner from "@/components/Error";
import ImageUrlInput from "@/components/inputs/ImageUrlInput";

export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && user.extended === undefined) return <ErrorBanner message={"Error while fetching user"} />;

    return (
        <div>

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