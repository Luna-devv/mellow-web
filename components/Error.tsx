import Link from "next/link";
import { FunctionComponent } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiArrowNarrowLeft, HiOutlineExclamation, HiOutlineExclamationCircle } from "react-icons/hi";

export const Error: FunctionComponent<{ message: string }> = ({ message }) => {
    return (
        <span className="w-160 max-w-full text-slate-100 bg-danger-dark border-l-danger border-l-4 py-4 px-6 rounded-md">
            <div className="flex gap-2 items-center">
                <HiOutlineExclamation style={{ height: 30, width: 30 }} />
                <strong className="text-3xl font-semibold">Something went wrong..</strong>
            </div>
            <div className="text-lg">{message}</div>

            <div className="mt-6 flex gap-4">

                <Link href="/" className="flex bg-wamellow hover:bg-wamellow-light hover:text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                    <HiArrowNarrowLeft className="relative top-1" />
                    <span className="ml-2">Home</span>
                </Link>

                <Link href="/support" className="flex bg-wamellow hover:bg-blurple hover:text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Support</span>
                </Link>

            </div>
        </span>
    );
};

export const ErrorBanner: FunctionComponent<{ message: string }> = ({ message }) => {
    return (
        <span className="w-full text-slate-100 bg-danger-dark border-l-danger border-l-4 py-4 px-6 mb-6 rounded-md flex gap-2 items-center">
            <HiOutlineExclamationCircle style={{ height: 20, width: 20 }} />
            <div className="text-md">{message}</div>
            <Link href="/support" className="ml-auto flex bg-wamellow hover:bg-blurple hover:text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg">
                <BsDiscord className="relative top-1" />
                <span className="ml-2">Support</span>
            </Link>
        </span>
    );
};