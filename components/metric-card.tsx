import { Skeleton } from "./ui/skeleton";

export function Metrics({
    children
}: {
    children: JSX.Element[];
}) {
    return (
        <div className="md:ml-auto flex items-center gap-5 mt-6 md:mt-0">
            {children}
        </div>
    );
}

export function MetricCard({
    children,
    name,
    isLoading
}: {
    children: React.ReactNode;
    name: string;
    isLoading: boolean;
}) {
    return (
        <div>
            <div className="text-sm font-medium">
                {name}
            </div>
            {isLoading
                ? <Skeleton className="rounded-md mt-1.5 w-20 h-6 mb-1" />
                : <span className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">
                    {children}
                </span>
            }
        </div>
    );
}