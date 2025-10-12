import { cn } from "@/utils/cn";
import type { ElementType } from "react";

interface CircularProgressProps<As extends ElementType> {
    as?: As;
    value: number;
    renderLabel?: (progress: number) => number | string;
    size?: number;
    strokeWidth?: number;
    circleStrokeWidth?: number;
    progressStrokeWidth?: number;
    shape?: "square" | "round";
    className?: string;
    progressClassName?: string;
    labelClassName?: string;
    showLabel?: boolean;
}

export function CircularProgress<As extends ElementType>({
    as,
    value,
    renderLabel,
    className,
    progressClassName,
    labelClassName,
    showLabel,
    shape = "round",
    size = 100,
    strokeWidth,
    circleStrokeWidth = 10,
    progressStrokeWidth = 10,
    ...props
}: CircularProgressProps<As> & React.ComponentPropsWithoutRef<As>) {
    const Comp = as || "div";

    const maxStrokeWidth = Math.max(strokeWidth ?? circleStrokeWidth, strokeWidth ?? progressStrokeWidth);
    const radius = (size - maxStrokeWidth) / 2;
    const circumference = Math.ceil(3.14 * radius * 2);
    const percentage = Math.ceil(circumference * ((100 - value) / 100));

    const viewBox = `0 0 ${size} ${size}`;

    return (
        <Comp
            className={cn("relative", className)}
            {...props}
        >
            <svg
                width={size}
                height={size}
                viewBox={viewBox}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "rotate(-90deg)" }}
                className="relative"
            >
                {/* Base Circle */}
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    strokeWidth={strokeWidth ?? circleStrokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset="0"
                    className={cn("stroke-primary/25")}
                />

                {/* Progress */}
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeWidth={strokeWidth ?? progressStrokeWidth}
                    strokeLinecap={shape}
                    strokeDashoffset={percentage}
                    fill="transparent"
                    strokeDasharray={circumference}
                    className={cn("stroke-primary", progressClassName)}
                />
            </svg>
            {showLabel && (
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center text-md",
                        labelClassName
                    )}
                >
                    {renderLabel ? renderLabel(value) : value}
                </div>
            )}
        </Comp>
    );
}