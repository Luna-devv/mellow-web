"use client";

import { useState } from "react";
import { HiTrash } from "react-icons/hi";

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    guildId: string;
    id: string | null;
    name?: string;

    removeTag: (id: string) => void;
}

export default function DeleteTag({ guildId, id, name, removeTag }: Props) {

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
                <p>Delete Tag</p>
            </TooltipContent>
        </Tooltip>

        <Modal
            buttonName="Delete"
            variant="destructive"
            title={"Delete Tag: " + name}
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/tags/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            }}
            onSuccess={() => {
                if (id) removeTag(id);
            }}
        >
            Are you sure you want to delete the {"\""}{name}{"\""} tag? It will be gone forever, probably, who knows.
        </Modal>
    </>);
}