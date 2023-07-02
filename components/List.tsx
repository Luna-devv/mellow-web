import { useRouter } from "next/navigation";
import React, { FunctionComponent, useState } from "react";

interface Props {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
}

export const ListTab: FunctionComponent<Props> = ({ tabs, url }) => {
    const [state, setState] = useState<string>("/");
    const router = useRouter();

    return (
        <div className="text-sm font-medium text-center border-b border-wamellow-light my-3">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                    <li className="mr-2" key={tab.name}>
                        <button
                            className={`inline-block p-3 border-b-2 border-transparent rounded-t-lg ${state === tab.value ? "text-violet-500 border-b-2 border-violet-500" : ""} hover:text-violet-400 duration-200 drop-shadow-lg`}
                            onClick={() => {
                                setState(tab.value);
                                router.push(`${url}${tab.value}`);
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