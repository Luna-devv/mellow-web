import { Button, Divider } from "@nextui-org/react";
import { Metadata } from "next";
import Link from "next/link";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { HiExternalLink, HiUserAdd, HiViewGridAdd } from "react-icons/hi";

import { Footer } from "@/components/footer";
import metadata from "@/public/docs/meta.json";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

interface Props {
    params: { pathname: string[] };
    children: React.ReactNode;
}

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const meta = metadata.pages.find((page) => page.file === `${params.pathname.join("/").toLowerCase()}.md`);

    const title = meta?.file === "index.md"
        ? "Documentation"
        : `${meta?.name} docs`;

    const url = getCanonicalUrl("docs", ...params.pathname);
    const images = {
        url: meta?.image || `${getBaseUrl()}/waya-v3.webp?v=2`,
        alt: meta?.description,
        heigth: 1008,
        width: 1935
    };

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
            images
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: meta?.description,
            images
        }
    };
};

export default async function RootLayout({
    params,
    children
}: Props) {
    const meta = metadata.pages.find((page) => page.file === `${params.pathname.join("/").toLowerCase()}.md`);

    const title = meta?.file === "index.md"
        ? "Wamellow"
        : meta?.name;

    return (
        <div className="w-full">

            <div className="md:flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium text-neutral-100">
                        {title} Documentation
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
                <nav className="w-full lg:w-1/4 space-y-2">

                    <ul className="space-y-1 mb-4 bg-wamellow p-2 rounded-md border border-wamellow-alpha">
                        {metadata.pages.map((page, i) =>
                            <NavButton
                                key={"nav-" + page.file + i}
                                page={page}
                            />
                        )}
                    </ul>

                    <Button
                        as={Link}
                        className="w-full !justify-start button-blurple"
                        href="/support"
                        target="_blank"
                        startContent={<BsDiscord />}
                        endContent={<HiExternalLink />}
                    >
                        Join Support
                    </Button>
                    <Button
                        as={Link}
                        className="w-full !justify-start font-medium"
                        href="/invite"
                        target="_blank"
                        color="secondary"
                        startContent={<HiUserAdd />}
                        endContent={<HiExternalLink />}
                    >
                        Invite Wamellow
                    </Button>
                    <Button
                        as={Link}
                        className="w-full !justify-start"
                        href="/profile"
                        target="_blank"
                        startContent={<HiViewGridAdd />}
                        endContent={<HiExternalLink />}
                    >
                        Dashboard
                    </Button>
                    <Link
                        className="flex items-center gap-1.5 hover:text-violet-400 duration-100"
                        href={"https://github.com/Luna-devv/mellow-web/blob/master/public/docs"}
                        target="_blank"
                    >
                        <BsGithub /> Contribute
                    </Link>
                </nav>

                <Divider className="lg:hidden" />

                {children}
            </div>

            <Footer className="mt-24" />

        </div>
    );
}

function NavButton({
    page
}: {
    page: typeof metadata.pages[0]
}) {
    const file = page.file.replace(/\.md$/, "");
    const icon = page.name.split(" ").shift() || "";
    const name = page.name.replace(icon, "");

    return (
        <li>
            <Button
                as={Link}
                className="w-full !justify-start bg-transparent hover:bg-wamellow"
                href={`/docs/${file}`}
                size="sm"
                startContent={<span>{icon}</span>}
            >
                {name}
            </Button>
        </li>
    );
}