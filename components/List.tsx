"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FunctionComponent } from "react";

interface Props {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
    searchParamName?: string;
    disabled: boolean;
}

export const ListTab: FunctionComponent<Props> = ({ tabs, url, searchParamName, disabled }) => {
    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    return (
        <div className="text-sm font-medium text-center border-b dark:border-wamellow-light border-wamellow-100-light mt-2 mb-6 overflow-x-scroll">
            <ul className="flex">
                {tabs.map((tab) => (
                    <li className="mr-2" key={tab.name}>
                        <button
                            className={`inline-block p-3 border-b-2 border-transparent rounded-t-lg ${(searchParamName ? (tab.value ? params.get(searchParamName) === tab.value : !tab.value && !params.get(searchParamName)) : path.endsWith(`${url}${tab.value === "/" ? "" : tab.value}`)) && "text-violet-500 border-b-2 border-violet-500"} hover:text-violet-400 duration-200 ${disabled && "cursor-not-allowed"}`}
                            onClick={() => {
                                if (disabled) return;

                                if (searchParamName) {
                                    const newparams = new URLSearchParams();

                                    if (tab.value) newparams.append(searchParamName, tab.value);
                                    else newparams.delete(searchParamName);

                                    router.push(`${url}?${newparams.toString()}`);
                                }
                                else router.push(`${url}${tab.value}`);
                            }}
                        >
                            {tab.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};