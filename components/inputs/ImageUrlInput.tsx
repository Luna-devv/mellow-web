import { FunctionComponent, useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { RouteErrorResponse } from "@/typings";

import DumbTextInput from "./Dumb_TextInput";

type Props = {
    name: string;
    url: string;
    dataName: string;
    disabled?: boolean;
    description?: string;
    defaultState: string;
    ratio: `aspect-[${number}/${number}]`

    onSave?: (value: string) => void;
};


const ImageUrlInput: FunctionComponent<Props> = ({ name, url, dataName, disabled, description, defaultState, onSave, ratio }) => {
    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    const [value, setValue] = useState<string>("");
    const [defaultStatealue, setdefaultStatealue] = useState<string>("");
    const [imagestate, setImagestate] = useState<"ERRORED" | "SUCCESS" | undefined>(undefined);

    useEffect(() => {
        if (!defaultStatealue) setdefaultStatealue(defaultState);
        setValue(defaultState);
    }, [defaultState]);

    useEffect(() => {
        if (!value?.length) setImagestate("SUCCESS");
        // else setImagestate(undefind);
    }, [value]);

    useEffect(() => {
        if (imagestate !== "SUCCESS" || defaultStatealue === value) return;
        setError(undefined);
        setState("LOADING");

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataName.includes(".") ?
                { [dataName.split(".")[0]]: { [dataName.split(".")[1]]: value || null } }
                :
                { [dataName]: value || null }
            )
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setValue(value);
                        setdefaultStatealue(value);
                        onSave?.(value);

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

    }, [imagestate]);

    return (
        <div className="relative">

            <div className="flex items-center gap-2">
                <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">{name}</span>
                {state === "LOADING" && <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />}
            </div>

            <div className="lg:flex mt-1 w-full gap-4">

                <DumbTextInput
                    value={value}
                    setValue={(v) => {
                        setValue(v);
                        setState(undefined);
                        if (imagestate === "SUCCESS") setImagestate(undefined);
                    }}
                    disabled={disabled}
                    placeholder="Paste a direct image url..."
                    max={256}
                    description={description + " At this time, only .PNG files are supported."}
                />

                <div className="max-w-1/2 w-full">

                    {value && imagestate !== "ERRORED" ?
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={value} alt="" className="w-full rounded-md aspect-[4/1]" onError={() => setImagestate("ERRORED")} onLoad={() => setImagestate("SUCCESS")} />
                        :
                        <div className={`w-full ${imagestate === "ERRORED" ? "dark:border-red-500 border-red-300" : "dark:border-wamellow border-wamellow-100"} border-2 rounded-md flex items-center justify-center ${ratio}`}>
                            {imagestate === "ERRORED" ?
                                <div className="text-red-400 m-4">
                                    <div className="font-medium">Enter a <span className="underline underline-red-400">valid</span> image url!</div>
                                    <div className="text-xs">
                                        <div>Recommended resolution: 1024x256</div>
                                        <div>Recommended type: .png</div>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={value} alt="" className="w-0 h-0" onLoad={() => setImagestate("SUCCESS")} />
                                </div>
                                :
                                <span className="text-neutral-400">Enter a image url to preview</span>
                            }
                        </div>
                    }

                </div>

            </div>

            <div className="flex">
                {(error || state === "ERRORED") && <div className="ml-auto text-red-500 text-sm">{error || "Unknown error while saving"}</div>}
            </div>

        </div>
    );
};

export default ImageUrlInput;