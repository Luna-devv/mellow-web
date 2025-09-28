import { useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";

import { ClickOutside } from "../click-outside";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Item<T extends string | number> {
    icon?: React.ReactNode;
    name: string;
    value: T | null;
    error?: string;
    color?: number;
}

interface Props<T extends string | number> {
    className?: string;

    name: string;
    url?: string;
    dataName?: string;
    items: Item<T>[];
    disabled?: boolean;
    description?: string;
    defaultState?: T | null;
    showClear?: boolean;

    onSave?: (options: { name: string; value: T | null; error?: string; }) => void;
}

export default function SelectMenu<T extends string | number>({
    className,
    name,
    url,
    dataName,
    items = [],
    disabled,
    description,
    defaultState,
    showClear,
    onSave
}: Props<T>) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<T | null | undefined>();
    const [value, setValue] = useState<Item<T> | undefined>();

    useEffect(() => {
        setValue(items.find((i) => i.value === defaultState));
        setDefaultalue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        setError(null);

        if (!value || value.error || value.value === defaultvalue) {
            setState(State.Idle);
            return;
        }

        if (!url) {
            if (!onSave) throw new Error("Warning: <SelectInput.onSave> must be defined when not using <SelectInput.url>.");
            onSave(value);
            setState(State.Idle);
            return;
        }

        if (!dataName) throw new Error("Warning: <SelectInput.dataName> must be defined when using <SelectInput.url>.");

        setState(State.Loading);

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
                        setState(State.Success);
                        setTimeout(() => setState(State.Idle), 1_000 * 8);
                        break;
                    }
                    default: {
                        setState(State.Idle);
                        setError((response as unknown as ApiError).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setState(State.Idle);
                setError("Error while updating");
            });

    }, [value]);

    return (
        <div className={cn("select-none w-full max-w-full mb-2 relative", className)}>
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={cn(
                    "mt-1 h-12 w-full bg-wamellow rounded-lg flex items-center px-3 wamellow-modal",
                    open && "outline outline-violet-400 outline-offset-2 outline-2",
                    (value?.error || error) && !open && "outline outline-red-500 outline-1",
                    state === State.Success && !open && "outline outline-green-500 outline-1",
                    (state === State.Loading || disabled) && "cursor-not-allowed opacity-50"
                )}
                onClick={() => setOpen(!open)}
                disabled={state === State.Loading || disabled}
            >
                <div
                    className={cn(
                        "flex items-center flex-wrap overflow-x-hidden py-3 gap-2 dark:text-neutral-600 text-neutral-400",
                        value?.name && "dark:text-neutral-300 text-neutral-700"
                    )}
                    style={value?.color ? { color: `#${value.color.toString(16)}` } : {}}
                >
                    {value?.icon && <span>{value?.icon}</span>}
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
                <div className="absolute mt-2 w-full bg-wamellow backdrop-blur-lg backdrop-brightness-50 rounded-lg max-h-40 overflow-y-scroll shadow-lg z-20 wamellow-modal">
                    <ClickOutside onClose={(() => setOpen(false))} />
                    {items.map((item) => (
                        <button
                            key={"select-" + item.value}
                            className={cn(
                                "p-4 py-2 w-full text-left duration-200 flex items-center hover:bg-wamellow",
                                item.error && "dark:bg-red-500/10 hover:dark:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40"
                            )}
                            style={item.color ? { color: `#${item.color.toString(16)}` } : {}}
                            onClick={() => {
                                setOpen(false);
                                setState(State.Idle);
                                if (value?.value) setDefaultalue(value.value);
                                setValue(item);
                            }}
                        >
                            {item?.icon &&
                                <span className="mr-2">
                                    {item?.icon}
                                </span>
                            }

                            <span className={cn("truncate", item.error && "max-w-[calc(100%-13rem)]")}>
                                {item.name}
                            </span>

                            {value?.value === item.value &&
                                <HiCheck className="ml-1" />
                            }

                            {item.error &&
                                <div className="ml-auto text-sm flex items-center gap-1 text-red-500">
                                    <HiExclamationCircle /> {item.error}
                                </div>
                            }
                        </button>
                    ))}
                </div>
            }

            <div className={cn("mt-1 flex md:block", open && "opacity-0")}>
                {description &&
                    <div className="dark:text-neutral-500 text-neutral-400 text-sm">
                        {description}
                    </div>
                }

                {error &&
                    <div className="ml-auto text-red-500 text-sm">
                        {error}
                    </div>
                }
            </div>

        </div>
    );
}