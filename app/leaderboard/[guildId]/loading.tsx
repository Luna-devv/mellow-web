import { ClientSkeleton } from "@/components/client";

export default function Loading() {
    return new Array(20).fill(null).map((_, i) => (
        <div
            key={"leaderboardLoading-" + i}
            className="mb-4 rounded-md p-3 flex items-center dark:bg-wamellow bg-wamellow-100 w-full"
        >
            <ClientSkeleton className="rounded-full w-12 h-12 mr-3" />

            <div className="flex flex-col gap-2 mt-0.5">
                <ClientSkeleton className="h-5 w-28 rounded-full" />
                <ClientSkeleton className="h-3 w-20 rounded-full" />
            </div>

            <ClientSkeleton className="ml-auto h-8 w-14 rounded-lg" />

            <ClientSkeleton className="rounded-full w-12 h-12 ml-3" />
        </div>
    ));
}