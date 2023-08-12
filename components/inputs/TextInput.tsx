import { FunctionComponent, useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";

import { useStateDebounced } from "../../utils/useDebounce";
import DumbTextInput from "./Dumb_TextInput";

type Props = {
    name: string;
    url: string;
    dataName: string;
    disabled?: boolean;
    description?: string;
    __defaultState: string | number;
    resetState?: string | number;

    type?: string;
    max?: number;
    placeholder?: string;

    onSave?: (value: string | number) => void;
};


const TextInput: FunctionComponent<Props> = ({ name, url, dataName, disabled, description, __defaultState, resetState, type, max, placeholder, onSave }) => {
    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [valuedebounced, setValuedebounced] = useStateDebounced<string | number>("", 1000);
    const [value, setValue] = useState<string | number>("");
    const [__defaultStatealue, set__defaultStatealue] = useState<string | number>("");

    useEffect(() => {
        if (!__defaultStatealue) set__defaultStatealue(__defaultState);
        setValue(__defaultState);
    }, [__defaultState]);

    useEffect(() => {
        if (__defaultStatealue === value) return;
        setError(undefined);
        setState("LOADING");

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
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
                        set__defaultStatealue(value || 0x000000);

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
                setError("Error while updatung");
            });

    }, [valuedebounced]);

    return (
        <div className="relative w-full">

            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}

                {(resetState && resetState !== value) &&
                    <button
                        className="text-sm ml-auto text-violet-400/60 hover:text-violet-400/90 duration-200"
                        onClick={() => {
                            setValue(resetState);
                            setValuedebounced(resetState);
                            setState(undefined);
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
                    setValuedebounced(v);
                    setState(undefined);
                }}
                disabled={disabled}
                placeholder={placeholder}
                max={max}
                type={type}
                description={description}
            />

            <div className="flex absolute right-0 bottom-0">
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
            </div>

        </div>
    );
};

export default TextInput;