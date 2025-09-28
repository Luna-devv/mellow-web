import type { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse } from "@/typings";
import { create } from "zustand";

export interface Guild extends ApiV1GuildsGetResponse {
    channels?: ApiV1GuildsChannelsGetResponse[];
    roles?: ApiV1GuildsRolesGetResponse[];
    emojis?: ApiV1GuildsEmojisGetResponse[];
}

export const guildStore = create<Guild | undefined>(() => undefined);