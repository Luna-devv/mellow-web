import { webStore } from "@/common/webstore";
import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { Button } from "../ui/button";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props {
    className?: string;

    name: string;
    url?: string;
    dataName?: string;
    disabled?: boolean;
    description?: string;
    defaultState: number;

    min?: number;
    max?: number;

    onSave?: (state: number) => void;
}

export default function NumberInput({
    className,
    name,
    url,
    dataName,
    disabled,
    description,
    defaultState,

    min = 0,
    max = Infinity,

    onSave
}: Props) {
    const web = webStore((w) => w);

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string>();

    const [hold, setHold] = useState<"+" | "-">();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [value, setValue] = useState<number>();
    const [def, setDef] = useState<number>();

    useEffect(() => {
        if (!hold) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const start = Date.now();
        intervalRef.current = setInterval(() => {
            if (Date.now() - start < 200) return;

            switch (hold) {
                case "+":
                    setValue((prevCount) => {
                        if ((prevCount ?? 0) + 1 > max) return max;
                        return (prevCount ?? 0) + 1;
                    });
                    break;
                case "-":
                    setValue((prevCount) => {
                        if ((prevCount ?? 0) - 1 < min) return min;
                        return (prevCount ?? 0) - 1;
                    });
                    break;
            }

        }, 50);
    }, [hold]);

    useEffect(() => {
        setValue(defaultState);
        setDef(defaultState);
    }, [defaultState]);

    function handleSave() {
        if (def === value || value === undefined) return;
        setError(undefined);
        setState(State.Loading);

        if (!url) {
            if (!onSave) {
                setValue(def);
                throw new Error("Warning: <Switch.onSave> must be defined when not using <Switch.url>.");
            }

            setState(State.Idle);
            setDef(value);
            return;
        }

        if (!dataName) {
            setValue(def);
            throw new Error("Warning: <Switch.dataName> must be defined when using <Switch.url>.");
        }

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
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
                        onSave?.(value);
                        setDef(value);

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
    }

    return (
        <div className={cn("relative", className)}>
            <div className="flex items-center mb-6">
                <div>
                    <div className="flex gap-2">
                        <span className={`sm:text-lg ${value ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-400 text-neutral-600"} font-medium`}>{name}</span>
                        {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
                    </div>

                    {description &&
                        <div className={cn("w-full relative bottom-1 text-neutral-500 text-sm", web.width > 880 && "flex")}>
                            {description}
                        </div>
                    }
                </div>

                <div
                    className={cn(
                        "ml-auto relative flex items-center cursor-pointer h-8",
                        (state === State.Loading || disabled) && "opacity-50"
                    )}
                >
                    {def !== value &&
                        <Button
                            onClick={handleSave}
                            className="mr-2 h-8 rounded-xl"
                            loading={state === State.Loading}
                            disabled={disabled}
                            size="sm"
                            color="secondary"
                            variant="flat"
                        >
                            Save
                        </Button>
                    }

                    <button
                        onMouseDown={() => setHold("-")}
                        onMouseUp={() => setHold(undefined)}
                        onClick={() => {
                            if ((value ?? 0) - 1 < min) setValue(min);
                            else setValue((value ?? 0) - 1);
                        }}
                        className={cn(
                            "dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-full w-12 rounded-l-xl duration-100",
                            (state === State.Loading || disabled) ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                        disabled={state === State.Loading || disabled}
                    >
                        <HiMinus className="m-auto text-xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
                    </button>

                    <input
                        className={cn(
                            "outline-hidden text-center w-12 min-h-full dark:bg-wamellow bg-wamellow-100 font-semibold text-lg flex items-center text-neutral-500 rounded-none",
                            (state === State.Loading || disabled) ? "cursor-not-allowed" : "cursor-text"
                        )}
                        onChange={(e) => {
                            if (/^\d+$/.test(e.target.value) || !e.target.value) setValue(e.target.value ? Number.parseInt(e.target.value, 10) : undefined);
                        }}
                        value={value}
                        disabled={state === State.Loading || disabled}
                        inputMode="numeric"
                    />

                    <button
                        onMouseDown={() => setHold("+")}
                        onMouseUp={() => setHold(undefined)}
                        onClick={() => {
                            if ((value ?? 0) + 1 > max) setValue(max);
                            else setValue((value ?? 0) + 1);
                        }}
                        className={cn(
                            "dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-full w-12 rounded-r-xl duration-100",
                            (state === State.Loading || disabled) ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                        disabled={state === State.Loading || disabled}
                    >
                        <HiPlus className="m-auto text-xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
                    </button>

                    {error &&
                        <div className="ml-auto text-red-500 text-sm">
                            {error}
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}