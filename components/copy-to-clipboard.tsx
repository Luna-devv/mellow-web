"use client";

import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

interface Props {
    icon?: React.ReactNode;
    text: string;
    title?: string;
    className?: string;
    items?: { icon?: React.ReactNode, name: string, description?: string, text: string }[];
    needsWait?: boolean;
}

export function CopyToClipboardButton({
    icon,
    text,
    title,
    className,
    items
}: Props) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [saved, setSaved] = useState<boolean>(false);

    function handleCopy(t: string) {
        navigator.clipboard.writeText(t);
        setSaved(true);

        if (timeoutRef.current) clearInterval(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setSaved(false), 1000 * 2);
    };

    return (
        <ButtonGroup
            className={className}
        >

            <Button
                className="w-full !justify-start"
                color={
                    saved
                        ? "secondary"
                        : undefined
                }
                onClick={() => handleCopy(text)}
                startContent={icon}
            >
                {saved
                    ? "Copied to clipboard"
                    : (title || "Copy to clipboard")
                }
            </Button>

            {items &&
                <Dropdown
                    placement="bottom-end"
                    className="backdrop-blur-xl backdrop-brightness-50"
                >
                    <DropdownTrigger>
                        <Button
                            className={className}
                            color={
                                saved
                                    ? "secondary"
                                    : undefined
                            }
                            isIconOnly
                        >
                            <HiChevronDown />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded">
                        {items.map((item, i) => (
                            <DropdownItem
                                key={i}
                                className="backdrop-blur-md backdrop-brightness-75"
                                closeOnSelect
                                onClick={() => handleCopy(item.text)}
                                description={item.description}
                                showDivider={i !== (items?.length || 0) - 1}
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
}