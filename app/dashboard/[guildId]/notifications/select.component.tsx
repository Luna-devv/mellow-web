import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { cn } from "@/utils/cn";
import { PopoverClose } from "@radix-ui/react-popover";
import React, { useState } from "react";
import { BsReddit, BsTwitch, BsYoutube } from "react-icons/bs";
import { FaBluesky } from "react-icons/fa6";

import { BlueskyNotificationModal } from "./create-bluesky.component";
import { RedditNotificationModal } from "./create-reddit.component";
import { TwitchNotificationModal } from "./create-twitch.component";
import { YoutubeNotificationModal } from "./create-youtube.component";

export const Style = {
    Compact: 1,
    Big: 2
} as const;

const Platform = {
    YouTube: 0,
    Twitch: 1,
    Bluesky: 2,
    Reddit: 3
} as const;

interface Props {
    style: typeof Style[keyof typeof Style];
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;
}

export function CreateNotificationSelect({
    style,
    add,
    set
}: Props) {
    const [platform, setPlatform] = useState<typeof Platform[keyof typeof Platform] | null>(null);

    return (<>
        <PopoverWrapper
            button={
                <Button
                    className={style === Style.Compact ? cn(badgeVariants(), "h-6") : ""}
                    variant="secondary"
                >
                    Create new Notification
                </Button>
            }
            style={style}
        >
            {(platform) => (
                <Button
                    className="w-full"
                    onClick={() => setPlatform(platform)}
                >
                    <Icon type={platform} className="text-white" />
                    {Object.keys(Platform)[platform]}
                </Button>
            )}
        </PopoverWrapper>

        <YoutubeNotificationModal add={add} set={set} isOpen={platform === Platform.YouTube} onClose={() => setPlatform(null)} />
        <TwitchNotificationModal add={add} set={set} isOpen={platform === Platform.Twitch} onClose={() => setPlatform(null)} />
        <BlueskyNotificationModal add={add} set={set} isOpen={platform === Platform.Bluesky} onClose={() => setPlatform(null)} />
        <RedditNotificationModal add={add} set={set} isOpen={platform === Platform.Reddit} onClose={() => setPlatform(null)} />
    </>);
}

function PopoverWrapper({
    children,
    button,
    style
}: {
    children: (platform: typeof Platform[keyof typeof Platform]) => React.ReactNode;
    button: React.ReactNode;
    style: typeof Style[keyof typeof Style];
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {button}
            </PopoverTrigger>
            <PopoverContent
                className="space-y-2 wamellow-modal"
                align={style === Style.Compact ? "start" : "center"}
            >
                <div className="space-y-2 mb-2">
                    <h4 className="font-medium leading-none">Platform</h4>
                    <p className="text-sm text-muted-foreground">
                        Select a social to create a notify for.
                    </p>
                </div>

                {Object.values(Platform).map((platform) => (
                    <PopoverClose key={platform} asChild>
                        {children(platform)}
                    </PopoverClose>
                ))}
            </PopoverContent>
        </Popover>
    );
}

export function Icon({
    type,
    className
}: {
    type: NotificationType;
    className?: string;
}) {
    switch (type) {
        case NotificationType.YouTube: return <BsYoutube className={cn("text-red-500", className)} />;
        case NotificationType.Twitch: return <BsTwitch className={cn("text-violet-500", className)} />;
        case NotificationType.Bluesky: return <FaBluesky className={cn("text-blue-500", className)} />;
        case NotificationType.Reddit: return <BsReddit className={cn("text-orange-500", className)} />;
    }
}