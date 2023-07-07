import Link from "next/link";
import { FunctionComponent } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamationCircle } from "react-icons/hi";

const ErrorBanner: FunctionComponent<{ message: string, removeButton?: boolean }> = ({ message, removeButton }) => {
    return (
        <span className="w-full text-neutral-100 bg-danger-dark py-3 px-5 mb-6 rounded-md flex gap-2 items-center">
            <HiExclamationCircle style={{ height: 20, width: 20 }} />
            <div className="text-md">{message}</div>

            {!removeButton &&
                <Link href="/support" className="ml-auto flex bg-wamellow hover:bg-blurple hover:text-white py-2 px-4 rounded-md duration-200">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Support</span>
                </Link>
            }

        </span>
    );
};

export default ErrorBanner;