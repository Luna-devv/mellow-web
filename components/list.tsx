"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import decimalToRgb from "@/utils/decimalToRgb";

interface ListProps {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
    searchParamName?: string;
    disabled: boolean;

    children?: React.ReactNode
}

export function ListTab({ tabs, url, searchParamName, disabled, children }: ListProps) {
    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    function handleChange(key: unknown) {
        if (!key && typeof key !== "string") return;

        if (!searchParamName) {
            router.push(`${url}${key}`);
            return;
        }

        const newparams = new URLSearchParams();

        if (key) newparams.append(searchParamName, key as string);
        else newparams.delete(searchParamName);

        router.push(`${url}?${newparams.toString()}`);
    }

    return (
        <div className="font-medium mt-2 mb-6">
            <Tabs
                className="flex"
                classNames={{
                    tabList: "w-full relative rounded-none p-0 border-b border-divider",
                    tab: "w-fit px-4 h-12 relative right-2.5"
                }}
                defaultSelectedKey={searchParamName
                    ? (params.get(searchParamName) || "")
                    : path.split(url)[1].split("/").slice(0, 2).join("/")
                }
                onSelectionChange={handleChange}
                variant="underlined"
                color="secondary"
                isDisabled={disabled}
            >
                {tabs.map((tab) =>
                    <Tab
                        key={tab.value}
                        title={
                            <div className="flex items-center space-x-2">
                                {tab.icon}
                                <span>{tab.name}</span>
                            </div>
                        }
                    />
                )}
                {children && <li className="ml-auto">{children}</li>}
            </Tabs>
        </div>
    );

}

interface FeatureProps {
    items: {
        title: string;
        description: string;
        icon: React.ReactNode;
        color: number;
    }[]
}

export function ListFeature({ items }: FeatureProps) {

    return (
        <div className="grid gap-6 grid-cols-2">
            {items.map((item, i) => {

                const rgb = decimalToRgb(item.color);

                return (
                    <div
                        className="flex items-center gap-3"
                        key={"featurelist-" + item.description.replace(/ +/g, "") + i}
                    >
                        <div className="rounded-full h-12 aspect-square p-[10px] svg-max" style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`, color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` }}>
                            {item.icon}
                        </div>
                        <span className="text-neutral-300">{item.description}</span>
                    </div>
                );

            })}
        </div>
    );

}