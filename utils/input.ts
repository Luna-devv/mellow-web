import type { HTMLProps } from "react";
import { useCallback, useRef, useState } from "react";

import type { ApiError } from "@/typings";


export enum InputState {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface InputOptions<T> {
    endpoint?: string;
    k?: string;

    defaultState: T;
    transform?: (value: T) => unknown;

    onSave?: (value: T) => void;
}

export type InputProps<T> = InputOptions<T> & HTMLProps<HTMLDivElement> & {
    label: string;
    description?: string;
    disabled?: boolean;
};

export function useInput<T>(options: InputOptions<T>) {
    const [value, setValue] = useState<T>(options.defaultState);
    const [state, setState] = useState<InputState>(InputState.Idle);
    const [error, setError] = useState<string | null>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const onSave = useCallback(
        async (val: T) => {
            options.onSave?.(val);

            if (!options.endpoint || !options.k) return;

            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }

            setState(InputState.Loading);
            setError(null);

            const res = await fetch(process.env.NEXT_PUBLIC_API + options.endpoint, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(options.k.includes(".")
                    ? { [options.k.split(".")[0]]: { [options.k.split(".")[1]]: options.transform?.(val) || val } }
                    : { [options.k]: options.transform?.(val) || val }
                )
            })
                .catch((error) => String(error));

            if (typeof res === "string" || !res.ok) {
                setState(InputState.Idle);

                if (typeof res === "string") {
                    setError(res);
                } else {
                    const data = await res
                        .json()
                        .catch(() => null) as ApiError | null;

                    setError(data?.message || "Unknown error");
                }

                return;
            }

            setState(InputState.Success);
            timeout.current = setTimeout(() => setState(InputState.Idle), 1_000 * 8);
        },
        [options.onSave, options.endpoint, options.k, options.transform]
    );

    return {
        value,
        state,
        error,
        update: (val: T) => {
            setValue(val);
            onSave(val);
        }
    };
}