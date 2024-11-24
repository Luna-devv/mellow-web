import { Collection } from "@discordjs/collection";
import { type APIUser, type RESTError, type RESTGetAPIUserResult, Routes } from "discord-api-types/v10";

import { rest } from "./index";

const cache = new Collection<string, User>();

export default class User {
    constructor(data: APIUser) {
        this.id = data.id;
        this.username = data.username;
        this.globalName = data.global_name || null;
        this.avatar = data.avatar;
        this.avatarUrl = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${data.avatar.startsWith("a_") ? "gif" : "webp"}` : null;
        this.bot = data.bot || false;
    }

    public id: string;
    public username: string;
    public globalName: string | null;
    public avatar: string | null;
    public avatarUrl: string | null;
    public bot: boolean;
}

export async function getUser(userId: string) {
    const user = cache.get(userId);
    if (user) return user;

    const data = await rest.get(Routes.user(userId)) as RESTGetAPIUserResult | RESTError;
    if (!data || "message" in data) return null;

    const newUser = new User(data);
    cache.set(userId, newUser);

    return newUser;
}