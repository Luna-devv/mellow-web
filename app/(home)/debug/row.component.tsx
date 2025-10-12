import { cn } from "@/utils/cn";

export default function Row({
    name,
    value,
    children
}: {
    name: string;
    value: string;
    children: React.ReactNode;
}) {
    return (
        <div className="pt-2 flex gap-4 items-center justify-between" >
            <div>
                <h3 className="text-lg font-medium text-neutral-200">{name}</h3>

                <div className={cn(
                    "break-all",
                    name === "session" && "blur-sm hover:blur-0 transition duration-50"
                )}>
                    {value}
                </div>
            </div>

            {children}
        </div>
    );
}