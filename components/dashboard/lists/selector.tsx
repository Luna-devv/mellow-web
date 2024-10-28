"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { HiExternalLink, HiPencil } from "react-icons/hi";

import { Guild, guildStore } from "@/common/guilds";
import cn from "@/utils/cn";

interface TBase {
    id: string;
}

interface ButtonCreateOptions {
    style: 1 | 2;
}

interface ButtonDeleteOptions {
    id: string;
    name: string;
}

interface Props<T extends TBase> {
    items: T[];

    set: (id: string) => void;
    sort: (a: T, b: T) => number;
    name: (item: T) => string;

    docs: `/${string}`;

    /**
     * Item create button.
     */
    createButton: (options: ButtonCreateOptions) => React.ReactNode;
    /**
     * Item delete button.
     */
    deleteButton: (options: ButtonDeleteOptions) => React.ReactNode;
    /**
     * The induvidual item.
     */
    item: (item: T, guild: Guild) => React.ReactNode;

    /**
     * Displayed whenever the list is empty.
     */
    children: React.ReactNode;
}

export function ItemSelector<T extends TBase>({
    items,

    set,
    sort,
    name,

    docs,

    createButton,
    deleteButton,
    item,

    children
}: Props<T>) {
    const guild = guildStore((g) => g);

    if (!guild) return <></>;

    return (<>
        <div className="flex flex-col gap-2">
            {items
                .sort(sort)
                .map((i) => (
                    <Item
                        key={i.id}
                        buttons={<>
                            <Button
                                color="secondary"
                                variant="flat"
                                onClick={() => set(i.id)}
                                startContent={<HiPencil />}
                            >
                                Edit
                            </Button>
                            {deleteButton({
                                id: i.id,
                                name: name(i)
                            })}
                        </>}
                    >
                        {item(i, guild)}
                    </Item>
                ))
            }
        </div>

        <div className={cn("flex items-start justify-between gap-2 w-full", items.length && "mt-3")}>
            {createButton({ style: 1 })}

            <Button
                as={Link}
                className="w-full md:w-[unset]"
                href={`/docs/${docs}`}
                target="_blank"
                endContent={<HiExternalLink />}
            >
                Read docs & view placeholders
            </Button>
        </div>

        {!items.length && children}
    </>);
}

function Item({
    buttons,
    children
}: {
    buttons: React.ReactNode;
    children: React.ReactNode;
}) {

    return (
        <div className="flex justify-between p-4 bg-wamellow rounded-xl w-full duration-100">
            <div className="flex gap-3 items-center">
                {children}
            </div>

            <div className="space-x-2">
                {buttons}
            </div>
        </div>
    );
}