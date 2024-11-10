import { ApiV1GuildsEmojisGetResponse } from "@/typings";
import Image from "next/image";

interface Item {
    name: string;
    id: string;
    missingPermissions?: string[];
    color?: number;
}

export function createSelectableItems<T extends Item>(
    items: T[] | undefined,
    prefix: "#" | "@" | "",
    filter?: (perm: string) => boolean
) {
    if (!items) return [];

    return items
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => ({
            name: `${prefix}${item.name}`,
            value: item.id,
            error: filter
                ? item.missingPermissions?.filter(filter).join(", ")
                : item.missingPermissions?.join(", "),
            color: item.color
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
    ]
}