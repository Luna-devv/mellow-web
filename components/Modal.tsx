"use client";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
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
    show: boolean;
    buttonName?: string
}
const Modal: FunctionComponent<Props> = ({ title, children, onSubmit, onClose, onSuccess, show, buttonName = "Submit" }) => {

    const [error, setError] = useState<string>();

    return (
        <MotionConfig
            transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
        >
            <AnimatePresence initial={false}>

                {show &&
                    <motion.div
                        initial="closed"
                        animate={show ? "open" : "closed"}
                        exit="closed"
                        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                        className="fixed top-0 left-0 h-screen w-full inset-0 bg-black/70 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial="closed"
                            animate={show ? "open" : "closed"}
                            exit="closed"
                            variants={{
                                closed: {
                                    y: "var(--y-closed, 0)",
                                    opacity: "var(--opacity-closed)",
                                    scale: "var(--scale-closed, 1)"
                                },
                                open: {
                                    y: "var(--y-open, 0)",
                                    opacity: "var(--opacity-open)",
                                    scale: "var(--scale-open, 1)"
                                }
                            }}
                            className="
                            md:relative fixed bottom-0 min-h-[333px] md:min-h-fit m-2
                            w-full md:w-[480px] bg-[var(--background-rgb)] rounded-md shadow-md
                            max-sm:[--y-closed:16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                            max-sm:[--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
                        "
                        >

                            <div className="p-4">

                                <div className="flex items-center">
                                    <span className="text-2xl font-semibold dark:text-neutral-200 text-neutral-800">{title}</span>
                                    <button
                                        onClick={() => onClose()}
                                        className="ml-auto dark:bg-neutral-800/50 bg-neutral-200/50 dark:hover:bg-neutral-700/50 hover:bg-neutral-300/50 dark:text-neutral-400 text-neutral-600 dark:hover:text-neutral-200 hover:text-neutral-800 duration-200 rounded-md p-1.5"
                                    >
                                        <HiX className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <hr className="mt-2 mb-3 dark:border-wamellow-light border-wamellow-100-light" />

                                {error && <ErrorBanner message={error} removeButton={true} />}

                                {children}

                            </div>

                            <div className="md:relative absolute bottom-0 left-0 w-full dark:bg-wamellow/40 bg-wamellow-100/40 rounded-bl-md rounded-br-md">
                                <div className="flex w-full items-baseline gap-4 p-4">

                                    <button
                                        onClick={() => onClose()}
                                        className="ml-auto text-sm font-medium dark:text-neutral-200 text-neutral-800"
                                    >
                                        Cancel
                                    </button>

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
                                        className="flex bg-violet-600 hover:bg-violet-700 text-neutral-200 font-medium py-2 px-5 duration-200 rounded-md"
                                    >
                                        <span>{buttonName}</span>
                                    </button>

                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                }

            </AnimatePresence>
        </MotionConfig>
    );

};

export default Modal;