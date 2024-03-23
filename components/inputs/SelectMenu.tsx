import { FunctionComponent, useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { webStore } from "@/common/webstore";
import { RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";
import { truncate } from "@/utils/truncate";

type Props = {
    className?: string;

    name: string;
    url?: string;
    dataName?: string;
    items: { icon?: React.ReactNode; name: string; value: string | number | null; error?: string }[] | undefined;
    disabled?: boolean;
    description?: string;
    defaultState?: string | number | null;
    showClear?: boolean;

    onSave?: (options: { name: string; value: string | number | null; error?: string }) => void;
};


const SelectInput: FunctionComponent<Props> = ({ className, name, url, dataName, items = [], disabled, description, defaultState, showClear, onSave }) => {
    const web = webStore((w) => w);

    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [open, setOpen] = useState<boolean>(false);
    const [_defaultvalue, _setDefaultalue] = useState<string | number | null | undefined>();
    const [value, setValue] = useState<{ icon?: React.ReactNode; name: string; value: string | number | null; error?: string } | undefined>();

    useEffect(() => {
        setValue(items.find((i) => i.value === defaultState));
        _setDefaultalue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        setError(undefined);

        if (!value || value.error || value.value === _defaultvalue) {
            setState(undefined);
            return;
        }

        if (!url) {
            if (!onSave) throw new Error("Warning: <SelectInput.onSave> must be defined when not using <SelectInput.url>.");
            onSave(value);
            setState(undefined);
            return;
        }

        if (!dataName) throw new Error("Warning: <SelectInput.dataName> must be defined when using <SelectInput.url>.");

        setState("LOADING");
        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataName.includes(".") ?
                { [dataName.split(".")[0]]: { [dataName.split(".")[1]]: value.value } }
                :
                { [dataName]: value.value }
            )
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        onSave?.(value);
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

    }, [value]);

    return (
        <div className={cn("select-none w-full max-w-full mb-2 relative", className)}>
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={`mt-1 h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-md flex items-center px-3 ${open && "outline outline-violet-400 outline-2"} ${(value?.error || error || state === "ERRORED") && !open && "outline outline-red-500 outline-1"} ${state === "SUCCESS" && !open && "outline outline-green-500 outline-1"} ${((state === "LOADING" || disabled)) && "cursor-not-allowed opacity-50"}`}
                onClick={() => setOpen(!open)}
                disabled={(state === "LOADING" || disabled)}
            >
                <div className={`${value?.name ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-600 text-neutral-400"} flex items-center`}>
                    {value?.icon && <span className="mr-2">{value?.icon}</span>}
                    {value?.name || "Select.."}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {value?.error &&
                        <div className="text-sm flex items-center gap-1 text-red-500">
                            <HiExclamationCircle /> {value.error}
                        </div>
                    }
                    {value?.name && showClear &&
                        <button
                            onClick={() => {
                                setOpen(false);
                                setValue({ value: null, name: "" });
                            }}
                        >
                            <HiX />
                        </button>
                    }
                    <HiChevronDown />
                </div>
            </button>

            {open &&
                <div className="absolute mt-2 w-full dark:bg-wamellow bg-wamellow-100 backdrop-blur-md backdrop-brightness-75 rounded-lg max-h-40 overflow-y-scroll overflow-x-hidden shadow-xl z-20">
                    <div className="dark:bg-wamellow-alpha bg-wamellow-100-alpha">
                        {items.map((item) => (
                            <button
                                className={`p-4 py-2 w-full ${item.error ? "dark:bg-red-500/10 hover:dark:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40" : "dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha"} text-left duration-200 flex items-center`}
                                key={item.value}
                                onClick={() => {
                                    setOpen(false);
                                    setState(undefined);
                                    if (value?.value) _setDefaultalue(value.value);
                                    setValue(item);
                                }}
                            >
                                {item?.icon && <span className="mr-2">{item?.icon}</span>}
                                <span>{truncate(item.name, item.error ? 30 : 48)}</span>
                                {value?.value === item.value && <HiCheck className="ml-1" />}
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

            <div className={`${web.width > 880 && "flex"} mt-1`}>
                {description && <div className="dark:text-neutral-500 text-neutral-400 text-sm">{description}</div>}
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
            </div>

        </div>
    );
};

export default SelectInput;