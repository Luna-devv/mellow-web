import { create } from "zustand";

export interface Web {
    width: number;
}

export const webStore = create<Web>(() => ({
    width: Infinity
}));