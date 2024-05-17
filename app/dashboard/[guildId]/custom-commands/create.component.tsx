"use client";

import { Button, Chip } from "@nextui-org/react";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";

import DumbTextInput from "@/components/inputs/dumb-text-input";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesTagsGetResponse } from "@/typings";

export enum Style {
    Compact = 1,
    Big = 2
}

interface Props {
    guildId: string;
    style: Style;

    addTag: (tag: ApiV1GuildsModulesTagsGetResponse) => void;
    setTagId: (id: string) => void;
}

export default function CreateTag({ guildId, style, addTag, setTagId }: Props) {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    return (
        <>
            {style === Style.Compact
                ?
                <Chip
                    as={Button}
                    className="default"
                    variant="faded"
                    onClick={() => setOpen(true)}
                    startContent={<HiPencil className="relative left-1 ml-1" />}
                >
                    Create
                </Chip>
                :
                <Button
                    color="secondary"
                    onClick={() => setOpen(true)}
                    startContent={<HiPencil />}
                >
                    Create new tag
                </Button>
            }

            <Modal<ApiV1GuildsModulesTagsGetResponse>
                title="Create new tag"
                show={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/tags`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: name || "new-tag" })
                    });
                }}
                onSuccess={(tag) => {
                    addTag(tag);
                    setTagId(tag.id);
                }}
            >
                <DumbTextInput
                    name="Name"
                    placeholder="new-tag"
                    value={name}
                    setValue={setName}
                    max={32}
                />
            </Modal>
        </>
    );

}