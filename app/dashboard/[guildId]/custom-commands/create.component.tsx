"use client";
import { Button, Chip } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import { HiPencil } from "react-icons/hi";

import DumbTextInput from "@/components/inputs/Dumb_TextInput";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesTagsGetResponse } from "@/typings";

export enum Style {
    Compact = 1,
    Big = 2
}

interface Props {
    guildId: string;
    style: Style;

    setTags: Dispatch<SetStateAction<ApiV1GuildsModulesTagsGetResponse[]>>;
    setTagId: (id: string) => void;
}

export default function CreateTag({ guildId, style, setTags, setTagId }: Props) {

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
                        headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("token") as string
                        },
                        body: JSON.stringify({ name: name || "new-tag" })
                    });
                }}
                onSuccess={(tag) => {
                    setTags((tags) => {
                        return [tag, ...tags];
                    });
                    setTagId(tag.tagId);
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