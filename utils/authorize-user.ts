import React from "react";

import { User } from "@/common/user";
import { RouteErrorResponse } from "@/typings";

export async function authorize({
    stateHook
}: {
    stateHook: React.Dispatch<React.SetStateAction<"LOADING" | "ERRORED" | undefined>>;
}): Promise<User | null> {
    stateHook(undefined);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .catch(() => null) as User | RouteErrorResponse | null;

    if (res && "statusCode" in res) {
        // window.location.href = "/login";
        console.log(res);
        return null;
    }

    if (!res) {
        stateHook("ERRORED");
        return null;
    }

    stateHook(undefined);
    return res;
}