"use client";

import { User, userStore } from "@/common/user";
import ImageUrlInput from "@/components/inputs/image-url-input";
import SelectInput from "@/components/inputs/select-menu";
import TextInput from "@/components/inputs/text-input";
import { deepMerge } from "@/utils/deepMerge";

export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && !user.extended) return <></>;

    return (
        <div>

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <SelectInput
                        name="Secondary text"
                        url="/users/@me/rank"
                        dataName="subText.type"
                        description="This text will be displayed bellow the /rank progressbar."
                        items={[
                            {
                                name: "None",
                                value: 0
                            },
                            {
                                name: "ETA to next milestone reach date",
                                value: 1
                            },
                            {
                                name: "ETA to next milestone reach relative date",
                                value: 2
                            },
                            {
                                name: "Custom text",
                                value: 3,
                                error: "Not done yet"
                            }
                        ]}
                        defaultState={user?.extended?.rank?.subText?.type}
                        onSave={(options) => {
                            if (!user) return;
                            userStore.setState(deepMerge<User>(user, { extended: { rank: { subText: { type: Number(options.value) as 0 | 1 | 2 | 3 } } } }));
                        }}
                    />
                </div>

                <div className="lg:w-1/2 flex gap-2 w-full">

                    <div className="w-1/2">
                        <TextInput
                            key="textColor"
                            name="Text color"
                            url="/users/@me/rank"
                            dataName="textColor"
                            description="Color used for your username."
                            type="color"
                            defaultState={user?.extended?.rank?.textColor ?? 0}
                            onSave={(value) => {
                                if (!user) return;
                                userStore.setState(deepMerge<User>(user, { extended: { rank: { textColor: Number(value) } } }));
                            }}
                        />
                    </div>

                    <div className="w-1/2">
                        <TextInput
                            key="barColor"
                            name="Bar color"
                            url="/users/@me/rank"
                            dataName="barColor"
                            description="Color used for the progress bar."
                            type="color"
                            defaultState={user?.extended?.rank?.barColor ?? 0}
                            onSave={(value) => {
                                if (!user) return;
                                userStore.setState(deepMerge<User>(user, { extended: { rank: { barColor: Number(value) } } }));
                            }}
                        />
                    </div>

                </div>
            </div>

            <ImageUrlInput
                name="Background"
                url="/users/@me/rank"
                ratio="aspect-[4/1]"
                dataName="background"
                description="Enter a url which should be the background of your /rank card. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                defaultState={user?.extended?.rank?.background || ""}
                onSave={(value) => {
                    if (!user) return;
                    userStore.setState(deepMerge<User>(user, { extended: { rank: { background: value } } }));
                }}
            />

            <div className="text-lg dark:text-neutral-300 text-neutral-700 font-medium mb-1 mt-3">Leaderboard syle</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">

                <button
                    className="w-full"
                    onClick={() => {
                        if (user?.extended?.rank?.useLeaderboardList === false) return;

                        fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/rank`, {
                            method: "PATCH",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ useLeaderboardList: false })
                        })
                            .then(async (res) => {
                                const response = await res.json();
                                if (!response) return;

                                switch (res.status) {
                                    case 200: {
                                        userStore.setState({ ...deepMerge<User>(user, { extended: { rank: { useLeaderboardList: false } } }) });
                                        break;
                                    }
                                }

                            });
                    }}
                >
                    <div className={`border-2 ${user?.extended?.rank?.useLeaderboardList ? "dark:border-neutral-700 hover:border-neutral-500 border-neutral-300 " : "dark:border-violet-400/60 dark:hover:border-violet-400 border-violet-600/60 hover:border-violet-600"} duration-200 rounded-md group p-6 mt-1 grid grid-rows-5 grid-cols-2 gap-3`}>
                        {new Array(10).fill("").map((_, i) =>
                            <div key={i} className="flex gap-2">
                                <div className={`${user?.extended?.rank?.useLeaderboardList ? "dark:bg-neutral-700/90 dark:group-hover:bg-neutral-400/60 bg-neutral-300/90 group-hover:bg-neutral-600/60" : "dark:bg-violet-400/50 dark:group-hover:bg-violet-400/70 bg-violet-600/50 group-hover:bg-violet-600/70"} duration-200 h-6 w-6 aspect-square rounded-full`} />
                                <div className={`${user?.extended?.rank?.useLeaderboardList ? "dark:bg-neutral-700/80 dark:group-hover:bg-neutral-400/50 bg-neutral-300/80 group-hover:bg-neutral-600/50" : "dark:bg-violet-400/40 dark:group-hover:bg-violet-400/60 bg-violet-600/40 group-hover:bg-violet-600/60"} duration-200 h-6 rounded-full`} style={{ width: `${30 + ((i % 1.7) + (i % 3) + (i % 2)) * 10}%` }} />
                            </div>
                        )}
                    </div>
                </button>

                <button
                    className="w-full"
                    onClick={() => {
                        if (user?.extended?.rank?.useLeaderboardList === true) return;

                        fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/rank`, {
                            method: "PATCH",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ useLeaderboardList: true })
                        })
                            .then(async (res) => {
                                const response = await res.json();
                                if (!response) return;

                                switch (res.status) {
                                    case 200: {
                                        userStore.setState({ ...deepMerge<User>(user, { extended: { rank: { useLeaderboardList: true } } }) });
                                        break;
                                    }
                                }

                            });
                    }}
                >
                    <div className={`border-2 ${!user?.extended?.rank?.useLeaderboardList ? "dark:border-neutral-700 hover:border-neutral-500 border-neutral-300 " : "dark:border-violet-400/60 dark:hover:border-violet-400 border-violet-600/60 hover:border-violet-600"} duration-200 rounded-md p-4 mt-1 flex flex-col gap-2 group`}>
                        {new Array(8).fill("").map((_, i) =>
                            <div key={i} className="flex gap-2">
                                <div className={`${!user?.extended?.rank?.useLeaderboardList ? "dark:bg-neutral-700/90 dark:group-hover:bg-neutral-400/60 bg-neutral-300/90 group-hover:bg-neutral-600/60" : "dark:bg-violet-400/50 dark:group-hover:bg-violet-400/70 bg-violet-600/50 group-hover:bg-violet-600/70"} duration-200 h-4 w-4 aspect-square rounded-full`} />
                                <div className={`${!user?.extended?.rank?.useLeaderboardList ? "dark:bg-neutral-700/80 dark:group-hover:bg-neutral-400/50 bg-neutral-300/80 group-hover:bg-neutral-600/50" : "dark:bg-violet-400/40 dark:group-hover:bg-violet-400/60 bg-violet-600/40 group-hover:bg-violet-600/60"} duration-200 h-4 rounded-full`} style={{ width: `${30 + ((i % 1.7) + (i % 3) + (i % 2)) * 10}%` }} />
                            </div>
                        )}
                    </div>
                </button>

            </div>

        </div >
    );
}