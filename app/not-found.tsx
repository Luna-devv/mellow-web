
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiArrowNarrowLeft } from "react-icons/hi";

import ErrorBanner from "@/components/Error";

export default function NotFound() {
    return (
        <div className="w-full">
            <ErrorBanner message={"Page could not be found"} removeButton={true} />
            <div className="ml-1 relative bottom-4 flex gap-2">
                <Link href="/" className="text-blurple hover:opacity-80 dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center">
                    <HiArrowNarrowLeft />
                    <span className="ml-1">Home</span>
                </Link>
                <Link href="/support" className="text-blurple hover:opacity-80 dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-1 px-2 rounded-md duration-200 flex items-center">
                    <BsDiscord />
                    <span className="ml-2">Support</span>
                </Link>
            </div>
        </div>
    );
}