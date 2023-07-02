import { create } from "zustand";

export interface User {
    session: string;
    HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY?: true;

    email: string | null;
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    accent_color?: number | null;
    locale: string;
}

export const userStore = create<User | undefined>(() => ({
    session: "",

    email: "",
    id: "",
    username: "",
    global_name: "",
    avatar: "https://cdn.waya.one/r/discord.png",
    accent_color: 0,
    locale: ""
}));