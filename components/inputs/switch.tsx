import { Checkbox, Switch as UiSwitch } from "@nextui-org/react";
import { FunctionComponent, useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";

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
        <div className={cn("relative", description && "mb-2", className)}>

            <div className={cn("flex items-center gap-2", !tickbox && "mb-6")}>
                <div className="flex items-center gap-2">
                    <span className={cn("sm:text-lg font-medium", value ? "dark:text-neutral-300 text-neutral-700" : "dark:text-neutral-400 text-neutral-600")}>{name}</span>
                    {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
                </div>

                {tickbox ?
                    <Checkbox
                        className="ml-auto"
                        isSelected={value}
                        onValueChange={(now) => {
                            setChanged(true);
                            setValue(now);
                        }}
                        aria-label={name}
                        color="secondary"
                        isDisabled={disabled}
                    />
                    :
                    <UiSwitch
                        className="ml-auto"
                        isSelected={value}
                        onValueChange={(now) => {
                            setChanged(true);
                            setValue(now);
                        }}
                        aria-label={name}
                        color="secondary"
                        isDisabled={disabled}
                    />
                }
            </div>


            <div className="absolute top-6 mt-0.5">
                {description && <div className="text-neutral-500 text-sm">{description}</div>}
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
            </div>

        </div>
    );
};

export default Switch;