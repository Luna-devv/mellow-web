import { defaultFetchOptions } from "@/lib/api";
import { ApiV1UsersGetResponse, RouteErrorResponse } from "@/typings";

export async function getUser(userId: string): Promise<ApiV1UsersGetResponse | RouteErrorResponse | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/${userId}`,
        defaultFetchOptions
    );

    return res.json();
}