import { create } from "zustand";

export interface Web {
    devToolsEnabled: boolean|undefined;
    width: number;
}

export const webStore = create<Web>(() => ({
    devToolsEnabled: undefined,
    width: Infinity
}));