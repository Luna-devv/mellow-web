import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { HiTrash } from "react-icons/hi";

import { Shiggy } from "@/components/shiggy";
import { Button } from "@/components/ui/button";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import Panel from "./panel.component";

export const generateMetadata = (): Metadata => {
    const title = "Shiggy";
    const description = "Uhhhh debug page???";
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
        },

        robots: "noindex, follow"
    };
};

export default async function Home() {
    const headerList: { name: string; value: string; }[] = [];
    for (const [key, value] of (await headers()).entries()) {
        headerList.push({ name: key, value });
    }

    async function deleteCookie(formData: FormData) {
        "use server";

        const jar = await cookies();

        function del(name: string) {
            jar.set(
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

        const cookieNames = jar.getAll();
        for (const cookie of cookieNames) {
            if (cookie.name !== "devTools") del(cookie.name);
        }
    }

    return (
        (<div className="md:flex gap-8">
            <div className="space-y-10">
                <Panel
                    name="Cookies 🍪"
                    items={(await cookies()).getAll()}
                    action={(cookie) => (
                        <form action={deleteCookie}>
                            <Button type="submit">
                                <HiTrash className="text-red-400" />
                            </Button>
                            <input className="hidden" type="text" name="name" defaultValue={cookie.name} readOnly />
                        </form>
                    )}
                >
                    <div className="mt-4 flex gap-2 items-center">
                        <form action={deleteCookie}>
                            <Button type="submit">
                                Delete all cookies
                            </Button>
                        </form>
                    </div>
                </Panel>

                <Panel
                    name="Headers 📃"
                    items={headerList}
                />
            </div>
            <Shiggy className="mt-auto h-52" />
        </div>)
    );
}