"use client";

import { cn } from "@/utils/cn";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type Image from "next/image";
import * as React from "react";

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "bg-muted relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

function UserAvatar({
    src,
    username,
    className,
    alt,
    ...props
}: {
    src: string;
    username?: string | null;
    alt: string;
} & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
    return (
        <Avatar
            className={cn("rounded-full", className)}
            {...props}
        >
            <AvatarImage alt={alt} src={src} />
            <AvatarFallback>{(username || "Wamellow").toLowerCase().slice(0, 2)}</AvatarFallback>
        </Avatar>
    );
}

function AvatarGroup({
    children,
    className,
    ...props
}: {
    children: ReturnType<typeof UserAvatar>[];
} & React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            className={cn("flex", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function AvatarBadge({
    className,
    children,
    content
}: {
    className?: string;
    children: ReturnType<typeof Image> | ReturnType<typeof UserAvatar>;
    content: React.ReactNode;
}) {
    return (
        <div className="relative inline-flex shrink-0">
            {children}
            <div className={cn("flex z-10 flex-wrap absolute rounded-full whitespace-nowrap place-content-center origin-center items-center select-none subpixel-antialiased bottom-[5%] left-[5%] -translate-x-1/2 translate-y-1/2 aspect-square overflow-hidden size-6", className)}>
                {content}
            </div>
        </div>
    );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarImage, UserAvatar };