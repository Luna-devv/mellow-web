import { create } from "zustand";

export interface Web {
    devToolsEnabled: boolean | undefined;
    reduceMotions: boolean;
    width: number;
}

export const webStore = create<Web>(() => ({
    devToolsEnabled: undefined,
    reduceMotions: false,
    width: Infinity
}));