"use client";
import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { FunctionComponent, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

import cn from "@/utils/cn";

export async function copyToClipboard(text: string, needsWait?: boolean) {
    if (needsWait) await new Promise((r) => setTimeout(r, 600));
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
}

interface Props {
    icon?: React.ReactNode;
    text: string;
    title?: string;
    className?: string;
    items?: { icon?: React.ReactNode, name: string, description?: string, text: string }[];
}

export const CopyToClipboardButton: FunctionComponent<Props> = ({ icon, text, title, className = "", items }) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [saved, setSaved] = useState<boolean>(false);

    const handleCopy = (t: string) => {
        copyToClipboard(t);
        setSaved(true);

        if (timeoutRef.current) clearInterval(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setSaved(false), 1000 * 2);
    };

    return (
        <ButtonGroup>

            <Button
                className={cn(saved ? "violet" : className + " ")}
                onClick={() => handleCopy(text)}
                startContent={icon}
            >
                {saved ? "Copied to clipboard!" : (title || "Copy to clipboard")}
            </Button>

            {items &&
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Button className={saved ? "violet" : cn(className, "dark:hover:bg-wamellow-light hover:bg-wamellow-100-light")} isIconOnly><HiChevronDown /></Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded">

                        {items.map((item, i) => (
                            <DropdownItem
                                onClick={() => handleCopy(item.text)}
                                showDivider={i !== (items?.length || 0) - 1}
                                // closeOnSelect
                                key={i}
                                description={item.description}
                                startContent={item.icon}
                            >
                                {item.name}
                            </DropdownItem>
                        ))}

                    </DropdownMenu>
                </Dropdown>
            }

        </ButtonGroup>
    );
};