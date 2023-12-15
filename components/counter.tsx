"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CountUp, { type CountUpProps } from "react-countup";
import { HiInformationCircle } from "react-icons/hi";

import cn from "@/utils/cn";

export function ClientCountUp(props: Omit<CountUpProps, "duration">) {
    const [isInViewport, setIsInViewport] = useState(false);
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setIsInViewport(entry.isIntersecting);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5
        });

        if (componentRef.current) observer.observe(componentRef.current);

        return () => {
            if (componentRef.current) observer.unobserve(componentRef.current);
        };
    }, []);

    return (
        <span ref={componentRef} className={props.className || ""}>
            {isInViewport ? <CountUp {...props} className="" duration={4} /> : <>0</>}
        </span>
    );

}

interface Options {
    items: {
        name: string;
        number: number;
        gained: number | string | React.ReactNode;
        append?: string
        info?: string
    }[]
}

export function StatsBar(options: Options) {
    const [width, setWidth] = useState(0);
    const ref = useRef<NodeJS.Timeout>();

    useEffect(() => {
        ref.current = setInterval(() => setWidth(window.innerWidth), 1000);
        return () => {
            clearInterval(ref.current);
        };
    }, []);

    return (
        <div className="grid w-full rounded-md overflow-hidden" style={{ gridTemplateColumns: `repeat(${width > 768 ? options.items.length : 2}, minmax(0, 1fr))` }}>
            {options.items.slice(0, width > 768 ? 10 : 2).map((item, i) => (
                <div className={cn("p-5", i % 2 === 0 ? "dark:bg-wamellow bg-wamellow-100" : "dark:bg-wamellow/75 bg-wamellow-100/75")} key={"counter" + item.name + item.number.toString() + item.number.toString()}>

                    <div className="flex">
                        <div className="text-sm font-medium mb-1">{item.name}</div>
                        {item.info && <Link href={item.info} className="ml-auto dark:text-neutral-400 text-neutral-600 dark:hover:text-violet-400 hover:text-violet-600 duration-300">
                            <HiInformationCircle />
                            <span className="sr-only">Learn more</span>
                        </Link>}
                    </div>

                    <div className="flex">
                        <ClientCountUp className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium" end={item.number} />
                        <span className="text-lg dark:text-violet-400 text-violet-600 font-medium relative top-2.5 ml-2">
                            {typeof item.gained === "number"
                                ?
                                <>+<ClientCountUp end={item.gained} /> {item.append || "today"}</>
                                :
                                item.gained
                            }
                        </span>
                    </div>

                </div>
            ))}

        </div>
    );
}