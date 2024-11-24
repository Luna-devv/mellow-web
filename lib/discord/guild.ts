import { Collection } from "@discordjs/collection";
import { type APIGuild, type RESTError, type RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";

import { rest } from "./index";
import { fetchWidget } from "./widget";

const cache = new Collection<string, Guild>();

export default class Guild {
    constructor(data: APIGuild) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.iconUrl = data.icon ? `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.${data.icon.startsWith("a_") ? "gif" : "webp"}` : null;
        this.memberCount = data.approximate_member_count || 0;
    }

    public id: string;
    public name: string;
    public icon: string | null;
    public iconUrl: string | null;
    public memberCount: number;

    fetchWidget() {
        return fetchWidget(this.id);
    }
}

export async function getGuild(guildId: string) {
    const user = cache.get(guildId);
    if (user) return user;

    const data = await rest.get(`${Routes.guild(guildId)}?with_counts=true`) as RESTGetAPIGuildResult | RESTError;
    if (!data || "message" in data) return null;

    const newUser = new Guild(data);
    cache.set(guildId, newUser);

    return newUser;
}