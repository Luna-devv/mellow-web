import { FunctionComponent, useEffect, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
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
    defaultV?: string;
};


const SelectInput: FunctionComponent<Props> = ({ name, url, dataName, items, disabled, description, defaultV }) => {
    const width = widthStore((w) => w);

    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [open, setOpen] = useState<boolean>(false);
    const [defaultvalue, setDefaultalue] = useState<string | undefined>();
    const [value, setValue] = useState<{ name: string; value: string; error?: string } | undefined>();

    useEffect(() => {
        setValue(items.find((i) => i.value === defaultV));
        setDefaultalue(defaultV);
    }, [items]);

    useEffect(() => {
        setError(undefined);
        if (!value || value.error || value.value === defaultvalue) {
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
            body: JSON.stringify({ [dataName]: value.value })
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

    }, [value]);

    return (
        <div className="select-none w-full max-w-full h-12">
            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-slate-300 text-slate-700 font-medium">{name}</span>
                {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <button
                className={`mt-1 h-full w-full dark:bg-wamellow bg-wamellow-100 rounded-md flex items-center p-4 ${open && "outline outline-violet-400 outline-2"} ${(value?.error || error || state === "ERRORED") && !open && "outline outline-red-500 outline-1"} ${state === "SUCCESS" && !open && "outline outline-green-500 outline-1"} ${(disabled || state === "LOADING") && "cursor-not-allowed opacity-50"}`}
                onClick={() => setOpen(!open)}
                disabled={disabled || state === "LOADING"}
            >
                <div className={`text-neutral-${value ? "400" : "500"}`}>
                    {value?.name || "Select.."}
                </div>
                {value?.error &&
                    <div className="ml-auto text-sm flex items-center gap-1 text-red-500">
                        <HiExclamationCircle /> {value.error}
                    </div>
                }
            </button>

            {!open &&
                <div className={`${width > 880 && "flex"} mt-1`}>
                    {description && <div className="dark:text-neutral-500 text-neutral-400 text-sm">{description}</div>}
                    {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                    {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">{"Saved"}</div>}
                </div>
            }

            {open &&
                <div className="pt-2 relative">
                    <div className="absolute w-full dark:bg-wamellow bg-wamellow-100 rounded-md max-h-40 overflow-y-scroll" style={{ zIndex: 99 }}>
                        <div className="dark:bg-wamellow-alpha bg-wamellow-100-alpha">
                            {items.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                                <button
                                    className="p-4 py-2 w-full dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha text-left duration-200 flex items-center"
                                    key={item.name}
                                    onClick={() => {
                                        setOpen(false);
                                        if (value?.value) setDefaultalue(value.value);
                                        setValue(item);
                                    }}
                                >
                                    <div>{item.name}</div>
                                    {item.error &&
                                        <div className="ml-auto text-sm flex items-center gap-1 text-red-500">
                                            <HiExclamationCircle /> {item.error}
                                        </div>
                                    }
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            }

        </div>
    );
};

export default SelectInput;