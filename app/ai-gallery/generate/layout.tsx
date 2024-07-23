import { Button } from "@nextui-org/react";
import { Metadata } from "next";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

import { Footer } from "@/components/footer";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export interface Props {
    params: { uploadId: string };
    children: React.ReactNode;
}

export const revalidate = 3600;

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {

    const title = "Generate images with your Intel® Arc™ A-Series GPU";
    const description = "Generate AI images using your Intel® Arc™ A-Series GPU with Luna-devv/intel-arc-ai installed and running locally on your machine or network.";
    const images = `${getBaseUrl()}/waya-v3.webp?v=2`;
    const url = getCanonicalUrl("ai-gallery", params.uploadId);

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
            images
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images
        }
    };
};

export default async function RootLayout({
    children
}: Props) {

    return (
        <div className="w-full space-y-12">

            {children}

            <Button
                className="!mt-5"
                as={Link}
                href="/ai-gallery"
                startContent={<HiArrowLeft />}
            >
                View all Uploads
            </Button>

            <Footer className="mt-10" />

        </div>
    );
}