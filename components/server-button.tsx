"use client";

import { Button } from "@nextui-org/react";

export function ServerButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button
            {...props}
        >
            {props.children}
        </Button>
    );
}