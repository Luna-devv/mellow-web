import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { ClickOutside } from "../click-outside";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Item<T extends string | number> {
    icon?: React.ReactNode;
    name: string;
    value: T;
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
    max?: number;
    description?: string;
    defaultState?: T[];

    onSave?: (options: { name: string; value: T; error?: string; }[]) => void;
}

export default function MultiSelectMenu<T extends string | number>({
    className,
    name,
    url,
    dataName,
    items = [],
    disabled,
    max = Infinity,
    description,
    defaultState,
    onSave
}: Props<T>) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<T[]>([]);
    const [values, setValues] = useState<Item<T>[]>([]);

    useEffect(() => {
        if (!defaultState) return;

        setValues(items.filter((i) => defaultState?.includes(i.value)));
        setDefaultalue(defaultState);
    }, [defaultState, items]);

    useEffect(() => {
        if (values.some((v) => Boolean(v.error)) || JSON.stringify(values.map((v) => v.value)) === JSON.stringify(defaultvalue)) {
            setState(State.Idle);
            return;
        }

        setError(null);

        if (!url) {
            if (!onSave) throw new Error("Warning: <MultiSelectMenu.onSave> must be defined when not using <MultiSelectMenu.url>.");
            onSave(values);
            setState(State.Idle);
            return;
        }

        if (!dataName) throw new Error("Warning: <MultiSelectMenu.dataName> must be defined when using <MultiSelectMenu.url>.");

        setState(State.Loading);

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataName.includes(".") ?
                { [dataName.split(".")[0]]: { [dataName.split(".")[1]]: values.map((v) => v.value) } }
                :
                { [dataName]: values.map((v) => v.value) }
            )
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        onSave?.(values);
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

    }, [open]);

    return (
        <div className={cn("select-none w-full max-w-full mb-3 relative", className)}>
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={cn(
                    "mt-1 min-h-12 w-full bg-wamellow rounded-lg flex items-center px-3 duration-100 wamellow-modal",
                    open && "outline-solid outline-violet-400 outline-2",
                    (values.some((v) => Boolean(v.error)) || error) && !open && "outline-solid outline-red-500 outline-1",
                    state === State.Success && !open && "outline-solid outline-green-500 outline-1",
                    (state === State.Loading || disabled) && "cursor-not-allowed opacity-50"
                )}
                onClick={() => {
                    setOpen(!open);
                    if (!open) setDefaultalue(values.map((v) => v.value));
                }}
                disabled={state === State.Loading || disabled}
            >
                <div
                    className={cn(
                        "flex flex-wrap overflow-x-hidden gap-1 py-3 dark:text-neutral-600 text-neutral-400",
                        values.length && "dark:text-neutral-300 text-neutral-700"
                    )}
                >
                    {!values.length && <span>Select..</span>}
                    {values.map((v) => (
                        <button
                            key={"multiselected-" + v.value}
                            className={cn(
                                "relative px-2 bg-wamellow rounded-md flex items-center gap-1 wamellow-modal",
                                open && "hover:bg-red-500/50! text-neutral-100 duration-200"
                            )}
                            onClick={(e) => {
                                if (!open) return;
                                e.stopPropagation();
                                setValues((_v) => {
                                    return _v.filter((i) => i.value !== v.value);
                                });
                            }}
                        >
                            {v.icon && <span>{v.icon}</span>}
                            <span>{v.name}</span>
                            {open && <HiX className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {values.some((v) => Boolean(v.error)) &&
                        <div className="text-sm flex items-center gap-1 text-red-500">
                            <HiExclamationCircle /> {values.find((v) => v.error)?.error}
                        </div>
                    }
                    {max !== Infinity &&
                        <span className="dark:text-neutral-600 text-neutral-400">
                            {values.length}/{max}
                        </span>
                    }
                    <HiChevronDown />
                </div>
            </button>

            {open &&
                <div className="absolute mt-2 w-full bg-wamellow backdrop-blur-lg backdrop-brightness-50 rounded-lg max-h-40 overflow-y-scroll shadow-lg z-20 wamellow-modal">
                    <ClickOutside onClose={(() => setOpen(false))} />
                    {items.map((item) => (
                        <button
                            className={cn(
                                "p-4 py-2 w-full text-left duration-200 flex items-center hover:bg-wamellow",
                                item.error && "dark:bg-red-500/10 dark:hover:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40"
                            )}
                            style={item.color ? { color: `#${item.color.toString(16)}` } : {}}
                            key={"multiselect-" + item.value}
                            onClick={() => {
                                setState(State.Idle);
                                setValues((v) => {
                                    if (v.length >= max || v.some((i) => i.value === item.value)) return v.filter((i) => i.value !== item.value);
                                    return [...v, item];
                                });
                            }}
                        >
                            {item?.icon &&
                                <span className="mr-2">
                                    {item?.icon}
                                </span>
                            }

                            <span className="max-w-[calc(100%-1rem)] truncate">
                                {item.name}
                            </span>

                            {values.find((v) => v.value === item.value) &&
                                <HiCheck className="relative left-1 top-px" />
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