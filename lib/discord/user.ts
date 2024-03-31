import { Collection } from "@discordjs/collection";
import { APIUser, RESTGetAPIUserResult, Routes } from "discord-api-types/v10";

import { rest } from ".";

const cache = new Collection<string, User>();

export default class User {
    constructor(data: APIUser) {
        this.id = data.id;
        this.username = data.username;
        this.globalName = data.global_name || null;
        this.avatar = data.avatar;
        this.bot = data.bot || false;
    }

    public id: string;
    public username: string;
    public globalName: string | null;
    public avatar: string | null;
    public bot: boolean;
}

export async function getUser(userId: string) {
    const user = cache.get(userId);
    if (user) return user;

    const userData = await rest.get(Routes.user(userId)) as RESTGetAPIUserResult;
    if (!userData) return null;

    const newUser = new User(userData);
    cache.set(userId, newUser);

    return newUser;
}