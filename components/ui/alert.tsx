import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const alertVariants = cva(
    "relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-[17px] [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                secondary: "bg-secondary/60 text-secondary-foreground",
                destructive: "bg-destructive/60 text-destructive-foreground"
            }
        },
        defaultVariants: {
            variant: "secondary"
        }
    }
);

const Alert = React.forwardRef<
    HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
    />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };