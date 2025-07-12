import { TailSpin } from "react-loading-icons";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";

import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";

interface Props {
    badge: string;
    isTickbox: boolean;
}

export default function InputSwitch({
    className,

    label,
    badge,
    description,
    isTickbox,
    disabled,

    endpoint,
    k,

    defaultState,
    transform,

    onSave
}: InputProps<boolean> & Partial<Props>) {
    const {
        value,
        state,
        error,
        update
    } = useInput({
        endpoint,
        k,

        defaultState,
        transform,

        onSave
    });

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
                        {label}
                    </span>

                    {badge &&
                        <Badge
                            variant="flat"
                            size="sm"
                        >
                            {badge}
                        </Badge>
                    }

                    {state === InputState.Loading &&
                        <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />
                    }
                </div>

                {isTickbox ?
                    <Checkbox
                        className="ml-auto"
                        checked={value}
                        onCheckedChange={update}
                        disabled={disabled}
                    />
                    :
                    <Switch
                        className="ml-auto"
                        checked={value}
                        onCheckedChange={update}
                        aria-label={label}
                        disabled={disabled}
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