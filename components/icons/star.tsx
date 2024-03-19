import { SVGProps } from "react";

export default function StarIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={17}
            viewBox="0 0 18 17"
            {...props}
        >
            <path
                strokeWidth="1.2"
                d="m8.103 1.056-2.04 4.138-4.566.665a1 1 0 0 0-.553 1.707l3.303 3.218-.781 4.547a1 1 0 0 0 1.45 1.053L9 14.237l4.084 2.147c.725.381 1.591-.231 1.45-1.053l-.78-4.547 3.302-3.218a1 1 0 0 0-.553-1.707l-4.566-.665-2.04-4.138C9.53.32 8.472.31 8.103 1.056Z"
            />
        </svg>
    );
}