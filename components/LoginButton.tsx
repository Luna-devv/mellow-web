import Link from "next/link";
import { FunctionComponent } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation } from "react-icons/hi";
import { BounceLoader } from "react-spinners";

const LoginButton: FunctionComponent<{ loginstate: "LOADING" | "ERRORED" | undefined, width: number, message?: string }> = ({ loginstate, width, message }) => {
    return (
        <Link href="/login" className={`ml-auto flex ${loginstate === "ERRORED" ? "bg-danger" : "bg-wamellow"} hover:bg-blurple ${loginstate === "ERRORED" ? "" : "hover:"}text-white py-2 px-4 rounded-md duration-200 drop-shadow-lg`}>
            {!loginstate && <BsDiscord className="relative top-1" />}
            {loginstate === "ERRORED" && <HiExclamation className="relative top-1 h-5 w-5" />}
            {loginstate === "LOADING" && <BounceLoader size={20} color="#80848e" className="relative top-[1.5px]" />}

            {!loginstate && <span className="ml-2">{message || (width > 550 ? "Login with Discord" : "Discord Login")}</span>}
            {loginstate === "ERRORED" && <span className="ml-2">Authorization failed</span>}
        </Link>
    );
};

export default LoginButton;