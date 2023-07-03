import React, { FunctionComponent } from "react";

import { widthStore } from "@/common/width";

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
    const width = widthStore((w) => w);
    const className = `mt-1 ${max > 300 ? "h-28" : "h-14"} resize-none w-full dark:bg-wamellow bg-wamellow-100 rounded-md flex items-center p-4 focus:outline outline-violet-400 outline-2 ${disabled && "cursor-not-allowed opacity-50"}`;

    return (
        <div className={`select-none w-full max-w-full h-12 ${max > 300 ? "mb-20" : "mb-6"}`}>
            {name &&
                <div className="flex items-center gap-2">
                    <span className="text-lg dark:text-slate-300 text-slate-700 font-medium">{name}</span>
                </div>
            }

            {max > 300 ?
                <textarea
                    className={className}
                    placeholder={placeholder}
                    onChange={(e) => {
                        if (dataName) {
                            setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value })));
                        } else {
                            setValue(type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value);
                        }
                    }}
                    disabled={disabled}
                    rows={2}
                />
                :
                <input
                    className={className}
                    placeholder={placeholder}
                    onChange={(e) => {
                        if (dataName) {
                            setValue(JSON.stringify(Object.assign(JSON.parse(value), { [dataName]: type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value })));
                        } else {
                            setValue(type === "color" ? parseInt(e.target.value.slice(1), 16) : e.target.value);
                        }
                    }}
                    disabled={disabled}
                    type={type}
                />
            }

            <div className={`${width > 880 && "flex"} mt-1`}>
                {description && <div className="dark:text-neutral-500 text-neutral-400 text-sm">{description}</div>}
            </div>

        </div>
    );
};

export default TextInput;