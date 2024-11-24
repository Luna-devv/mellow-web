import { defaultFetchOptions } from "@/lib/api";
import type { ApiError, ApiV1UsersGetResponse } from "@/typings";

export async function getUser(userId: string): Promise<ApiV1UsersGetResponse | ApiError | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/${userId}`,
        defaultFetchOptions
    );

    return res.json();
}