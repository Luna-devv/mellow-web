import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";

import { useStateDebounced } from "../../utils/useDebounce";
import DumbColorInput from "./dumb-color-input";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

type Props = {
    name: string;
    url: string;
    dataName: string;
    disabled?: boolean;
    description?: string;
    defaultState: string | number;
    resetState?: string | number;

    placeholder?: string;

    onSave?: (value: string | number) => void;
};


export default function ColorInput({
    name,
    url,
    dataName,
    disabled,
    description,
    defaultState,
    resetState,
    placeholder,
    onSave
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [valuedebounced, setValuedebounced] = useStateDebounced<string | number>("", 1000);
    const [value, setValue] = useState<string | number>("");
    const [defaultStatealue, setdefaultStatealue] = useState<string | number>("");

    useEffect(() => {
        if (!defaultStatealue) setdefaultStatealue(defaultState);
        setValue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        if (defaultStatealue === value) return;
        setError(null);
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
                        setdefaultStatealue(value || 0x000000);

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
                setError("Error while updatung");
            });

    }, [valuedebounced]);

    return (
        <div className="relative w-full">

            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}

                {(resetState && resetState !== value) &&
                    <button
                        className="text-sm ml-auto text-violet-400/60 hover:text-violet-400/90 duration-200"
                        onClick={() => {
                            setValue(resetState);
                            setValuedebounced(resetState);
                            setState(State.Idle);
                        }}
                        disabled={disabled}
                    >
                        reset
                    </button>
                }
            </div>

            <DumbColorInput
                value={value}
                setValue={(v) => {
                    setValue(v);
                    setValuedebounced(v);
                    setState(State.Idle);
                }}
                disabled={disabled}
                placeholder={placeholder}
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