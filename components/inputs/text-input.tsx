"use client";

import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import DumbTextInput from "./dumb-text-input";
import { useStateDebounced } from "../../utils/useDebounce";

type Type<T extends "text" | "color"> = T extends "text" ? string : number;

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props<T extends "text" | "color"> {
    className?: string;

    name?: string;
    url?: string;
    dataName?: string;
    disabled?: boolean;
    description?: string;
    defaultState: Type<T>;
    resetState?: Type<T>;

    type?: T;
    max?: number;
    placeholder?: string;

    onSave?: (value: Type<T> | null) => void;
}

export default function TextInput<T extends "text" | "color" = "text">({
    className,
    name,
    url,
    dataName,
    disabled,
    description,
    defaultState,
    resetState,
    type = "text" as T,
    max,
    placeholder,
    onSave
}: Props<T>) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [valuedebounced, setValueDebounced] = useStateDebounced<T extends "text" ? string : number>((type === "text" ? "" : 0) as Type<T>, 1_000);
    const [value, setValue] = useState<T extends "text" ? string : number>((type === "text" ? "" : 0) as Type<T>);
    const [defaultStateValue, setdefaultStateValue] = useState<T extends "text" ? string : number>((type === "text" ? "" : 0) as Type<T>);

    useEffect(() => {
        if (!defaultStateValue) setdefaultStateValue(defaultState);
        setValue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        if (defaultStateValue === value) return;
        setError(null);

        if (!url) {
            if (!onSave) throw new Error("Warning: <TextInput.onSave> must be defined when not using <TextInput.url>.");

            onSave(value);
            setState(State.Idle);
            return;
        }

        if (!dataName) throw new Error("Warning: <TextInput.dataName> must be defined when using <TextInput.url>.");

        setState(State.Loading);

        const def = type === "color"
            ? 0
            : null;

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ [dataName]: value || def })
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setValue(value || def || (type === "text" ? "" : 0) as Type<T>);
                        onSave?.(value || def || (type === "text" ? "" : 0) as Type<T>);
                        setdefaultStateValue(value || def || (type === "text" ? "" : 0) as Type<T>);

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
                setError("Error while updatung");
            });

    }, [valuedebounced]);

    return (
        <div className={cn("relative w-full", className)}>

            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}

                {(resetState && resetState !== value) &&
                    <button
                        className="text-sm ml-auto text-violet-400/60 hover:text-violet-400/90 duration-200"
                        onClick={() => {
                            setValue(resetState);
                            setValueDebounced(resetState);
                            setState(State.Idle);
                        }}
                        disabled={disabled}
                    >
                        reset
                    </button>
                }
            </div>

            <DumbTextInput
                value={value}
                setValue={(v) => {
                    setValue(v);
                    setValueDebounced(v);
                    setState(State.Idle);
                }}
                disabled={disabled}
                placeholder={placeholder}
                max={max}
                type={type}
                description={description}
            />

            <div className="flex absolute right-0 bottom-0">
                {error &&
                    <div className="ml-auto text-red-500 text-sm">
                        {error}
                    </div>
                }
            </div>

        </div>
    );
}