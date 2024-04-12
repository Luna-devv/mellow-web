import { useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiExclamationCircle, HiX } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

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

export default function SelectMenu({
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
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<string | number | null | undefined>();
    const [value, setValue] = useState<{ icon?: React.ReactNode; name: string; value: string | number | null; error?: string } | undefined>();

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
                        setError((response as unknown as RouteErrorResponse).message);
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
                    "mt-1 h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-xl flex items-center px-3",
                    open && "outline outline-violet-400 outline-2",
                    (value?.error || error) && !open && "outline outline-red-500 outline-1",
                    state === State.Success && !open && "outline outline-green-500 outline-1",
                    (state === State.Loading || disabled) && "cursor-not-allowed opacity-50"
                )}
                onClick={() => setOpen(!open)}
                disabled={state === State.Loading || disabled}
            >
                <div
                    className={cn(
                        "flex flex-wrap overflow-x-hidden gap-1 py-3 dark:text-neutral-600 text-neutral-400",
                        value?.name && "dark:text-neutral-300 text-neutral-700"
                    )}
                >
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
                                className={cn(
                                    "p-4 py-2 w-full text-left duration-200 flex justify-between items-center dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha",
                                    item.error && "dark:bg-red-500/10 hover:dark:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40"
                                )}
                                key={item.value}
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
                </div>
            }

            <div className="mt-1 flex md:block">
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