import { cn } from "@/utils/cn";

import { Separator } from "./ui/separator";

export function Section({
    title,
    showDivider = true,
    children,

    className,
    ...props
}: {
    title: string;
    showDivider?: boolean;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (<>
        {showDivider && <Separator className="mt-12 mb-4" />}

        <div
            className={cn("mb-3", className)}
            {...props}
        >
            <h3 className="text-xl text-neutral-200">{title}</h3>
            {children && (
                <p className="dark:text-neutral-500 text-neutral-400">
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
            <h3 className="text-medium font-medium text-neutral-300 mt-5">{title}</h3>
            <div className="dark:text-neutral-500 text-neutral-400 mb-3">
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