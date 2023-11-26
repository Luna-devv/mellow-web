import { FunctionComponent } from "react";

interface Props {
    text: string
}

const Badge: FunctionComponent<Props> = ({ text }) => {
    return (
        <span className="inline-block whitespace-nowrap rounded-full dark:bg-violet-400/40 bg-violet-600/40 px-[0.7em] pb-[0.25em] pt-[0.35em] text-center text-[0.75em] font-medium leading-none dark:text-violet-300 text-violet-700/60 ml-auto">
            {text}
        </span>
    );
};

export default Badge;