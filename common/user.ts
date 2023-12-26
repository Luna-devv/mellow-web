import { create } from "zustand";

import { ApiV1MeGetResponse } from "@/typings";

export interface User {
    session: string;
    HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY?: true;

    email?: string;
    id: string;
    username: string;
    global_name?: string;
    avatar: string | null;
    accent_color?: number | null;

    __fetched: boolean;

    extended: ApiV1MeGetResponse | undefined;
}

export const userStore = create<User | undefined>(() => ({
    session: "",

    id: "",
    username: "",
    avatar: "null",

    __fetched: false,
    extended: undefined
}));