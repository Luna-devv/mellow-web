import Link from "next/link";
import { TailSpin } from "react-loading-icons";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";

import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";

interface Props {
    link: string;
    badge: string;
    isTickbox: boolean;
}

export default function InputSwitch({
    className,

    label,
    link,
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
            <div className={cn("flex items-center justify-between gap-2", !isTickbox && "mb-6")}>
                <div className="flex items-center gap-2">
                    <span
                        className="sm:text-lg font-medium text-neutral-100"
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
                        className={description && "relative top-1"}
                        checked={value}
                        onCheckedChange={update}
                        disabled={disabled}
                    />
                    :
                    <Switch
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
                        {description} {link && <Link href={link} target="_blank" className="text-violet-400 hover:underline">Learn more</Link>}
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