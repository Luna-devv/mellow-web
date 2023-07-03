import React, { FunctionComponent, useState } from "react";

import { GuildEmbed, RouteErrorResponse } from "@/typings";

import DiscordMessage from "../discord/Message";
import DiscordMessageEmbed from "../discord/MessageEmbed";
import TextInput from "./TextInput";

interface Props {
    children?: React.ReactNode

    name: string;
    url: string;
    dataName: string;

    defaultMessage?: { content?: string, embed?: GuildEmbed };
}

const MessageCreatorEmbed: FunctionComponent<Props> = ({ children, name, url, dataName, defaultMessage }) => {
    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [content, setContent] = useState<string>(defaultMessage?.content || "");
    const [embed, setEmbed] = useState<string>(JSON.stringify(defaultMessage?.embed || {}));
    const [embedfooter, setEmbedfooter] = useState<string>(JSON.stringify(defaultMessage?.embed?.footer || {}));

    const saveHook = () => {
        setError(undefined);
        setState("LOADING");

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
            },
            body: JSON.stringify({ [dataName]: { content, embed: Object.assign(JSON.parse(embed), embedfooter.length > 2 ? { footer: JSON.parse(embedfooter) } : {}) } })
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setState("SUCCESS");
                        setTimeout(() => setState(undefined), 1_000 * 8);
                        break;
                    }
                    default: {
                        setState("ERRORED");
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setState("ERRORED");
                setError("Error while fetching guilds");
            });

    };

    return (
        <div>
            <div className={`mt-16 border-2 dark:border-wamellow border-wamellow-100 rounded-xl px-4 pb-4 ${(error || state === "ERRORED") && "outline outline-red-500 outline-1"}`}>
                <span className="relative bottom-4 text-lg dark:text-wamellow-light text-slate-300 font-medium px-2" style={{ backgroundColor: "var(--background-rgb)" }}>{name}</span>
                <div className="m-1 relative">

                    {children &&
                        <div className="mx-3">
                            {children}
                        </div>
                    }

                    <div className="lg:flex gap-1">

                        <div className="lg:w-3/6 m-1">

                            <TextInput placeholder="Content" value={content} setValue={setContent} max={2000} />
                            <TextInput placeholder="Embed Title" value={embed} setValue={setEmbed} max={256} dataName="title" />
                            <TextInput placeholder="Embed Description" value={embed} setValue={setEmbed} max={4096} dataName="description" />
                            <div className="flex gap-2">
                                <TextInput placeholder="Embed Color" value={embed} setValue={setEmbed} type="color" dataName="color" />
                                <TextInput placeholder="Embed Thumbnail" value={embed} setValue={setEmbed} max={256} dataName="thumbnail" />
                            </div>
                            <TextInput placeholder="Embed Image" value={embed} setValue={setEmbed} max={256} dataName="image" />
                            <div className="flex gap-2">
                                <TextInput placeholder="Embed Footer Icon" value={embedfooter} setValue={setEmbedfooter} max={256} dataName="icon_url" />
                                <TextInput placeholder="Embed Footer" value={embedfooter} setValue={setEmbedfooter} max={256} dataName="text" />
                            </div>

                            <button
                                className="flex justify-center items-center bg-violet-600 hover:bg-violet-500 text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg mt-1 h-12 w-full"
                                onClick={saveHook}
                            >
                                Update
                            </button>

                        </div>

                        <div className="lg:w-3/6 lg:mt-2 m-1 mt-8 min-h-full rounded-md p-4 break-all overflow-hidden max-w-full text-slate-200" style={{ backgroundColor: "rgb(49, 51, 56)" }}>

                            <DiscordMessage
                                user={{
                                    username: "Wamellow",
                                    avatar: "/waya-legacy1.png",
                                    bot: true
                                }}
                            >
                                {content}

                                <DiscordMessageEmbed
                                    title={JSON.parse(embed).title}
                                    color={JSON.parse(embed).color}
                                    thumbnail={JSON.parse(embed).thumbnail}
                                    image={JSON.parse(embed).image}
                                    footer={JSON.parse(embedfooter)}
                                >
                                    {JSON.parse(embed).description}
                                </DiscordMessageEmbed>

                            </DiscordMessage>

                        </div>

                    </div>
                </div>

            </div>

            <div className="flex">
                <div className="ml-auto mb-2">
                    {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                    {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">{"Saved"}</div>}
                </div>
            </div>

        </div>
    );
};

export default MessageCreatorEmbed;