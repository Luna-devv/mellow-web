"use client";

import { AvatarGroup, Badge, Button, Chip, CircularProgress, Image, Skeleton } from "@nextui-org/react";

export function ClientButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button {...props}>
            {props.children}
        </Button>
    );
}

export function ClientChip(props: React.ComponentProps<typeof Chip>) {
    return (
        <Chip {...props}>
            {props.children}
        </Chip>
    );
}

export function ClientAvatarGroup(props: React.ComponentProps<typeof AvatarGroup>) {
    return (
        <AvatarGroup {...props}>
            {props.children}
        </AvatarGroup>
    );
}

export function ClientImageWall(props: React.ComponentProps<typeof Image>) {
    return (
        <Image
            alt=""
            {...props}
        >
            {props.children}
        </Image>
    );
}

export function ClientSkeleton(props: React.ComponentProps<typeof Skeleton>) {
    return (
        <Skeleton {...props}>
            {props.children}
        </Skeleton>
    );
}

export function ClientBadge(props: React.ComponentProps<typeof Badge>) {
    return (
        <Badge {...props}>
            {props.children}
        </Badge>
    );
}

export function ClientCircularProgress(props: React.ComponentProps<typeof CircularProgress>) {
    return (
        <CircularProgress {...props}>
            {props.children}
        </CircularProgress>
    );
}