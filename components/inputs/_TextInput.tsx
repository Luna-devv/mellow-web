import React, { FunctionComponent, useEffect, useState } from "react";

type Props = {
    name?: string;
    placeholder?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any; setValue: React.Dispatch<React.SetStateAction<any>>;

    disabled?: boolean;
    description?: string;
    max?: number;
    type?: string;

    dataName?: string;
};


const TextInput: FunctionComponent<Props> = ({ name, placeholder, value, setValue, disabled, description, max = 0, type, dataName }) => {
    const className = `mt-1 ${max > 300 ? "h-28" : "h-14"} resize-none w-full dark:bg-wamellow bg-wamellow-100 rounded-md flex items-center p-4 focus:outline outline-violet-400 outline-2 ${disabled && "cursor-not-allowed opacity-50"}`;

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

            {max > 300 ?
                <textarea
                    className={className}
                    placeholder={placeholder}
                    onChange={(e) => {
                        if (dataName) {
                            setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value || undefined })));
                        } else {
                            setValue(type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value || undefined);
                        }
                    }}
                    defaultValue={type === "color" ? `#${(dataName ? JSON.parse(value)[dataName] : value)?.toString(16)}` : dataName ? JSON.parse(value)[dataName] : value}
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
                            setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value || undefined })));
                        } else {
                            setValue(type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value || undefined);
                        }
                    }}
                    defaultValue={type === "color" ? `#${(dataName ? JSON.parse(value)[dataName] : value)?.toString(16)}` : dataName ? JSON.parse(value)[dataName] : value}
                    disabled={disabled}
                    type={type}
                    maxLength={max || Infinity}
                />
            }

            {description && <div className="dark:text-neutral-500 text-neutral-400 text-sm">{description}</div>}

        </div>
    );
};

export default TextInput;