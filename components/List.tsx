"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import cn from "@/utils/cn";
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
    const path = usePathname().split(`${url}/`)[1];
    const params = useSearchParams();
    const router = useRouter();

    return (
        <div className="text-sm font-medium text-center border-b dark:border-wamellow-light border-wamellow-100-light mt-2 mb-6 overflow-x-scroll scrollbar-none">
            <ul className="flex">
                {tabs.map((tab, i) => {
                    let isCurrent = false;
                    if (searchParamName) isCurrent = tab.value ? params.get(searchParamName) === tab.value : !tab.value && !params.get(searchParamName);
                    isCurrent ||= (!path && tab.value === "/") || path?.startsWith(tab.value !== "/" ? tab.value.slice(1) : tab.value);

                    return (
                        <li className="mr-2" key={"tablist-" + url + tab.name + i}>
                            <button
                                className={cn(
                                    "inline-block p-3 pb-2 border-b-2 border-transparent rounded-t-lg font-medium hover:text-violet-400 duration-200",
                                    isCurrent && "text-violet-500 border-b-2 border-violet-500",
                                    disabled && "cursor-not-allowed opacity-75"
                                )}
                                onClick={() => {
                                    if (disabled) return;
                                    if (!searchParamName) return router.push(`${url}${tab.value}`);

                                    const newparams = new URLSearchParams();

                                    if (tab.value) newparams.append(searchParamName, tab.value);
                                    else newparams.delete(searchParamName);

                                    router.push(`${url}?${newparams.toString()}`);
                                }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: tab.name.replace(/ +/g, "&nbsp;") }} />
                            </button>
                        </li>
                    );

                })}
                {children && <li className="ml-auto">{children}</li>}
            </ul>
        </div >
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