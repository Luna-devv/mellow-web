import { FunctionComponent, useEffect, useRef, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { webStore } from "@/common/webstore";
import { RouteErrorResponse } from "@/typings";


type Props = {
    name: string;
    url: string;
    dataName: string;
    disabled?: boolean;
    description?: string;
    defaultState: number;

    min?: number;
};


const NumberInput: FunctionComponent<Props> = ({ name, url, dataName, disabled, description, defaultState, min = 0 }) => {
    const web = webStore((w) => w);

    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [hold, setHold] = useState<"+" | "-">();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [value, setValue] = useState<number>();
    const [__defaultStatealue, setDefaultalue] = useState<number>();

    useEffect(() => {
        if (!hold) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const start = Date.now();
        intervalRef.current = setInterval(() => {
            if (Date.now() - start < 200) return;
            if (hold === "+") setValue((prevCount) => (prevCount ?? 0) + 1);
            else setValue((prevCount) => {
                if ((prevCount ?? 0) - 1 < min) return min;
                return (prevCount ?? 0) - 1;
            });
        }, 50);
    }, [hold]);

    useEffect(() => {
        setValue(defaultState);
        setDefaultalue(defaultState);
    }, [defaultState]);

    function handleSave() {
        if (__defaultStatealue === value) return;
        setError(undefined);
        setState("LOADING");

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
            },
            body: JSON.stringify(dataName.includes(".") ?
                { [dataName.split(".")[0]]: { [dataName.split(".")[1]]: value } }
                :
                { [dataName]: value }
            )
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setState("SUCCESS");
                        setDefaultalue(value);
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
    }

    return (
        <div className="relative">
            <div className="flex items-center mb-6">
                <div>
                    <div className="flex gap-2">
                        <span className={`sm:text-lg ${value ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-400 text-neutral-600"} font-medium`}>{name}</span>
                        {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
                    </div>

                    {description && <div className={`${web.width > 880 && "flex"} w-full relative bottom-1 text-neutral-500 text-sm`}> {description} </div>}
                </div>

                <div className={`ml-auto relative flex items-center cursor-pointer h-8 ${(disabled || (state === "LOADING" || disabled)) && "opacity-50"}`}>

                    {__defaultStatealue !== value &&
                        <button
                            onClick={handleSave}
                            className={`bg-violet-600 hover:bg-violet-600/80 duration-200 h-full w-12 rounded-md mr-2 ${(state === "LOADING" || disabled) ? "cursor-not-allowed" : "cursor-pointer"}`}
                            disabled={(state === "LOADING" || disabled)}
                        >
                            <span className="m-auto text-neutral-200 text-sm">Save</span>
                        </button>
                    }

                    <button
                        onMouseDown={() => setHold("-")}
                        onMouseUp={() => setHold(undefined)}
                        onClick={() => {
                            if ((value ?? 0) - 1 < min) setValue(min);
                            else setValue((value ?? 0) - 1);
                        }}
                        className={`dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-full w-12 rounded-l-md duration-100 ${(state === "LOADING" || disabled) ? "cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={(state === "LOADING" || disabled)}
                    >
                        <HiMinus className="m-auto text-2xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
                    </button>

                    <input
                        className={`outline-none text-center w-12 min-h-full dark:bg-wamellow bg-wamellow-100 font-semibold text-md flex items-center text-neutral-500 rounded-none ${(state === "LOADING" || disabled) ? "cursor-not-allowed" : "cursor-text"}`}
                        onChange={(e) => {
                            if (/^[0-9]+$/.test(e.target.value) || !e.target.value) setValue(e.target.value ? parseInt(e.target.value) : undefined);
                        }}
                        value={value}
                        disabled={(state === "LOADING" || disabled)}
                        inputMode="numeric"
                    />

                    <button
                        onMouseDown={() => setHold("+")}
                        onMouseUp={() => setHold(undefined)}
                        onClick={() => setValue((value ?? 0) + 1)}
                        className={`dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-full w-12 rounded-r-md duration-100 ${(state === "LOADING" || disabled) ? "cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={(state === "LOADING" || disabled)}
                    >
                        <HiPlus className="m-auto text-2xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
                    </button>

                    <div className="absolute top-8 right-0">
                        {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                        {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">Saved</div>}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default NumberInput;