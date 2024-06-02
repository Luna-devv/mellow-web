"use client";

import { Button, Progress } from "@nextui-org/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";

import { RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";

import { ClickOutside } from "./click-outside";
import Notice, { NoticeType } from "./notice";

enum State {
    Idle = 0,
    Loading = 1
}

interface Props<T> {
    className?: string;
    variant?: "default" | "danger";

    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;

    onSubmit?: () => Promise<Response> | Error | undefined;
    onSuccess?: (data: T) => void;
    onClose: () => void;

    isOpen: boolean;
    isDisabled?: boolean;

    buttonName?: string;
}

export default function Modal<T>({
    className,
    variant,
    title,
    children,
    footer,

    onSubmit,
    onClose,
    onSuccess,

    isOpen,
    isDisabled,

    buttonName = "Submit"
}: Props<T>) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        setState(State.Idle);

        const html = document.getElementsByTagName("html")?.[0];
        if (isOpen) {
            html.style.overflow = document.body.style.overflow = "hidden";
        } else {
            html.style.overflow = document.body.style.overflow = "auto";
        }

        return () => {
            html.style.overflow = document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    async function submit() {
        if (state === State.Loading) return;
        if (!onSubmit) return onClose();

        setState(State.Loading);
        const data = onSubmit?.();

        if (!data) return onClose();

        if (data instanceof Error) {
            setError(data?.message || "Something went wrong..");
            setState(State.Idle);
            return;
        }

        const res = await data;
        setState(State.Idle);

        if (res.ok) {
            onClose();
            onSuccess?.(await res.json());
            return;
        }

        setError((await res.json() as RouteErrorResponse).message || "Unknown server error");
    }

    function Header() {
        return (<>
            <div className="flex items-center">
                <span className="text-2xl font-semibold dark:text-neutral-200 text-neutral-800">
                    {title}
                </span>

                <Button
                    onClick={() => onClose()}
                    className="ml-auto"
                    size="sm"
                    isIconOnly
                >
                    <span>
                        <HiX />
                    </span>
                </Button>
            </div>

            <Progress
                size="sm"
                isIndeterminate={state === State.Loading}
                aria-label="Loading..."
                className="mt-2 mb-3 h-0.5"
                classNames={{
                    track: "dark:bg-wamellow-light bg-wamellow-100-light",
                    indicator: "bg-violet-500"
                }}
                value={0}
            />
        </>);
    }

    function Footer({
        children
    }: {
        children: React.ReactNode
    }) {
        return (<div className="flex items-center w-full gap-4 p-4">
            {children}

            {onSubmit &&
                <button
                    onClick={() => onClose()}
                    className={cn(
                        "ml-auto text-sm font-medium dark:text-neutral-200 text-neutral-800",
                        state === State.Idle && "cursort-not-allowed"
                    )}
                    disabled={state !== State.Idle}
                >
                    Cancel
                </button>
            }

            <Button
                color={variant || "secondary"}
                onClick={() => submit()}
                className={cn(!onSubmit && "ml-auto")}
                isLoading={state === State.Loading}
                isDisabled={isDisabled}
            >
                {buttonName}
            </Button>

            <ClickOutside onClose={onClose} />
        </div>);
    }

    return (<MotionConfig transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}>
        <AnimatePresence initial={false}>

            {isOpen &&
                <motion.div
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    exit="closed"
                    variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                    className="fixed top-0 left-0 h-screen w-full inset-0 backdrop-blur backdrop-brightness-50 flex items-center justify-center z-50 cursor-default"
                    style={{ maxHeight: "100dvh" }}
                >
                    <motion.div
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
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
                            md:relative fixed bottom-0 min-h-[333px] md:min-h-fit m-2 wamellow-modal
                            w-full md:w-[480px] bg-[#06040b] rounded-xl shadow-md
                            max-sm:[--y-closed:16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                            max-sm:[--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
                        "
                    >

                        <div className="p-4 pb-0 mb-16 md:mb-0">
                            <Header />

                            <div
                                className={cn(
                                    "scrollbar-none p-0.5 pb-8 md:pb-4 max-h-[512px] overflow-y-scroll md:overflow-y-visible overflow-x-hidden",
                                    className
                                )}
                            >
                                {error &&
                                    <Notice
                                        type={NoticeType.Error}
                                        message={error}
                                    />
                                }

                                {children}
                            </div>

                        </div>

                        <div className="md:relative absolute bottom-0 left-0 w-full dark:bg-wamellow bg-wamellow-100 rounded-bl-md rounded-br-md backdrop-blur-md">
                            <Footer>
                                {footer}
                            </Footer>
                        </div>

                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </MotionConfig>);
}