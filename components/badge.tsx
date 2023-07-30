import { FunctionComponent } from "react";

interface Props {
    text: string
}

const Badge: FunctionComponent<Props> = ({ text }) => {
    return (
        <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-violet-400/40 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none text-violet-300">
            {text}
        </span>
    );
};

export default Badge;