"use client";

import { AvatarIcon, AvatarProps as BaseAvatarProps, useAvatar } from "@nextui-org/react";
import Image from "next/image";
import { forwardRef, useMemo } from "react";

export type AvatarProps = BaseAvatarProps

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(({ src: source,...props }, ref) => {
    const {
        src,
        icon = <AvatarIcon />,
        alt,
        classNames,
        slots,
        name,
        showFallback,
        fallback: fallbackComponent,
        getInitials,
        getAvatarProps,
        getImageProps
    } = useAvatar({
        ref,
        src: source?.replace(/size=\d{1,4}/, "size=16"),
        ...props
    });

    const fallback = useMemo(() => {
        if (!showFallback && src) return null;

        const ariaLabel = alt || name || "avatar";

        if (fallbackComponent) {
            return (
                <div
                    aria-label={ariaLabel}
                    className={slots.fallback({ class: classNames?.fallback })}
                    role="img"
                >
                    {fallbackComponent}
                </div>
            );
        }

        return name
            ? <span aria-label={ariaLabel} className={slots.name({ class: classNames?.name })} role="img">
                {getInitials(name)}
            </span>
            : <span aria-label={ariaLabel} className={slots.icon({ class: classNames?.icon })} role="img">
                {icon}
            </span>;
    }, [showFallback, src, fallbackComponent, name, classNames]);

    return (
        <div {...getAvatarProps()}>
            {src && <Image {...getImageProps()} src={source as string} alt={alt} width={64} height={64} />}
            {fallback}
        </div>
    );
});

Avatar.displayName = "MyAvatar";
