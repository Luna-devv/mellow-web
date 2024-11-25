import { ChannelType } from "discord-api-types/v10";
import Image from "next/image";

import { type ApiV1GuildsChannelsGetResponse, type ApiV1GuildsEmojisGetResponse, type ApiV1GuildsRolesGetResponse, PermissionFlagsBits } from "@/typings";

type Item = ApiV1GuildsChannelsGetResponse | ApiV1GuildsRolesGetResponse;
type PermissionNames = keyof typeof PermissionFlagsBits | "RoleHirachy";

function parsePermissions(permissions: number, required: PermissionNames[]) {
    if (permissions === -1 && required.includes("RoleHirachy")) return ["Role is above Wamellow"];

    return required
        .filter((perm) => perm !== "RoleHirachy")
        .map((perm) => (permissions & PermissionFlagsBits[perm as keyof typeof PermissionFlagsBits]) === 0 ? perm : false)
        .filter(Boolean);
}

export function createSelectableItems<T extends Item>(
    items: T[] | undefined,
    requiredPermissions: PermissionNames[] = ["ViewChannel", "SendMessages", "EmbedLinks"],
    allowNSFW: boolean = false
) {
    if (!items?.length) return [];

    return items
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !allowNSFW && !("nsfw" in item ? item.nsfw : false))
        .filter((item) => "type" in item ? [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(item.type) : true)
        .map((item) => ({
            name: `${"type" in item ? "#" : "@"}${item.name}`,
            value: item.id,
            error: "permissions" in item
                ? parsePermissions(item.permissions, requiredPermissions).join(", ")
                : undefined,
            color: "color" in item ? item.color : undefined
        }));
}

export function createSelectableEmojiItems(emojis: ApiV1GuildsEmojisGetResponse[] = []) {
    return [
        { icon: "👋", name: "Wave", value: "👋" },
        { icon: "☕", name: "Coffee", value: "☕" },
        ...emojis
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({
                icon: <Image
                    src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`}
                    className="rounded-md h-6 w-6"
                    alt={c.name}
                    height={64}
                    width={64}
                />,
                name: c.name.replace(/-|_/g, " "),
                value: c.id
            }))
    ];
}