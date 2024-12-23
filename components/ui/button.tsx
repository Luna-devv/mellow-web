import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
    "inline-flex justify-center items-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>svg]:size-5",
    {
        variants: {
            variant: {
                default: "bg-wamellow text-primary-foreground hover:bg-wamellow-200",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                blurple: "bg-blurple text-secondary-foreground hover:bg-blurple/80"
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-4",
                lg: "h-11 rounded-md px-8",
                icon: "h-7 w-7 p-1.5"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export interface LinkButtonProps extends Omit<ButtonProps, "asChild"> {
    href: string;
    target?: "_blank";
    prefetch?: false;
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
    ({ children, href, target, prefetch, ...props }, ref) => {
        return (
            <Button
                asChild
                ref={ref}
                {...props}
            >
                <Link
                    href={href}
                    target={target}
                    prefetch={prefetch || true}
                >
                    {children}
                </Link>
            </Button>
        );
    }
);

LinkButton.displayName = "LinkButton";

export { Button, buttonVariants, LinkButton };