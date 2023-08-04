"use client";
import { FunctionComponent, useState } from "react";
import { HiX } from "react-icons/hi";

import { RouteErrorResponse } from "@/typings";

import ErrorBanner from "./Error";

interface Props {
    title: string;
    children: React.ReactNode;
    onSubmit?: () => Promise<Response>;
    onSuccess?: () => void;
    onClose: () => void;
    dismissable?: boolean;
    buttonName?: string
}

const Modal: FunctionComponent<Props> = ({ title, children, onSubmit, onClose, onSuccess, buttonName = "Submit" }) => {

    const [error, setError] = useState<string>();

    return (
        <div id="modal-children" className="absolute top-0 left-0 w-full h-full bg-black/70 shadow-lg ml-auto flex items-center justify-center z-50">
            <div className="md:w-[460px] w-full md:h-fit h-full p-4 dark:bg-wamellow bg-wamellow-100 md:rounded-md relative">

                <div className="flex items-center">
                    <span className="text-2xl font-medium dark:text-neutral-100 text-neutral-900">{title}</span>
                    <button
                        onClick={() => onClose()} className="ml-auto text-neutral-500 dark:hover:text-neutral-400 hover:text-neutral-600 duration-200"
                    >
                        <HiX className="h-5 w-5" />
                    </button>
                </div>

                <hr className="mt-2 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

                {error && <ErrorBanner message={error} removeButton={true} />}

                {children}

                <div className="md:mt-8 md:static absolute bottom-0 left-0 w-full md:p-0 p-4">
                    <div className="flex w-full items-baseline">

                        <span className="text-sm dark:text-neutral-400 text-neutral-600">It feels so empty without anything</span>

                        <button
                            onClick={() => {
                                if (!onSubmit) return onClose();

                                onSubmit?.()
                                    .then(async (res) => {
                                        if (res.ok) {
                                            onClose();
                                            onSuccess?.();
                                        }
                                        else setError((await res.json() as RouteErrorResponse).message || "Unknown server error");
                                    })
                                    .catch((e) => setError(e || "Unknown server error"));
                            }}
                            className="ml-auto flex bg-violet-600 hover:bg-violet-700 text-neutral-200 py-2 px-4 duration-200 rounded-md"
                        >
                            <span>{buttonName}</span>
                        </button>

                    </div>
                </div>

            </div>
        </div >
    );

};

export default Modal;