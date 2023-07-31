import { FunctionComponent, useRef, useState } from "react";
import { HiLink } from "react-icons/hi";

export function copyToClipboard(text: string) {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
}

interface Props {
    text: string;
    title?: string;
    className: string;
}

export const CopyToClipboardButton: FunctionComponent<Props> = ({ text, title, className }) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [saved, setSaved] = useState<boolean>(false);

    return (
        <button
            onClick={() => {
                copyToClipboard(text);
                setSaved(true);

                if (timeoutRef.current) clearInterval(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setSaved(false), 1000 * 2);
            }}
            className={`flex w-full ${saved ? "bg-violet-600 hover:bg-violet-600/80 text-neutral-200" : className} dark:hover:text-white py-2 px-4 rounded-md duration-200`}
        >
            <HiLink className="relative top-1" />
            <span className="ml-2">{saved ? "Saved to clipboard" : (title || "Share link")}</span>
        </button>
    );
};