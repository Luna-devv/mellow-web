import { Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { webStore } from "@/common/webstore";
import { ApiError } from "@/typings";
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
    disabled?: boolean;
    description?: string;
    defaultState: number;

    min?: number;
    max?: number;
};

export default function NumberInput({
    className,
    name,
    url,
    dataName,
    disabled,
    description,
    defaultState,
    min = 0,
    max = Infinity
}: Props) {
    const web = webStore((w) => w);

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string>();

    const [hold, setHold] = useState<"+" | "-">();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [value, setValue] = useState<number>();
    const [defaultStatealue, _setDefaultalue] = useState<number>();

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
        _setDefaultalue(defaultState);
    }, [defaultState]);

    function handleSave() {
        if (defaultStatealue === value) return;
        setError(undefined);
        setState(State.Loading);

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
                        setState(State.Success);
                        _setDefaultalue(value);
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
                    {defaultStatealue !== value &&
                        <Button
                            onClick={handleSave}
                            className="mr-2"
                            isLoading={state === State.Loading}
                            isDisabled={disabled}
                            size="sm"
                            color="secondary"
                            variant="flat"
                            radius="lg"
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
                            "outline-none text-center w-12 min-h-full dark:bg-wamellow bg-wamellow-100 font-semibold text-lg flex items-center text-neutral-500 rounded-none",
                            (state === State.Loading || disabled) ? "cursor-not-allowed" : "cursor-text"
                        )}
                        onChange={(e) => {
                            if (/^[0-9]+$/.test(e.target.value) || !e.target.value) setValue(e.target.value ? parseInt(e.target.value) : undefined);
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