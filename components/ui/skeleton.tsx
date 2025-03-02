import { cn } from "@/utils/cn";

export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement> {
    isLoading?: boolean;
}

function Skeleton({
    className,
    children,
    isLoading,
    ...props
}: SkeletonProps) {
    if (!isLoading && isLoading !== undefined) {
        return (
            <div className={className} {...props}>
                {children}
            </div>
        );
    }

    return (
        <div
            className={cn("animate-pulse rounded-md bg-primary/10", className)}
            {...props}
        />
    );
}

export { Skeleton };