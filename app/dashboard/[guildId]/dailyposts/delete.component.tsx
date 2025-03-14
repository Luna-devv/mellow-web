"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { HiTrash } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import Modal from "@/components/modal";

interface Props {
    id: string | null;
    name: string;

    remove: (id: string) => void;
}

export default function DeleteDailypost({
    id,
    name,

    remove
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const [open, setOpen] = useState(false);

    return (<>
        <Tooltip
            content="Delete Dailypost"
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
                <span className="sr-only">Delete selected dailypost</span>
            </Button>
        </Tooltip>

        <Modal
            buttonName="Delete"
            variant="destructive"
            title={"Delete Dailypost: " + name}
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/dailyposts/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            }}
            onSuccess={() => {
                if (id) remove(id);
            }}
        >
            Are you sure you want to delete the {"\""}{name}{"\""} dailypost? It will be gone forever, probably, who knows.
        </Modal>
    </>);
}