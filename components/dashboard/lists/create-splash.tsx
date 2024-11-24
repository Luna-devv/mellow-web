export function CreateSplash({
    name,
    description,
    children
}: {
    name: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="w-full flex flex-col items-center justify-center"
            style={{ marginTop: "20vh" }}
        >
            <div>

                <div className="mb-10 flex flex-col items-center text-center">
                    <span className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">You dont have any {name} yet</span> <br />
                    <span className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold">{description}</span>
                </div>

                <div className="w-full flex flex-col items-center">
                    {children}
                </div>

            </div>
        </div>
    );
}