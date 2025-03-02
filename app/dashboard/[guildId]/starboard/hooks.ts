import { useEffect, useState } from "react";

import { StarboardStyle } from "@/typings";

interface Example {
    avatar: string | null;
    username: string | null;
}

export function useExample(style: StarboardStyle) {
    const [example, setExample] = useState<Example>({
        avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
        username: "@spacewolf."
    });

    useEffect(
        () => {
            switch (style) {
                case StarboardStyle.Username:
                    setExample((e) => {
                        return {
                            ...e,
                            avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
                            username: "@spacewolf."
                        };
                    });
                    break;
                case StarboardStyle.GlobalName:
                    setExample((e) => {
                        return {
                            ...e,
                            avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
                            username: "Space Wolf"
                        };
                    });
                    break;
                case StarboardStyle.Nickname:
                    setExample((e) => {
                        return {
                            ...e,
                            avatar: "https://cdn.waya.one/r/823554a71e92ca6192ab500d9b597a7f.png",
                            username: "Luna’s Grandpa <3"
                        };
                    });
                    break;
                case StarboardStyle.NicknameAndGuildAvatar:
                    setExample((e) => {
                        return {
                            ...e,
                            avatar: "https://cdn.waya.one/r/a_3a2fa421f079827d31f4fd1b7a9971ba.gif",
                            username: "Luna’s Grandpa <3"
                        };
                    });
                    break;
                case StarboardStyle.Anonymous:
                    setExample((e) => {
                        return {
                            ...e,
                            avatar: null,
                            username: null
                        };
                    });
                    break;
            }
        },
        [style]
    );

    return example;
}