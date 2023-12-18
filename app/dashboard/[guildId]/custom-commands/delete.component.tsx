"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import { HiTrash } from "react-icons/hi";

import Modal from "@/components/modal";
import { ApiV1GuildsModulesTagsGetResponse } from "@/typings";

interface Props {
    guildId: string;
    tagId: string | null;
    name?: string;

    setTags: Dispatch<SetStateAction<ApiV1GuildsModulesTagsGetResponse[]>>;
}

export default function DeleteTag({ guildId, tagId, name, setTags }: Props) {

    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip content="Delete tag" closeDelay={0}>
                <Button
                    isIconOnly
                    color="danger"
                    onClick={() => setOpen(true)}
                    isDisabled={!tagId}
                >
                    <HiTrash className="h-5 w-5" />
                    <span className="sr-only">Delete selected tag</span>
                </Button>
            </Tooltip>

            <Modal
                buttonName="Delete"
                variant="danger"
                title={"Delete tag: " + name}
                show={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/tags/${tagId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("token") as string
                        }
                    });
                }}
                onSuccess={() => {
                    setTags((tags) => {
                        const newtags = tags?.filter((t) => t.tagId !== tagId) || [];
                        return newtags;
                    });
                }}
            >
                Are you sure you want to delete the {'"'}{name}{'"'} tag? It will be gone forever, probably, who knows.
            </Modal>
        </>
    );

}