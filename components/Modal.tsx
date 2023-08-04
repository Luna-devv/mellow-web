"use client";
import { FunctionComponent, useState } from "react";
import { HiX } from "react-icons/hi";

import { RouteErrorResponse } from "@/typings";

import ErrorBanner from "./Error";

interface Props {
    title: string;
    children: React.ReactNode;
    onSubmit?: () => Promise<Response>;
    onClose: () => void;
    dismissable?: boolean;
}

const Modal: FunctionComponent<Props> = ({ title, children, onSubmit, onClose }) => {

    const [error, setError] = useState<string>();

    return (
        <div id="modal-children" className="absolute top-0 left-0 w-full h-full bg-black/70 shadow-lg ml-auto flex items-center justify-center z-50">
            <div className="w-[460px] p-4 bg-wamellow rounded-md">

                <div className="flex items-center">
                    <span className="text-2xl font-medium text-neutral-100">{title}</span>
                    <button
                        onClick={() => onClose()} className="ml-auto text-neutral-500 hover:text-neutral-400 duration-200"
                    >
                        <HiX className="h-5 w-5" />
                    </button>
                </div>

                <hr className="mt-2 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

                {error && <ErrorBanner message={error} removeButton={true} />}

                {children}

                <div className="mt-8">
                    <div className="flex w-full items-baseline">

                        <span className="text-sm text-neutral-400">It feels so empty without anything</span>

                        <button
                            onClick={() => {
                                if (!onSubmit) return onClose();

                                onSubmit?.()
                                    .then(async (res) => {
                                        if (res.ok) onClose();
                                        else setError((await res.json() as RouteErrorResponse).message || "Unknown server error");
                                    })
                                    .catch((e) => setError(e || "Unknown server error"));
                            }}
                            className="ml-auto flex bg-violet-600 hover:bg-violet-700 text-neutral-200 py-2 px-4 duration-200 rounded-md"
                        >
                            <span>Close</span>
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );

};

export default Modal;