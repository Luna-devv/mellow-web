import { StarboardStyle } from "@/typings";
import { useMemo } from "react";

interface Example {
    avatar: string | null;
    username: string | null;
}

export function useExample(style: StarboardStyle) {
    return useMemo<Example>(() => {
        switch (style) {
            case StarboardStyle.GlobalName:
                return {
                    avatar: "/space.webp",
                    username: "Space Wolf"
                };
            case StarboardStyle.Nickname:
                return {
                    avatar: "/space.webp",
                    username: "Luna’s Grandpa <3"
                };
            case StarboardStyle.NicknameAndGuildAvatar:
                return {
                    avatar: "/shiggy.gif",
                    username: "Luna’s Grandpa <3"
                };
            case StarboardStyle.Anonymous:
                return {
                    avatar: null,
                    username: null
                };
            default:
                return {
                    avatar: "/space.webp",
                    username: "@spacewolf."
                };
        }
    }, [style]);
}