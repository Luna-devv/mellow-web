import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:relative [&>svg]:right-1",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary/10 text-primary-foreground",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                flat: "border-transparent bg-flat/40 text-flat-foreground",
                destructive: "border-transparent bg-destructive text-destructive-foreground",
                outline: "text-foreground"
            },
            radius: {
                default: "rounded-md",
                rounded: "rounded-full",
                square: "rounded-none"
            }
        },
        defaultVariants: {
            variant: "default",
            radius: "default"
        }
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    radius?: "default" | "rounded" | "square";
}

function Badge({ className, variant, radius, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, radius }), className)} {...props} />
    );
}

export { Badge, badgeVariants };