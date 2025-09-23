import React, { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

interface Props {
    name?: string;
    placeholder?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any; setValue: React.Dispatch<React.SetStateAction<any>>;

    disabled?: boolean;
    description?: string;
    max?: number;
    thin?: boolean;
    type?: string;
    multiline?: boolean;

    dataName?: string;
}

export default function DumbTextInput({
    name,
    placeholder,
    value,
    setValue,
    disabled,
    description,
    max = 256,
    thin,
    type,
    multiline,
    dataName
}: Props) {
    const className = cn(
        "resize-y w-full dark:bg-wamellow bg-wamellow-100 rounded-lg flex items-center px-3.5 py-2 focus:outline outline-violet-400 caret-violet-400 outline-2",
        max > 300 ? "h-28" : (thin ? "h-10" : "h-12"),
        thin && "relative bottom-1",
        disabled && "cursor-not-allowed opacity-50"
    );

    const [length, setLength] = useState(0);

    useEffect(() => {
        setLength(dataName ? JSON.parse(value)[dataName]?.length : value?.length || 0);
    }, [value]);

    return (
        <div className="relative select-none w-full max-w-full mb-3">
            {name &&
                <div className="flex items-center gap-2">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                </div>
            }

            {type !== "color" && (max - 64 < length) &&
                <div className={`ml-auto text-xs absolute top-1 right-2 ${max - 8 < length ? "dark:text-red-500 text-red-400" : "dark:text-neutral-500 text-neutral-400"}`}>
                    {value && <span>{length}</span>}
                    /
                    <span>{max}</span>
                </div>
            }

            {type === "color" ?
                <div
                    className={cn(className, "mt-1 h-12 w-full rounded-md border dark:border-wamellow border-wamellow-100 bg-none")}
                    style={{ backgroundColor: `#${(dataName ? JSON.parse(value)[dataName] : value)?.toString(16)}` }}
                >
                    <input
                        className="opacity-0 w-full h-full cursor-pointer"
                        type="color"
                        value={`#${(dataName ? JSON.parse(value)[dataName] : value)?.toString(16)}`}
                        onChange={(e) => {
                            const color = parseInt(e.target.value.replace(/#/, ""), 16);

                            if (dataName) {
                                setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: color || null })));
                            } else {
                                setValue(color || null);
                            }
                        }}
                        disabled={disabled}
                    />
                </div>
                :
                (max > 300 || multiline) ?
                    <textarea
                        className={className}
                        placeholder={placeholder}
                        onChange={(e) => {
                            if (dataName) {
                                setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: e.target.value || null })));
                            } else {
                                setValue(e.target.value || null);
                            }
                        }}
                        value={(dataName ? JSON.parse(value)[dataName] : value) || ""}
                        disabled={disabled}
                        rows={2}
                        maxLength={max || Infinity}
                    />
                    :
                    <input
                        className={className}
                        placeholder={placeholder}
                        onChange={(e) => {
                            if (dataName) {
                                setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: e.target.value || null })));
                            } else {
                                setValue(e.target.value || null);
                            }
                        }}
                        value={(dataName ? JSON.parse(value)[dataName] : value) || ""}
                        disabled={disabled}
                        type={type}
                        maxLength={max || Infinity}
                    />
            }

            {description &&
                <div className="dark:text-neutral-500 text-neutral-400 text-sm mt-1">
                    {description}
                </div>
            }

        </div>
    );
}