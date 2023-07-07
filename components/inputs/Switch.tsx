import { FunctionComponent, useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";

type Props = {
    name: string;
    url: string;
    dataName: string;
    disabled?: boolean;
    description?: string;
    defaultState: boolean;
};


const Switch: FunctionComponent<Props> = ({ name, url, dataName, disabled, description, defaultState }) => {
    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [value, setValue] = useState<boolean>(false);
    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        setValue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        if (!changed) return;
        setError(undefined);
        setState("LOADING");

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
            },
            body: JSON.stringify({ [dataName]: value })
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
        <div className="relative">

            <div className="flex items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                    {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
                </div>

                <label className={`ml-auto relative inline-flex items-center cursor-pointer ${(disabled || state === "LOADING") && "cursor-not-allowed opacity-50"}`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={value}
                        onChange={() => {
                            setState(undefined);
                            setValue(!value);
                            setChanged(true);
                        }}
                        disabled={disabled}
                    />
                    <div className="w-11 h-6 bg-neutral-300 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>

            </div>

            <div className="absolute top-6">
                {description && <div className="text-neutral-500 text-sm">{description}</div>}
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
                {state === "SUCCESS" && <div className="ml-auto text-green-500 text-sm">{"Saved"}</div>}
            </div>

        </div>
    );
};

export default Switch;