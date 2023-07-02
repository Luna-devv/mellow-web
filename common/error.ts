import { create } from "zustand";

export const errorStore = create<string | undefined>(() => undefined);