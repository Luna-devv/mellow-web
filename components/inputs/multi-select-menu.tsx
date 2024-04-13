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
    url: string;
    dataName: string;
    items: { icon?: React.ReactNode; name: string; value: string; error?: string; color?: number; }[] | undefined;
    disabled?: boolean;
    max?: number;
    description?: string;
    defaultState?: string[];
};


export default function MultiSelectMenu({
    className,
    name,
    url,
    dataName,
    items = [],
    disabled,
    max = Infinity,
    description,
    defaultState = []
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<string[]>([]);
    const [values, setValues] = useState<{ icon?: React.ReactNode; name: string; value: string; error?: string; color?: number; }[]>([]);

    useEffect(() => {
        setValues(items.filter((i) => defaultState?.includes(i.value)));
        setDefaultalue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        setError(null);

        if (values.find((v) => !!v.error) || JSON.stringify(values.map((v) => v.value)) === JSON.stringify(defaultvalue)) {
            setState(State.Idle);
            return;
        }

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

    }, [open]);

    return (
        <div className={cn("select-none w-full max-w-full mb-3 relative", className)}>
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={cn(
                    "mt-1 min-h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-xl flex items-center px-3 duration-100",
                    open && "outline outline-violet-400 outline-2",
                    (values.find((v) => !!v.error) || error) && !open && "outline outline-red-500 outline-1",
                    state === State.Success && !open && "outline outline-green-500 outline-1",
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
                            key={v.value}
                            className={cn("relative px-2 dark:bg-wamellow-alpha bg-wamellow-100-alpha rounded-md flex items-center gap-1", open && "hover:bg-danger text-neutral-100")}
                            style={v.color ? { color: `#${v.color.toString(16)}` } : {}}
                            onClick={(e) => {
                                if (!open) return;
                                e.stopPropagation();
                                setValues((_v) => {
                                    return _v.filter((i) => i.value !== v.value);
                                });
                            }}
                        >
                            {v.icon && <span className="absolute left-0">{v.icon}</span>}
                            <span className={cn(v.icon ? "ml-6" : "")}>{v.name}</span>
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
                    {max !== Infinity &&
                        <span className="dark:text-neutral-600 text-neutral-400">
                            {values.length}/{max}
                        </span>
                    }
                    <HiChevronDown />
                </div>
            </button>

            {open &&
                <div className="absolute mt-2 w-full dark:bg-wamellow bg-wamellow-100 backdrop-blur-xl backdrop-brightness-75 rounded-lg max-h-40 overflow-y-scroll shadow-xl z-20">
                    <div className="dark:bg-wamellow-alpha bg-wamellow-100-alpha">
                        {items.map((item, i) => (
                            <button
                                className={cn(
                                    "p-4 py-2 w-full text-left duration-200 flex justify-between items-center dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha",
                                    item.error && "dark:bg-red-500/10 hover:dark:bg-red-500/25 bg-red-500/30 hover:bg-red-500/40"
                                )}
                                style={item.color ? { color: `#${item.color.toString(16)}` } : {}}
                                key={"multiselect-" + item.value + i}
                                onClick={() => {
                                    setState(State.Idle);
                                    setValues((v) => {
                                        if (v.length >= max || v.find((i) => i.value === item.value)) return v.filter((i) => i.value !== item.value);
                                        return [...v, item];
                                    });
                                }}
                            >
                                {item?.icon &&
                                    <span className="mr-2">
                                        {item?.icon}
                                    </span>
                                }

                                <span className="max-w-[calc(100%-13rem)] truncate">
                                    {item.name}
                                </span>

                                {values.find((v) => v.value === item.value) &&
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