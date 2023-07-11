import { FunctionComponent, useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiExclamationCircle } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { widthStore } from "@/common/width";
import { RouteErrorResponse } from "@/typings";

type Props = {
    name: string;
    url: string;
    dataName: string;
    items: { name: string; value: string; error?: string }[];
    disabled?: boolean;
    description?: string;
    __defaultState?: string;

    onSave?: (options: { name: string; value: string; error?: string }) => void;
};


const SelectInput: FunctionComponent<Props> = ({ name, url, dataName, items, disabled, description, __defaultState, onSave }) => {
    const width = widthStore((w) => w);

    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<string | undefined>();
    const [value, setValue] = useState<{ name: string; value: string; error?: string } | undefined>();

    useEffect(() => {
        setValue(items.find((i) => i.value === __defaultState));
        setDefaultalue(__defaultState);
    }, [items]);

    useEffect(() => {
        setError(undefined);
        if (!value || value.error || value.value === defaultvalue) {
            setState(undefined);
            return;
        }

        setState("LOADING");
        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
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
        <div className="select-none w-full max-w-full mb-3 relative">
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={`mt-1 h-12 w-full dark:bg-wamellow bg-wamellow-100 rounded-md flex items-center px-3 ${open && "outline outline-violet-400 outline-2"} ${(value?.error || error || state === "ERRORED") && !open && "outline outline-red-500 outline-1"} ${state === "SUCCESS" && !open && "outline outline-green-500 outline-1"} ${((state === "LOADING" || disabled)) && "cursor-not-allowed opacity-50"}`}
                onClick={() => setOpen(!open)}
                disabled={(state === "LOADING" || disabled)}
            >
                <div className={value ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-600 text-neutral-400"}>
                    {value?.name || "Select.."}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {value?.error &&
                        <div className="text-sm flex items-center gap-1 text-red-500">
                            <HiExclamationCircle /> {value.error}
                        </div>
                    }
                    <HiChevronDown />
                </div>
            </button>

            {open &&
                <div className="absolute mt-2 w-full dark:bg-wamellow bg-wamellow-100 rounded-md max-h-40 overflow-y-scroll shadow-xl" style={{ zIndex: 99 }}>
                    <div className="dark:bg-wamellow-alpha bg-wamellow-100-alpha">
                        {items.map((item) => (
                            <button
                                className={`p-4 py-2 w-full ${item.error ? "dark:bg-red-500/10 hover:dark:bg-red-500/25" : "dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha"} text-left duration-200 flex items-center`}
                                key={item.name}
                                onClick={() => {
                                    setOpen(false);
                                    setState(undefined);
                                    if (value?.value) setDefaultalue(value.value);
                                    setValue(item);
                                }}
                            >
                                <div>{item.name}</div>
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

            <div className={`${width > 880 && "flex"} mt-1`}>
                {description && <div className="dark:text-neutral-500 text-neutral-400 text-sm">{description}</div>}
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">Saved</div>}
            </div>

        </div>
    );
};

export default SelectInput;