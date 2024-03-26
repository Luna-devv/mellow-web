import { Button, Divider } from "@nextui-org/react";
import { Metadata } from "next";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiExternalLink } from "react-icons/hi";

import Footer from "@/components/footer";
import metadata from "@/public/docs/meta.json";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

interface Props {
    params: { pathname: string[] };
    children: React.ReactNode;
}

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const meta = metadata.pages.find((page) => page.file === `${params.pathname.join("/")}.md`);

    const title = "Documentation";
    const url = getCanonicalUrl("docs", ...params.pathname);

    return {
        title,
        description: meta?.description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description: meta?.description,
            url,
            type: "website",
            images: `${getBaseUrl()}/waya-v3.jpg?v=2`
        },
        twitter: {
            card: "summary",
            title,
            description: meta?.description,
            images: `${getBaseUrl()}/waya-v3.jpg?v=2`
        }
    };
};

export default async function RootLayout({
    params,
    children
}: Props) {
    const meta = metadata.pages.find((page) => page.file === `${params.pathname.join("/")}.md`);

    return (
        <div className="w-full">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium text-neutral-100">
                        Documentation
                    </h1>
                    <div>
                        {meta?.description}
                    </div>
                </div>
                <div className="text-red-400">
                    The docs are still work in progress!
                </div>
            </div>

            <Divider className="mt-2" />

            <div className="flex flex-col lg:flex-row gap-6 mt-5 min-h-[63vh]">
                <ul className="w-full lg:w-1/4 space-y-2">
                    {metadata.pages.map((page) => (
                        <ol key={page.file}>
                            <Button
                                as={Link}
                                className="w-full !justify-start"
                                href={`/docs/${page.file.replace(/\.md$/, "")}`}
                            >
                                {page.name}
                            </Button>
                        </ol>
                    ))}

                    <ol>
                        <Button
                            as={Link}
                            className="w-full !justify-start button-blurple mt-4"
                            href="/support"
                            startContent={<BsDiscord />}
                            endContent={<HiExternalLink />}
                        >
                            Join Support
                        </Button>
                    </ol>
                    <ol>
                        <Button
                            as={Link}
                            className="w-full !justify-start font-medium"
                            href="/invite"
                            color="secondary"
                            startContent={<BsDiscord />}
                            endContent={<HiExternalLink />}
                        >
                            Invite Wamellow
                        </Button>
                    </ol>
                </ul>

                <Divider className="lg:hidden" />
                <div className="w-full lg:w-3/4">
                    {children}
                </div>

            </div>

            <Footer className="mt-24" />

        </div>
    );
}