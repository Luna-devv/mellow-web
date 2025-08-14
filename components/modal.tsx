"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiFire } from "react-icons/hi";

import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";

import Notice, { NoticeType } from "./notice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";

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

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <Separator className="bg-muted h-[1px]" loading={state === State.Loading} />
                </DialogHeader>

                <div
                    className={cn(
                        "scrollbar-hide overflow-y-scroll overflow-x-hidden max-h-[70vh] py-2 px-0.5",
                        className
                    )}
                >
                    {error && (
                        <ModalNotice
                            type={NoticeType.Error}
                            message={error}
                        />
                    )}

                    {children}
                </div>

                <DialogFooter>
                    {footer}

                    {onSubmit && (
                        <Button
                            variant="link"
                            onClick={() => state !== State.Loading && onClose()}
                            className="hidden md:block ml-auto text-sm font-medium"
                            disabled={state !== State.Idle}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        variant={variant}
                        onClick={() => submit()}
                        className={cn(!onSubmit && "ml-auto")}
                        disabled={isDisabled}
                    >
                        {buttonName}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ModalNotice({
    icon,
    message,
    type = NoticeType.Info,
    location = "side",
    children
}: Parameters<typeof Notice>[0]) {
    if (message.toLowerCase().includes("premium")) {
        return (
            <div className="relative">
                <Notice
                    icon={<HiFire className="size-4" />}
                    message={message}
                    type={NoticeType.Info}
                    location="bottom"
                >
                    <Button
                        asChild
                        className="mt-2"
                        size="sm"
                    >
                        <Link
                            href={`/premium?utm_source=${window.location.hostname}&utm_medium=modal`}
                            target="_blank"
                        >
                            Upgrade
                        </Link>
                    </Button>
                </Notice>

                <div className="absolute -top-2 -right-0.5 z-10">
                    <Badge className="rotate-3 backdrop-blur-md backdrop-brightness-75">
                        First Month Free!!
                    </Badge>
                </div>
            </div>
        );
    }

    return (
        <Notice
            icon={icon}
            message={message}
            type={type}
            location={location}
        >
            {children}
        </Notice>
    );
}