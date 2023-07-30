import Link from "next/link";
import { FunctionComponent } from "react";
import { HiArrowRight, HiChartBar } from "react-icons/hi";

const OverviewLinkComponent: FunctionComponent<{ title: string, message: string, url: string, className?: string }> = ({ title, message, url, className }) => {
    return (
        <div className={className}>
            <Link href={url}>
                <div className="w-full dark:text-neutral-100 text-neutral-900 dark:bg-wamellow bg-wamellow-100 py-4 px-5 mb-6 rounded-md outline-violet-500 hover:outline flex gap-2 group/item ">

                    <div>

                        <div className="flex gap-2 items-center">
                            <div className="text-xl font-semibold">{title}</div>
                            <HiArrowRight className="group-hover/item:ml-[6px] duration-300" style={{ height: 20, width: 20 }} />
                        </div>

                        <div className="text-sm">{message}</div>
                    </div>

                    <HiChartBar className="ml-auto text-violet-400 group-hover/item:text-violet-500 duration-300" style={{ height: "3rem", width: "3rem" }} />

                </div>
            </Link>
        </div>
    );
};

export default OverviewLinkComponent;