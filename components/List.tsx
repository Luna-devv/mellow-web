import { usePathname, useRouter } from "next/navigation";
import React, { FunctionComponent } from "react";

interface Props {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
    disabled: boolean;
}

export const ListTab: FunctionComponent<Props> = ({ tabs, url, disabled }) => {
    const path = usePathname();
    const router = useRouter();

    return (
        <div className="text-sm font-medium text-center border-b dark:border-wamellow-light border-wamellow-100-light mt-3 mb-6">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                    <li className="mr-2" key={tab.name}>
                        <button
                            className={`inline-block p-3 border-b-2 border-transparent rounded-t-lg ${path.endsWith(`${url}${tab.value === "/" ? "" : tab.value}`) && "text-violet-500 border-b-2 border-violet-500"} hover:text-violet-400 duration-200 drop-shadow-lg ${disabled && "cursor-not-allowed"}`}
                            onClick={() => { if (!disabled) router.push(`${url}${tab.value}`); }}
                        >
                            {tab.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};