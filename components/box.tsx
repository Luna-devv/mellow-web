import React, { type HTMLProps } from "react";

import cn from "@/utils/cn";

type Props = HTMLProps<HTMLDivElement> & {
    children: React.ReactNode;
    className?: string;
    small?: boolean;
    border?: boolean;
}

export default function Box({
    children,
    className,
    border = true,
    ...props
}: Props): JSX.Element {
    return (
        <div
            className={cn("bg-wamellow rounded-lg py-6 px-8 md:py-10 md:px-16", border && "border-wamellow-alpha border", className)}
            {...props}
        >
            {children}
        </div>
    );
}