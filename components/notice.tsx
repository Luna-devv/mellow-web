import { HiExclamation, HiExclamationCircle } from "react-icons/hi";

export enum NoticeType {
    Error = "error",
    Info = "info"
}

interface Props {
    message: string;
    type?: NoticeType;
    children?: React.ReactNode;
}

export default function Notice({
    message,
    type,
    children
}: Props) {

    return (
        <div className={`w-full text-neutral-100 ${type === NoticeType.Info ? "bg-violet-400/40" : "bg-red-400/40"} py-2 px-4 mb-6 rounded-md flex gap-2 items-center`}>
            {type === NoticeType.Info ? <HiExclamationCircle className="h-5 w-5" /> : <HiExclamation className="h-5 w-5" />}
            <div className="text-lg">{message}</div>

            {children &&
                <div className="ml-auto">
                    {children}
                </div>
            }
        </div>
    );
}