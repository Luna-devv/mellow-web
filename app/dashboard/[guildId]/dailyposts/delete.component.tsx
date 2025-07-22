"use client";

import { useState } from "react";
import { HiTrash } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    className="size-9 p-1.5"
                    variant="destructive"
                    onClick={() => setOpen(true)}
                    disabled={!id}
                >
                    <HiTrash />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Delete Dailypost</p>
            </TooltipContent>
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