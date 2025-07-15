"use client";

import { Progress } from "@nextui-org/react";
import { Separator } from "@radix-ui/react-separator";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";

import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";

import { ClickOutside } from "./click-outside";
import Notice, { NoticeType } from "./notice";
import { Button } from "./ui/button";

enum State {
    Idle = 0,
    Loading = 1
}

interface Props<T> {
    className?: string;
    variant?: "secondary" | "default" | "destructive";

    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;

    onSubmit?: () => Promise<Response> | Error | undefined;
    onSuccess?: (data: T) => void;
    onClose: () => void;
    onError?: () => void;

    isOpen: boolean;
    isDisabled?: boolean;

    buttonName?: string;
}

export default function Modal<T>({
    className,
    variant = "secondary",
    title,
    children,
    footer,

    onSubmit,
    onClose,
    onSuccess,
    onError,

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
            html.style.overflow = document.body.style.overflow = "";
        }

        return () => {
            html.style.overflow = document.body.style.overflow = "";
        };
    }, [isOpen]);

    async function submit() {
        if (state === State.Loading) return;
        if (!onSubmit) return onClose();

        setError(null);
        setState(State.Loading);
        const data = onSubmit?.();

        if (!data) return onClose();

        if (data instanceof Error) {
            setError(data?.message || "something went wrong..");
            onError?.();
            setState(State.Idle);
            return;
        }

        const res = await data;
        setState(State.Idle);

        if (res.ok) {
            onClose();
            onSuccess?.(res.status === 204 ? null : await res.json());
            return;
        }

        setError((await res.json() as ApiError).message || "unknown server error");
        onError?.();
    }

    function Header() {
        return (<>
            <div className="flex items-center">
                <span className="text-2xl font-semibold dark:text-neutral-200 text-neutral-800">
                    {title}
                </span>

                <Button
                    onClick={() => state !== State.Loading && onClose()}
                    className="ml-auto"
                    size="icon"
                >
                    <HiX />
                </Button>
            </div>

            <Progress
                size="sm"
                isIndeterminate={state === State.Loading}
                aria-label="Loading..."
                className="mt-3 mb-4 h-0.5"
                classNames={{
                    track: "bg-divider",
                    indicator: "bg-violet-500"
                }}
                value={0}
            />
        </>);
    }

    function Footer() {
        return (<div className="flex items-center w-full gap-6 p-4">
            {footer}

            {onSubmit &&
                <button
                    onClick={() => state !== State.Loading && onClose()}
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
                variant={variant}
                onClick={() => submit()}
                className={cn(!onSubmit && "ml-auto")}
                disabled={isDisabled}
            >
                {buttonName}
            </Button>

            {isOpen && state !== State.Loading && <ClickOutside onClose={onClose} />}
        </div>);
    }

    return (<MotionConfig transition={{ type: "spring", bounce: 0.4, duration: 1 }}>
        <AnimatePresence initial={false}>

            {isOpen &&
                <motion.div
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    exit="closed"
                    variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                    className="fixed top-0 left-0 h-screen w-full inset-0 backdrop-brightness-[25%] backdrop-blur flex items-center justify-center z-50 cursor-default"
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
                            md:relative fixed bottom-0 min-h-[333px] md:min-h-fit mb-2 wamellow-modal
                            w-[97%] md:w-[480px] bg-popover rounded-xl shadow-md
                            max-sm:[--y-closed:28px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                            max-sm:[--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
                        "
                    >

                        <div className="p-4 pb-0">
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

                        <Separator className="bg-muted h-[1px]" />

                        <Footer />
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </MotionConfig>);
}