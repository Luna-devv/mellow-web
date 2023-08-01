import { FunctionComponent, useRef, useState } from "react";
import { HiChevronDown, HiLink } from "react-icons/hi";

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
    className?: string;
    items?: { icon?: React.ReactNode, name: string, text: string }[];
}

export const CopyToClipboardButton: FunctionComponent<Props> = ({ text, title, className, items }) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [saved, setSaved] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="relative">

            <div className="flex rounded-md overflow-hidden">

                <button
                    onClick={() => {
                        copyToClipboard(text);
                        setSaved(true);

                        if (timeoutRef.current) clearInterval(timeoutRef.current);
                        timeoutRef.current = setTimeout(() => setSaved(false), 1000 * 2);
                    }}
                    className={`peer/share flex w-full ${saved ? "bg-violet-500 hover:bg-violet-500/80 text-neutral-200" : (className || "dark:bg-wamellow bg-wamellow-100 dark:hover:bg-wamellow-light hover:bg-wamellow-100-light")} dark:hover:text-white py-2 px-4 ${items && "pr-1"} duration-200`}
                >
                    <HiLink className="relative top-1" />
                    <span className="ml-2">{saved ? "Saved to clipboard" : (title || "Share link")}</span>
                </button>

                {(items && !className) &&
                    <button
                        onClick={() => setOpen(!open)}
                        className={`flex items-center justify-center pr-2 pl-1 ${saved ? "bg-violet-500 peer-hover/share:bg-violet-500/80 hover:bg-violet-600/80 text-neutral-200" : "dark:bg-wamellow bg-wamellow-100 dark:peer-hover/share:bg-wamellow-light peer-hover/share:bg-wamellow-100-light dark:hover:bg-wamellow-light hover:bg-wamellow-100-light"} duration-200`}
                    >
                        <HiChevronDown />
                    </button>
                }

            </div>

            {
                (items && !className) && open &&
                <div className="dark:bg-wamellow bg-wamellow-100 overflow-hidden shadow-md absolute top-11 right-0 w-56 rounded-md text-base">
                    {items.map((item) => (
                        <button
                            onClick={() => {
                                setOpen(false);
                                copyToClipboard(item.text);
                                setSaved(true);

                                if (timeoutRef.current) clearInterval(timeoutRef.current);
                                timeoutRef.current = setTimeout(() => setSaved(false), 1000 * 2);
                            }}
                            key={item.name}
                            className="dark:hover:bg-wamellow-alpha hover:bg-wamellow-100-alpha py-3 px-4 w-full duration-200 flex items-center gap-2"
                        >
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </div>
            }

        </div >
    );
};