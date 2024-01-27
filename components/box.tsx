import React, { type HTMLProps } from "react";

import cn from "@/utils/cn";

type Props = HTMLProps<HTMLDivElement> & {
    children: React.ReactNode;
    className?: string;
    small?: boolean;
    none?: boolean;
    border?: boolean;
}

export default function Box({
    children,
    className,
    small = false,
    none = false,
    border = true,
    ...props
}: Props): JSX.Element {
    return (
        <div
            className={cn(
                "bg-wamellow rounded-lg",
                !none && "py-6 px-8 md:py-10 md:px-16",
                small && "py-4 px-6 md:py-8 md:px-10",
                border && "border-wamellow-alpha border", className
            )}
            {...props}
        >
            {children}
        </div>
    );
}