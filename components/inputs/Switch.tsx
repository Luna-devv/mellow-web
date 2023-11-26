import { FunctionComponent, useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";

type Props = {
    className?: string;

    name: string;
    url?: string;
    dataName?: string;
    disabled?: boolean;
    description?: string;
    defaultState: boolean;
    tickbox?: boolean;

    onSave?: (state: boolean) => void;
};


const Switch: FunctionComponent<Props> = ({ className, name, url, dataName, disabled, description, defaultState, onSave, tickbox }) => {
    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [value, setValue] = useState<boolean>(false);
    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        setValue(defaultState);
        setChanged(false);
    }, [defaultState]);

    useEffect(() => {

        if (!url) {
            if (!onSave) throw new Error("Warning: <Switch.onSave> must be defined when not using <Switch.url>.");
            onSave(value);
            setState(undefined);
            return;
        }

        if (!dataName) throw new Error("Warning: <Switch.dataName> must be defined when using <Switch.url>.");

        if (!changed) return;
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
                        onSave?.(value);
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
        <div className={`relative ${description && "mb-8"} ` + className}>

            <div className={`flex items-center ${!tickbox && "mb-6"}`}>
                <div className="flex items-center gap-2">
                    <span className={`sm:text-lg ${value ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-400 text-neutral-600"} font-medium`}>{name}</span>
                    {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
                </div>

                <label className={`ml-auto relative inline-flex items-center cursor-pointer ${(state === "LOADING" || disabled) && "cursor-not-allowed opacity-50"} duration-700`}>
                    <input
                        type="checkbox"
                        className={"sr-only peer"}
                        checked={value}
                        onChange={() => {
                            setState(undefined);
                            setValue(!value);
                            setChanged(true);
                        }}
                        disabled={(state === "LOADING" || disabled)}
                    />
                    {tickbox ?
                        <div className={`w-6 h-6 border ${value ? "bg-violet-500/80 border-violet-500/80" : "dark:bg-wamellow bg-wamellow-100 dark:border-wamellow-light border-wamellow-100-light"} rounded-md flex items-center justify-center`}>
                            {value && <HiCheck className="dark:text-violet-200 text-violet-800" />}
                        </div>
                        :
                        <div
                            className={`w-11 h-6 bg-neutral-300 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ease-in-out peer-checked:bg-violet-600 ${(state === "LOADING" || disabled) && "cursor-not-allowed"}`}
                        />
                    }
                </label>

            </div>

            <div className="absolute top-6">
                {description && <div className="text-neutral-500 text-sm">{description}</div>}
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
            </div>

        </div>
    );
};

export default Switch;