import Link from "next/link";
import { FunctionComponent } from "react";
import { HiArrowRight, HiChartBar } from "react-icons/hi";

const OverviewLinkComponent: FunctionComponent<{ title: string, message: string, url: string }> = ({ title, message, url }) => {
    return (
        <Link href={url}>
            <div className="w-full text-neutral-100 bg-wamellow py-4 px-5 mb-6 rounded-md outline-violet-500 hover:outline flex gap-2 group/item ">

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
    );
};

export default OverviewLinkComponent;