import Link from "next/link";
import { FunctionComponent } from "react";
import { HiArrowLeft } from "react-icons/hi";

interface Props {
    url: string;
    className?: string;
}

const GoBack: FunctionComponent<Props> = ({ url, className }) => {
    return (
        <div className={className}>
            <Link href={url}>
                <div className="w-full dark:text-neutral-100 text-neutral-900 dark:bg-wamellow hover:dark:bg-wamellow-light/80 bg-wamellow-100 hover:bg-wamellow-100-light/80 py-3 px-4 mb-6 rounded-md flex gap-2 group/item duration-300">

                    <div className="flex gap-2 items-center">
                        <HiArrowLeft className="group-hover/item:ml-[4px] duration-300" style={{ height: 18, width: 18 }} />
                        <div className="text-md font-medium">Go back</div>
                    </div>

                </div>
            </Link>
        </div>
    );
};

export default GoBack;