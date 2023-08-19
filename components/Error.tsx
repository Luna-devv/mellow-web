import Link from "next/link";
import { FunctionComponent } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamationCircle } from "react-icons/hi";

interface Props {
    message: string;
    removeButton?: boolean;
    type?: "error" | "info"
}

const ErrorBanner: FunctionComponent<Props> = ({ message, removeButton, type }) => {
    return (
        <span className={`w-full text-neutral-100 ${type === "info" ? "bg-blue-400/40" : "bg-red-400/40"} py-2 px-4 mb-6 rounded-md flex gap-2 items-center`}>
            <HiExclamationCircle style={{ height: 20, width: 20 }} />
            <div className="text-lg">{message}</div>

            {!removeButton &&
                <Link href="/support" className={`ml-auto flex ${type === "info" ? "bg-blue-400/50 hover:bg-blue-400" : "bg-red-400/50 hover:bg-red-400"} hover:text-white py-2 px-4 rounded-md duration-200`}>
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Support</span>
                </Link>
            }

        </span>
    );
};

export default ErrorBanner;