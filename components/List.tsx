import React, { FunctionComponent } from "react";

interface Props {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    stateHook: React.Dispatch<React.SetStateAction<string>>;
    state: string;
}

export const ListTab: FunctionComponent<Props> = ({ tabs, stateHook, state }) => {
    return (
        <div className="text-sm font-medium text-center border-b border-wamellow-light">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                    <li className="mr-2" key={tab.name}>
                        <button className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${state === tab.value ? "text-violet-500 border-b-2 border-violet-500" : ""} hover:text-violet-400 duration-200 drop-shadow-lg`} onClick={() => stateHook(tab.value)}>{tab.name}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};