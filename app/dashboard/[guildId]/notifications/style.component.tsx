"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { HiOutlineUpload, HiPencil, HiSparkles, HiX } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import DiscordMessage from "@/components/discord/message";
import DumbTextInput from "@/components/inputs/dumb-text-input";
import Modal from "@/components/modal";
import { Section } from "@/components/section";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function NotificationStyle({
    item,
    premium,
    onEdit
}: {
    item: ApiV1GuildsModulesNotificationsGetResponse;
    premium: boolean;
    onEdit: (opts: { name: string; avatarUrl: string | null; }) => void;
}) {
    const [open, setOpen] = useState(false);

    return (<>
        <div className="w-full relative overflow-hidden rounded-lg border border-border group p-px mt-5">
            <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_0%_50%,#8b5cf6_50%,var(--wamellow-rgb)_100%)]" />

            <div className="backdrop-blur-3xl backdrop-brightness-[25%] rounded-[6px] pr-4 py-4 pl-6 md:py-8 md:pl-10 flex gap-6 items-center">
                <UserAvatar
                    alt={premium && item.style ? (item.style.name || "") : "Wamellow"}
                    className="size-24"
                    src={premium && item.style ? (item.style.avatarUrl || "/discord.webp") : "/waya-v3.webp"}
                />

                <div className="space-y-2">
                    <span className="text-3xl font-medium text-primary-foreground">
                        {premium && item.style ? (item.style.name || "Unknown") : "Wamellow"}
                    </span>
                    {premium
                        ? <Button onClick={() => setOpen(true)}>
                            <HiPencil />
                            Change Style
                        </Button>
                        : <Button asChild>
                            <Link
                                href={`/premium?utm_source=${window.location.hostname}&utm_medium=notification-styles`}
                                target="_blank"
                            >
                                <HiSparkles />
                                Change Style
                            </Link>
                        </Button>
                    }
                </div>

                <ExampleMessages />
            </div>
        </div>

        <ChangeStyleModal
            id={item.id}
            username={item.style?.name || null}
            avatarUrl={item.style?.avatarUrl || null}

            isOpen={open}
            onClose={() => setOpen(false)}
            onEdit={(style) => onEdit(style)}
        />
    </>);
}

function ExampleMessages() {
    return (
        <div className="w-full relative">
            <ExampleMessage className="bottom-0 right-0 rotate-2" username="Kurzgesagt" avatarUrl="https://yt3.googleusercontent.com/ytc/AIdro_n1Ribd7LwdP_qKtqWL3ZDfIgv9M1d6g78VwpHGXVR2Ir4=s176-c-k-c0x00ffffff-no-rj-mo" />
            <ExampleMessage className="top-0 right-0" username="DarkViperAU" avatarUrl="https://yt3.googleusercontent.com/ytc/AIdro_lpNK9jpdw9D63LuUYt3SLbFpIQ5yD4DV0D5mwPrCp7cEw=s176-c-k-c0x00ffffff-no-rj-mo" />
        </div>
    );
}

function ExampleMessage({ className, username, avatarUrl }: { className?: string; username?: string; avatarUrl?: string; }) {
    return (
        <div className={cn("bg-discord-gray px-3 py-2 rounded-lg w-full max-w-sm absolute border border-wamellow shadow-lg", className)}>
            <DiscordMessage
                mode="DARK"
                user={{
                    username: username || "Wamellow",
                    avatar: avatarUrl || "/waya-v3.webp",
                    bot: true
                }}
            >
                Woooooooo!
            </DiscordMessage>
        </div>
    );
}

function isValidUsername(value: string | null): boolean {
    if (!value) return false;
    if (value.length < 2 || value.length > 32) return false;
    if (["everyone", "here"].includes(value.toLowerCase())) return false;
    if (/@|#|:|```|discord|clyde/i.test(value)) return false;
    return true;
}

interface Props {
    id: string;
    username: string | null;
    avatarUrl: string | null;

    isOpen: boolean;
    onClose: () => void;
    onEdit: (opts: { name: string; avatarUrl: string | null; }) => void;
}

export function ChangeStyleModal({
    id,
    username,
    avatarUrl,

    isOpen,
    onClose,
    onEdit
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const avatarRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState(username);
    const [avatar, setAvatar] = useState<string | null>(avatarUrl);
    const [error, setError] = useState<string | null>(null);

    return (<>
        <Modal<ApiV1GuildsModulesNotificationsGetResponse>
            title="Edit Notification Style"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => {
                const valid = isValidUsername(name);
                if (!valid) return new Error("Invalid name");

                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}/style`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        avatar: avatar?.startsWith("data:") ? avatar : null
                    })
                });
            }}
            onSuccess={() => {
                onEdit({ name: name!, avatarUrl: avatar! });
            }}
            isDisabled={!name || Boolean(error)}
        >
            <DumbTextInput
                name="Username"
                placeholder="DarkViperAU"
                value={name}
                setValue={setName}
            />

            <input
                accept={ALLOWED_FILE_TYPES.join()}
                className="hidden"
                onChange={(e) => {
                    setAvatar(null);

                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                        setError(`File type must be one of ${ALLOWED_FILE_TYPES.join(", ")}`);
                        return;
                    }

                    if (file.size > MAX_FILE_SIZE) {
                        setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MiB`);
                        return;
                    }

                    const reader = new FileReader();

                    reader.onload = () => {
                        if (typeof reader.result === "string") {
                            setAvatar(reader.result);
                        }
                    };

                    reader.onerror = () => {
                        setError("Failed to read the file.");
                    };

                    reader.readAsDataURL(file);
                }}
                ref={avatarRef}
                type="file"
            />

            <div className="flex">
                <Button onClick={() => avatarRef.current?.click()}>
                    <HiOutlineUpload />
                    Upload Avatar
                </Button>
                {avatar && (
                    <Button
                        className="text-red-400"
                        variant="link"
                        onClick={() => setAvatar(null)}
                    >
                        <HiX />
                        Remove Avatar
                    </Button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <Section tight title="Preview">
                <div className="bg-discord-gray px-3 py-2 mt-1 rounded-lg w-full">
                    <DiscordMessage
                        mode="DARK"
                        user={{
                            username: name || "Wamellow",
                            avatar: avatar || "/waya-v3.webp",
                            bot: true
                        }}
                    >
                        Woooooooo!
                    </DiscordMessage>
                </div>
            </Section>

        </Modal>
    </>);
}