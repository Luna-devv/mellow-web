import { type RESTError, type RESTGetAPIGuildWidgetJSONResult, Routes } from "discord-api-types/v10";

import { rest } from ".";

export async function fetchWidget(guildId: string) {
    const widget = await rest.get(Routes.guildWidgetJSON(guildId)) as RESTGetAPIGuildWidgetJSONResult | RESTError;
    if (!widget || "message" in widget) return null;

    return widget;
}