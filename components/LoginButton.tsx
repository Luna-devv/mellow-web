import Link from "next/link";
import { FunctionComponent } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation } from "react-icons/hi";
import { TailSpin } from "react-loading-icons";

interface Props {
    loginstate?: "LOADING" | "ERRORED" | undefined;
    width: number;
    message?: string
    className?: string;
    addClassName?: string;
}

const LoginButton: FunctionComponent<Props> = ({ loginstate, width, message, className, addClassName }) => {
    return (
        <div className={className || "ml-auto"}>
            <Link href="/login" className={`relative flex ${loginstate === "ERRORED" ? "bg-danger" : "dark:bg-wamellow bg-wamellow-100"} hover:bg-blurple hover:text-white ${loginstate === "ERRORED" && "hover:"} py-2 px-4 rounded-md duration-200 ${addClassName}`}>
                {!loginstate && <BsDiscord className="relative top-1" />}
                {loginstate === "ERRORED" && <HiExclamation className="relative top-1 h-5 w-5" />}
                {loginstate === "LOADING" && <div className="pl-6"><TailSpin stroke="#d4d4d4" className="absolute top-[11px] left-2 h-5" /></div>}

                {(!loginstate || loginstate === "LOADING") && <span className="ml-2">{message || (width > 550 ? "Login with Discord" : "Discord Login")}</span>}
                {loginstate === "ERRORED" && <span className="ml-2">Authorization failed</span>}
            </Link>
        </div>
    );
};

export default LoginButton;