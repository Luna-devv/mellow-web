import { type User, userStore } from "@/common/user";
import type { ApiError, ApiV1UsersMeGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { deepMerge } from "@/utils/deepMerge";
import { useState } from "react";

export default function LeaderboardStyle() {
    const user = userStore((s) => s);

    const [error, setError] = useState<string | null>(null);

    if (user?.id && !user.extended) return <></>;

    async function update(useLeaderboardList: boolean) {
        if (user?.extended?.rank?.useLeaderboardList === useLeaderboardList) return;
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/rank`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ useLeaderboardList })
        })
            .then((r) => r.json())
            .catch(() => null) as ApiV1UsersMeGetResponse["rank"] | ApiError | null;

        if (!res || "message" in res) {
            setError(
                res && "message" in res
                    ? res.message
                    : "Failed to update"
            );
            return;
        }

        userStore.setState({
            ...deepMerge<User>(user, {
                extended: { rank: res }
            })
        });
    }

    return (<>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <button
                className="w-full"
                onClick={() => update(false)}
            >
                <div
                    className={cn(
                        "border-2 duration-200 rounded-md group p-6 mt-1 grid grid-rows-5 grid-cols-2 gap-3",
                        user?.extended?.rank?.useLeaderboardList
                            ? "dark:border-neutral-700 hover:border-neutral-500 border-neutral-300 "
                            : "dark:border-violet-400/60 dark:hover:border-violet-400 border-violet-600/60 hover:border-violet-600"
                    )}
                >
                    {Array.from({ length: 10 }).fill("").map((_, i) =>
                        <div key={i} className="flex gap-2">
                            <div
                                className={cn(
                                    "duration-200 h-6 w-6 aspect-square rounded-full",
                                    user?.extended?.rank?.useLeaderboardList
                                        ? "dark:bg-neutral-700/90 dark:group-hover:bg-neutral-400/60 bg-neutral-300/90 group-hover:bg-neutral-600/60"
                                        : "dark:bg-violet-400/50 dark:group-hover:bg-violet-400/70 bg-violet-600/50 group-hover:bg-violet-600/70"
                                )}
                            />
                            <div
                                className={cn(
                                    "duration-200 h-6 rounded-full",
                                    user?.extended?.rank?.useLeaderboardList
                                        ? "dark:bg-neutral-700/80 dark:group-hover:bg-neutral-400/50 bg-neutral-300/80 group-hover:bg-neutral-600/50"
                                        : "dark:bg-violet-400/40 dark:group-hover:bg-violet-400/60 bg-violet-600/40 group-hover:bg-violet-600/60"
                                )}
                                style={{ width: `${30 + ((i % 1.7) + (i % 3) + (i % 2)) * 10}%` }}
                            />
                        </div>
                    )}
                </div>
            </button>

            <button
                className="w-full"
                onClick={() => update(true)}
            >
                <div
                    className={cn(
                        "border-2 duration-200 rounded-md p-4 mt-1 flex flex-col gap-2 group",
                        user?.extended?.rank?.useLeaderboardList
                            ? "dark:border-violet-400/60 dark:hover:border-violet-400 border-violet-600/60 hover:border-violet-600"
                            : "dark:border-neutral-700 hover:border-neutral-500 border-neutral-300 "
                    )}
                >
                    {Array.from({ length: 8 }).fill("").map((_, i) =>
                        <div key={i} className="flex gap-2">
                            <div
                                className={cn(
                                    "duration-200 h-4 w-4 aspect-square rounded-full",
                                    user?.extended?.rank?.useLeaderboardList
                                        ? "dark:bg-violet-400/50 dark:group-hover:bg-violet-400/70 bg-violet-600/50 group-hover:bg-violet-600/70"
                                        : "dark:bg-neutral-700/90 dark:group-hover:bg-neutral-400/60 bg-neutral-300/90 group-hover:bg-neutral-600/60"
                                )}
                            />
                            <div
                                className={cn(
                                    "duration-200 h-4 rounded-full",
                                    user?.extended?.rank?.useLeaderboardList
                                        ? "dark:bg-violet-400/40 dark:group-hover:bg-violet-400/60 bg-violet-600/40 group-hover:bg-violet-600/60"
                                        : "dark:bg-neutral-700/80 dark:group-hover:bg-neutral-400/50 bg-neutral-300/80 group-hover:bg-neutral-600/50"
                                )}
                                style={{ width: `${30 + ((i % 1.7) + (i % 3) + (i % 2)) * 10}%` }}
                            />
                        </div>
                    )}
                </div>
            </button>

        </div>

        <div className="flex">
            {error &&
                <div className="ml-auto text-red-500 text-sm">
                    {error}
                </div>
            }
        </div>
    </>);
}