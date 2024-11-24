import type React from "react";

import type { User } from "@/common/user";
import type { ApiError } from "@/typings";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

export async function authorize({
    setState
}: {
    setState: React.Dispatch<React.SetStateAction<State>>;
}) {
    setState(State.Idle);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        credentials: "include"
    })
        .then((res) => res.json())
        .catch(() => null) as User | ApiError | null;

    if (res && "statusCode" in res && res.statusCode.toString().startsWith("4")) {
        window.location.href = "/login";
        return null;
    }

    if (!res) {
        setState(State.Failure);
        return null;
    }

    setState(State.Idle);
    return res;
}