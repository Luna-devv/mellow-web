import { cn } from "@/utils/cn";

import { Separator } from "./ui/separator";

export function Section({
    title,
    showDivider = true,
    tight = false,
    children,

    className,
    ...props
}: {
    title: string;
    showDivider?: boolean;
    tight?: boolean;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (<>
        {showDivider && <Separator className={cn("mb-4 mt-12", tight && "mt-5")} />}

        <div
            className={cn("mb-3", className)}
            {...props}
        >
            <h3 className="text-xl font-medium tracking-tight text-neutral-200">{title}</h3>
            {children && (
                <p className="text-muted-foreground">
                    {children}
                </p>
            )}
        </div>
    </>);
}

export function SubSection({
    title,
    description,
    children,
    ...props
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <h3 className="text-medium font-medium tracking-tight text-neutral-300 mt-5">{title}</h3>
            <div className="text-muted-foreground mb-3">
                {description && (
                    <div className="mb-3">
                        {description}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}