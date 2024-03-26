import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { HiTrash } from "react-icons/hi";

import Box from "@/components/box";
import { ServerButton } from "@/components/server-button";
import { Shiggy } from "@/components/shiggy";
import cn from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const generateMetadata = async (): Promise<Metadata> => {
    const title = "Shiggy";
    const description = "";
    const url = getCanonicalUrl("debug");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: {
                url: `${getBaseUrl()}/shiggy.gif`,
                type: "image/gif"
            }
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: {
                url: `${getBaseUrl()}/shiggy.gif`,
                alt: title
            }
        }
    };
};

export default function Home() {

    if (cookies().get("devTools")?.value !== "true") {
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

    async function deleteCookie(formData: FormData) {
        "use server";

        const cookieStore = cookies();

        function del(name: string) {
            cookieStore.set(
                name,
                "",
                {
                    expires: new Date(0),
                    domain: process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1]
                }
            );
        }

        const name = formData.get("name") as string;

        if (name) {
            del(name);
            return;
        }

        const cookieNames = cookieStore.getAll();
        for (const cookie of cookieNames) {
            if (cookie.name !== "devTools") del(cookie.name);
        }
    }

    const cookieStore = cookies();

    return (
        <div className="md:flex gap-8">

            <div className="w-full">
                <h2 className="text-2xl font-medium text-neutral-200">Cookies 🍪</h2>

                <div className="mt-2 flex flex-col gap-3 divide-y-1 divide-wamellow">

                    {cookieStore.getAll().map((cookie) => (
                        <div
                            className="pt-2 flex gap-4 items-center justify-between"
                            key={cookie.name}
                        >
                            <div>
                                <h3 className="text-lg font-medium text-neutral-200">{cookie.name}</h3>

                                <div className={cn(
                                    "break-all",
                                    cookie.name === "session" ? "blur hover:blur-0 transition duration-50" : ""
                                )}>
                                    {cookie.value}
                                </div>
                            </div>

                            <form action={deleteCookie}>
                                <ServerButton
                                    type="submit"
                                    isIconOnly
                                >
                                    <HiTrash className="text-red-400" />
                                </ServerButton>
                                <input className="hidden" type="text" name="name" defaultValue={cookie.name} readOnly />
                            </form>
                        </div>
                    ))}

                </div>

                <div className="mt-4 flex gap-2 items-center">
                    <form action={deleteCookie}>
                        <ServerButton
                            type="submit"
                        >
                            Delete all cookies
                        </ServerButton>
                    </form>
                    <ServerButton
                        as={Link}
                        href="/logout"
                        prefetch={false}
                    >
                        Logout
                    </ServerButton>
                </div>

            </div>

            <Shiggy className="mt-auto h-52" />
        </div>
    );
}