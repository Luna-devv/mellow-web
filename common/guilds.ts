import { create } from "zustand";

import { ApiV1GuildsGetResponse } from "@/typings";

export const guildStore = create<ApiV1GuildsGetResponse | undefined>(() => undefined);