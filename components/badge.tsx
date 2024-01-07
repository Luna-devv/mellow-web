"use client";
import { FunctionComponent } from "react";

import { useTranslation } from "@/app/provider";
import cn from "@/utils/cn";

interface Props {
    before?: React.ReactNode;
    text?: string;
    translation?: string
    classname?: string;
}

const Badge: FunctionComponent<Props> = ({ before, text, classname, translation }) => {
    const { t } = useTranslation();

    return (
        <span className={cn("max-w-fit flex gap-2 items-center whitespace-nowrap rounded-full dark:bg-violet-400/40 bg-violet-600/40 px-[0.7em] pb-[0.25em] pt-[0.35em] text-center text-[0.75em] font-medium leading-none dark:text-violet-300 text-violet-700/60 ml-auto", classname)}>
            {before}
            {text || t(translation as string)}
        </span>
    );
};

export default Badge;