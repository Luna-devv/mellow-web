import React, { FunctionComponent, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

import { GuildEmbed, RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";

import Highlight from "./discord/markdown";
import DiscordMessage from "./discord/message";
import DiscordMessageEmbed from "./discord/message-embed";
import DumbColorInput from "./inputs/Dumb_ColorInput";
import DumbTextInput from "./inputs/Dumb_TextInput";

interface Props {
    children?: React.ReactNode

    name: string;
    url: string;
    dataName: string;

    defaultMessage?: { content?: string | null, embed?: GuildEmbed };
    isCollapseable?: boolean;

    messageAttachmentComponent?: React.ReactNode;
    showMessageAttachmentComponentInEmbed?: boolean;

    disabled?: boolean;
    onSave?: (state: { content?: string | null, embed?: GuildEmbed }) => void;
}

const MessageCreatorEmbed: FunctionComponent<Props> = ({
    children,
    name,
    url,
    dataName,
    defaultMessage,
    isCollapseable,
    messageAttachmentComponent,
    showMessageAttachmentComponentInEmbed,
    disabled,
    onSave
}) => {
    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [content, setContent] = useState<string>(defaultMessage?.content || "");
    const [embed, setEmbed] = useState<string>(JSON.stringify(defaultMessage?.embed || {}));
    const [embedfooter, setEmbedfooter] = useState<string>(JSON.stringify(defaultMessage?.embed?.footer || {}));

    const [open, setOpen] = useState<boolean>(!isCollapseable);
    const [mode, setMode] = useState<"DARK" | "LIGHT">("DARK");

    const modeToggle = (
        <div className={cn(mode === "DARK" ? "bg-wamellow-light" : "bg-wamellow-100-light", "flex gap-1 text-neutral-400 rounded-md overflow-hidden")}>
            <button onClick={() => setMode("DARK")} className={`py-2 px-3 rounded-md ${mode === "DARK" ? "bg-wamellow" : "hover:bg-wamellow-100-alpha"}`}>
                <BiMoon className="h-5 w-5" />
            </button>
            <button onClick={() => setMode("LIGHT")} className={`py-2 px-3 rounded-md ${mode === "LIGHT" ? "bg-wamellow-100" : "hover:bg-wamellow-alpha"}`}>
                <BiSun className="h-5 w-5" />
            </button>
        </div>
    );

    const saveHook = () => {
        setError(undefined);
        setState("LOADING");

        const body = { content, embed: Object.assign(JSON.parse(embed), embedfooter.length > 2 ? { footer: JSON.parse(embedfooter) } : {}) };

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataName.includes(".") ?
                { [dataName.split(".")[0]]: { [dataName.split(".")[1]]: body } }
                :
                { [dataName]: body }
            )
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setState("SUCCESS");
                        onSave?.(body);
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
                setError("Error while updating");
            });

    };

    return (
        <div>
            <div className={cn("mt-8 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl md:px-4 md:pb-4 px-2 py-2", (error || state === "ERRORED") && "outline outline-red-500 outline-1")}>
                <div className="text-lg py-2 dark:text-neutral-700 text-neutral-300 font-medium px-2">{name}</div>

                {isCollapseable &&
                    <div className={cn("md:mx-2 mx-1", open ? "lg:mb-0 mb-2" : "mb-2")}>
                        <button
                            className="dark:bg-wamellow hover:dark:bg-wamellow-light bg-wamellow-100 hover:bg-wamellow-100-light duration-200 cursor-pointer rounded-md dark:text-neutral-400 text-neutral-600 flex items-center h-12 px-3 w-full"
                            onClick={() => setOpen(!open)}
                        >
                            {open ?
                                <>
                                    <span>Collaps</span>
                                    <HiChevronUp className="ml-auto h-4 w-4" />
                                </>
                                :
                                <>
                                    <span>Expand</span>
                                    <HiChevronDown className="ml-auto h-4 w-4" />
                                </>
                            }
                        </button>
                    </div>
                }

                {open &&
                    <div className="md:m-1 relative">

                        {children &&
                            <div className={`mx-1 ${isCollapseable && "mt-6"}`}>
                                {children}
                            </div>
                        }

                        <div className="lg:flex gap-1">

                            <div className="lg:w-3/6 m-1">

                                <DumbTextInput placeholder="Content" value={content} setValue={setContent} max={2000} disabled={disabled} />
                                <DumbTextInput placeholder="Embed Title" value={embed} setValue={setEmbed} max={256} dataName="title" disabled={disabled} />
                                <DumbTextInput placeholder="Embed Description" value={embed} setValue={setEmbed} max={4096} dataName="description" disabled={disabled} />
                                <div className="flex gap-2">
                                    <DumbColorInput placeholder="Embed Color" value={embed} setValue={setEmbed} dataName="color" disabled={disabled} />
                                    <DumbTextInput placeholder="Embed Thumbnail" value={embed} setValue={setEmbed} max={256} dataName="thumbnail" disabled={disabled} />
                                </div>
                                <DumbTextInput placeholder="Embed Image" value={embed} setValue={setEmbed} max={256} dataName="image" disabled={disabled} />
                                <div className="flex gap-2">
                                    <DumbTextInput placeholder="Embed Footer Icon" value={embedfooter} setValue={setEmbedfooter} max={256} dataName="icon_url" disabled={disabled} />
                                    <DumbTextInput placeholder="Embed Footer" value={embedfooter} setValue={setEmbedfooter} max={256} dataName="text" disabled={disabled} />
                                </div>

                                <button
                                    className={`flex justify-center items-center bg-violet-600 hover:bg-violet-500 text-white py-2 px-4 rounded-md duration-200 mt-1 h-12 w-full  ${disabled && "cursor-not-allowed opacity-50"}`}
                                    onClick={saveHook}
                                    disabled={disabled}
                                >
                                    Update
                                </button>

                            </div>

                            <div className="md:hidden flex m-2 mt-4">

                                <div className="flex items-center w-full">
                                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">Color Theme</span>

                                    <div className="ml-auto flex items-center">
                                        {modeToggle}
                                    </div>
                                </div>

                            </div>

                            <div className="relative lg:w-3/6 lg:mt-2 m-1 md:mt-8 mt-4 min-h-full rounded-md p-4 break-all overflow-hidden max-w-full text-neutral-200" style={{ backgroundColor: mode === "DARK" ? "rgb(43, 45, 49)" : "rgb(255, 255, 255)" }}>

                                <div className="absolute z-10 top-2 right-2 hidden md:block">
                                    {modeToggle}
                                </div>

                                <DiscordMessage
                                    mode={mode}
                                    user={{
                                        username: "Wamellow",
                                        avatar: "/waya-v3-small.webp",
                                        bot: true
                                    }}
                                >
                                    <Highlight
                                        mode={mode}
                                        text={content || ""}
                                    />

                                    <DiscordMessageEmbed
                                        mode={mode}
                                        title={JSON.parse(embed).title}
                                        color={JSON.parse(embed).color}
                                        thumbnail={JSON.parse(embed).thumbnail}
                                        image={JSON.parse(embed).image}
                                        footer={JSON.parse(embedfooter)}
                                    >
                                        {JSON.parse(embed).description && <Highlight mode={mode} text={JSON.parse(embed).description} />}
                                        {showMessageAttachmentComponentInEmbed && messageAttachmentComponent}
                                    </DiscordMessageEmbed>

                                    {!showMessageAttachmentComponentInEmbed && messageAttachmentComponent}

                                </DiscordMessage>

                            </div>

                        </div>
                        <div className="text-sm m-1 text-neutral-500">
                            The preview might display things wrong*
                        </div>

                    </div>}

            </div>

            <div className="flex relative bottom-3">
                <div className="ml-auto mb-2">
                    {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                    {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">Saved</div>}
                </div>
            </div>

        </div>
    );
};

export default MessageCreatorEmbed;