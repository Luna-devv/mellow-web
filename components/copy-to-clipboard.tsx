"use client";

import { useRef, useState } from "react";

import { Button } from "./ui/button";

interface Props {
    icon?: React.ReactNode;
    text: string;
    title?: string;
    needsWait?: boolean;
}

export function CopyToClipboardButton({
    icon,
    text,
    title
}: Props) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [saved, setSaved] = useState<boolean>(false);

    function handleCopy(t: string) {
        navigator.clipboard.writeText(t);
        setSaved(true);

        if (timeoutRef.current) clearInterval(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setSaved(false), 1000 * 2);
    }

    return (
        <Button
            className="w-full !justify-start truncate"
            variant={saved
                ? "secondary"
                : undefined
            }
            onClick={() => handleCopy(text)}
        >
            {icon}
            {saved
                ? "Copied to clipboard"
                : (title || "Copy to clipboard")
            }
        </Button>
    );
}