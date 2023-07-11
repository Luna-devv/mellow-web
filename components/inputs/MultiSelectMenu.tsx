import { FunctionComponent, useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { widthStore } from "@/common/width";
import { RouteErrorResponse } from "@/typings";

type Props = {
    name: string;
    url: string;
    dataName: string;
    items: { name: string; value: string; error?: string; color?: number; }[];
    disabled?: boolean;
    max?: number;
    description?: string;
    defaultV?: string[];
};


const MultiSelectMenu: FunctionComponent<Props> = ({ name, url, dataName, items, disabled, max = Infinity, description, defaultV = [] }) => {
    const width = widthStore((w) => w);

    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<string[]>([]);
    const [values, setValues] = useState<{ name: string; value: string; error?: string; color?: number; }[]>([]);

    useEffect(() => {
        setValues(items.filter((i) => defaultV?.includes(i.value)));
        setDefaultalue(defaultV);
    }, [items]);

    useEffect(() => {
        setError(undefined);
        if (open || values.find((v) => !!v.error) || JSON.stringify(values.map((v) => v.value)) === JSON.stringify(defaultvalue)) {
            setState(undefined);
            return;
        }

        setState("LOADING");
        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
            },
            body: JSON.stringify({ [dataName]: values.map((v) => v.value) })
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

    }, [open]);

    return (
        <div className="select-none w-full max-w-full mb-3 relative">
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={`mt-1 min-h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-md flex items-center px-3 ${open && "outline outline-violet-400 outline-2"} ${(values.find((v) => !!v.error) || error || state === "ERRORED") && !open && "outline outline-red-500 outline-1"} ${state === "SUCCESS" && !open && "outline outline-green-500 outline-1"} ${(state === "LOADING" || disabled) && "cursor-not-allowed opacity-50"}`}
                onClick={() => {
                    setOpen(!open);
                    if (!open) setDefaultalue(values.map((v) => v.value));
                }}
                disabled={(state === "LOADING" || disabled)}
            >
                {/* style={{ scrollbarWidth: "none" }} */}
                <div className={`flex flex-wrap overflow-x-hidden gap-1 py-3 ${values.length ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-600 text-neutral-400"}`} >
                    {!values.length && <span>Select..</span>}
                    {values.map((v) => (
                        <button
                            key={v.value}
                            className={`px-2 dark:bg-wamellow-alpha bg-wamellow-100-alpha ${open && "hover:bg-danger text-neutral-100"} rounded-md flex items-center gap-1`}
                            style={v.color ? { color: `#${v.color.toString(16)}` } : {}}
                            onClick={(e) => {
                                if (!open) return;
                                e.stopPropagation();
                                setValues((_v) => {
                                    return _v.filter((i) => i.value !== v.value);
                                });
                            }}
                        >
                            <span>{v.name}</span>
                            {open && <HiX className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {values.find((v) => !!v.error) &&
                        <div className="text-sm flex items-center gap-1 text-red-500">
                            <HiExclamationCircle /> {values.find((v) => v.error)?.error}
                        </div>
                    }
                    {max !== Infinity && <span className="dark:text-neutral-600 text-neutral-400">{values.length}/{max}</span>}
                    <HiChevronDown />
                </div>
            </button>

            {open &&
                <div className="absolute mt-2 w-full dark:bg-wamellow bg-wamellow-100 rounded-md max-h-40 overflow-y-scroll shadow-xl" style={{ zIndex: 99 }}>
                    <div className="dark:bg-wamellow-alpha bg-wamellow-100-alpha">
                        {items.map((item) => (
                            <button
                                className={`p-4 py-2 w-full ${item.error ? "dark:bg-red-500/10 hover:dark:bg-red-500/25" : "dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha"} text-left duration-200 flex items-center`}
                                style={item.color ? { color: `#${item.color.toString(16)}` } : {}}
                                key={item.name}
                                onClick={() => {
                                    setState(undefined);
                                    setValues((v) => {
                                        if (v.length >= max || v.find((i) => i.value === item.value)) return v.filter((i) => i.value !== item.value);
                                        return [...v, item];
                                    });
                                }}
                            >
                                <span>{item.name}</span>
                                {values.find((v) => v.value === item.value) && <HiCheck className="ml-1" />}
                                {item.error &&
                                    <div className="ml-auto text-sm flex items-center gap-1 text-red-500">
                                        <HiExclamationCircle /> {item.error}
                                    </div>
                                }
                            </button>
                        ))}
                    </div>
                </div>
            }

            <div className={`${width > 880 && "flex"} mt-1`}>
                {description && <div className="dark:text-neutral-500 text-neutral-400 text-sm">{description}</div>}
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">Saved</div>}
            </div>

        </div>
    );
};

export default MultiSelectMenu;