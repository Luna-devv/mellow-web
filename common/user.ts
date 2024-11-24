import { create } from "zustand";

import type { ApiV1UsersMeGetResponse } from "@/typings";

export interface User {
    HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY?: true;

    email?: string | null;
    id: string;
    username: string;
    globalName?: string | null;
    avatar: string | null;
    isPremium?: number | null;

    __fetched: boolean;

    extended: ApiV1UsersMeGetResponse | undefined;
}

export const userStore = create<User | undefined>(() => ({
    session: "",

    id: "",
    username: "",
    avatar: "null",

    __fetched: false,
    extended: undefined
}));