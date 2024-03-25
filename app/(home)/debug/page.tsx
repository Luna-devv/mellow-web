import { cookies } from "next/headers";

import Box from "@/components/box";
import { Shiggy } from "@/components/inputs/shiggy";

export default function Home() {
    const cookieStore = cookies();

    if (cookieStore.get("devTools")?.value !== "true") {
        return (
            <Box
                className="relative mb-64 mt-12"
                small
            >
                <div>
                    <h1 className="text-2xl font-medium text-neutral-100">You need to enable dev tools to view this page</h1>
                    <p>Enable lunar tools in your browser to view this page</p>
                </div>
                <Shiggy className="absolute right-4 bottom-0 h-52" />
            </Box>
        );
    }

    return (
        <div className="flex gap-4">

            <div className="w-full">
                {cookieStore.getAll().map((cookie) => (
                    <div
                        className="mb-4"
                        key={cookie.name}
                    >
                        <h3 className="text-lg font-medium text-neutral-100">{cookie.name}</h3>
                        <p className={cookie.name === "session" ? "blur hover:blur-0 transition duration-50" : ""}>
                            {cookie.value}
                        </p>
                    </div>
                ))}
            </div>

            <Shiggy className="mt-auto h-52" />
        </div>
    );
}