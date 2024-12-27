import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { HiUserAdd } from "react-icons/hi";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import CommandPic from "@/public/image-command.webp";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";


const montserrat = Montserrat({ subsets: ["latin"] });

interface Props {
    children: React.ReactNode;
}

export const revalidate = 3600;

export const generateMetadata = (): Metadata => {

    const title = "Free /image Ai for Discord";
    const description = "Summon the enchantment of AI generated images to your Discord server with our versatile /image command, featuring over 40+ distinct SD and 10+ SDXL models.";
    const url = getCanonicalUrl("ai-gallery");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/waya-v3.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.webp`
        }
    };
};

export default function RootLayout({
    children
}: Props) {

    return (<>

        <h1 className={cn(montserrat.className, "lg:text-5xl text-4xl font-bold dark:text-neutral-100 text-neutral-900 break-words mb-2 w-full")}>
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">/image Ai</span>
            {" generated in "}
            <span className="underline decoration-blurple break-keep">Discord</span>
        </h1>

        {children}

        <Link
            href="/login?invite=true"
            prefetch={false}
            target="_blank"
        >
            <Image
                alt="/image command usage"
                className="w-full rounded-md shadow-md mt-12"
                height={580}
                src={CommandPic}
                width={1550}
            />
        </Link>

        <div className="flex gap-2 m-4 w-full">
            <Button
                asChild
                className="w-1/2 lg:w-fit text-lg font-medium"
                variant="secondary"
            >
                <Link
                    prefetch={false}
                    href="/login?invite=true"
                >
                    <HiUserAdd />
                    <span className="block sm:hidden">Invite</span>
                    <span className="hidden sm:block">Invite Wamellow</span>
                </Link>
            </Button>
            <Button
                asChild
                className="w-1/2 lg:w-fit text-lg"
            >
                <Link
                    prefetch={false}
                    href="/support"
                >
                    <HiUserAdd />
                    <span className="block sm:hidden">Support</span>
                    <span className="hidden sm:block">Join Support</span>
                </Link>
            </Button>
        </div>

        <Footer />

    </>);
}