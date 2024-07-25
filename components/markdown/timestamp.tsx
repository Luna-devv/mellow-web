import { getDateString } from "@/utils/time";

export default function Timestamp({
    unix,
    format
}: {
    unix: number;
    format: string;
}) {
    const date = new Date(unix * 1000);
    const str = getDateString(date, format);

    return (
        <span className='bg-neutral-300/10 hover:bg-neutral-300/25 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>
            {str}
        </span>
    );
}