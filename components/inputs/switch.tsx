import { Checkbox, Chip, Switch as UiSwitch } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props {
    className?: string;

    name: string;
    badge?: string;
    disabled?: boolean;
    description?: string;
    isTickbox?: boolean;

    url?: string;
    dataName?: string;
    defaultState: boolean;

    onSave?: (state: boolean) => void;
}

export default function Switch({
    className,

    name,
    badge,
    description,
    disabled,
    isTickbox = false,

    url,
    dataName,
    defaultState,

    onSave
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

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
            setState(State.Idle);
            return;
        }

        if (!dataName) throw new Error("Warning: <Switch.dataName> must be defined when using <Switch.url>.");

        if (!changed) return;
        setError(null);

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
                        onSave?.(value);
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
                setError("Error while saving");
            });

    }, [value]);

    return (
        <div className={cn("relative", description && "mb-2", className)}>

            <div className={cn("flex items-center gap-2", !isTickbox && "mb-6")}>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "sm:text-lg font-medium dark:text-neutral-400 text-neutral-600",
                            value && "dark:text-neutral-300 text-neutral-700"
                        )}
                    >
                        {name}
                    </span>

                    {badge &&
                        <Chip
                            variant="flat"
                            color="secondary"
                            size="sm"
                        >
                            {badge}
                        </Chip>
                    }

                    {state === State.Loading && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
                </div>

                {isTickbox ?
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
                {description &&
                    <div className="text-neutral-500 text-sm">
                        {description}
                    </div>
                }

                {error &&
                    <div className="ml-auto text-red-500 text-sm">
                        {error}
                    </div>
                }
            </div>

        </div>
    );
}