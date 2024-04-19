import { Divider } from "@nextui-org/react";

export default function Section({
    title,
    children,
    ...props
}: {
    title: string;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <Divider className="mt-10 mb-4" />

            <div {...props}>
                <h3 className="text-xl text-neutral-200">{title}</h3>
                {children &&
                    <p className="dark:text-neutral-500 text-neutral-400 mb-3">
                        {children}
                    </p>
                }
            </div>
        </>
    );
}