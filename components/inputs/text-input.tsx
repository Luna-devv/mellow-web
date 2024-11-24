"use client";

import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";

import { useStateDebounced } from "../../utils/useDebounce";
import DumbTextInput from "./dumb-text-input";

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
    defaultState: string | number;
    resetState?: string | number;

    type?: string;
    max?: number;
    placeholder?: string;

    onSave?: (value: string | number) => void;
}

export default function TextInput({
    className,
    name,
    url,
    dataName,
    disabled,
    description,
    defaultState,
    resetState,
    type,
    max,
    placeholder,
    onSave
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [valuedebounced, setValueDebounced] = useStateDebounced<string | number>("", 1000);
    const [value, setValue] = useState<string | number>("");
    const [defaultStateValue, setdefaultStateValue] = useState<string | number>("");

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

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ [dataName]: value || 0x000000 })
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setValue(value || 0x000000);
                        onSave?.(value || 0x000000);
                        setdefaultStateValue(value || 0x000000);

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

            <div className="flex items-center gap-2">
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