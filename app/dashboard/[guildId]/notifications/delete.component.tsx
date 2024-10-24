"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { HiTrash } from "react-icons/hi";

import Modal from "@/components/modal";

interface Props {
    guildId: string;
    id: string | null;
    name?: string;

    removeNotification: (id: string) => void;
}

export default function DeleteNotification({
    guildId,
    id,
    name,

    removeNotification
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip
                content="Delete Notification"
                closeDelay={0}
            >
                <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    onClick={() => setOpen(true)}
                    isDisabled={!id}
                >
                    <span>
                        <HiTrash />
                    </span>
                    <span className="sr-only">Delete selected notification</span>
                </Button>
            </Tooltip>

            <Modal
                buttonName="Delete"
                variant="danger"
                title={"Delete Notification: " + name}
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                }}
                onSuccess={() => {
                    if (id) removeNotification(id);
                }}
            >
                Are you sure you want to delete the {'"'}{name}{'"'} channel from posting notifications? It will be gone forever, probably, who knows.
            </Modal>
        </>
    );

}