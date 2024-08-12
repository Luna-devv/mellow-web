"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import decimalToRgb from "@/utils/decimalToRgb";

interface ListProps {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
    searchParamName?: string;
    disabled: boolean;

    children?: React.ReactNode
}

export function ListTab({ tabs, url, searchParamName, disabled }: ListProps) {
    const [position, setPosition] = useState(0);

    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    const ref = useRef<HTMLDivElement | null>(null);

    function handleChange(key: unknown) {
        if (!key && typeof key !== "string") return;

        if (!searchParamName) {
            router.push(`${url}${key}?${params.toString()}`);
            return;
        }

        const newparams = new URLSearchParams();

        if (key) newparams.append(searchParamName, key as string);
        else newparams.delete(searchParamName);

        router[params.get(searchParamName) ? "push" : "replace"](`${url}?${newparams.toString()}`);
    }

    function scroll(direction: "left" | "right") {
        if (!ref.current) return;

        ref.current.scrollBy({
            top: 0,
            left: direction === "right"
                ? ref.current.clientWidth - position
                : -position,
            behavior: "smooth"
        });
    }

    function setScrollPosition() {
        if (!ref.current) return;
        const { scrollLeft } = ref.current;
        setPosition(scrollLeft);
    }

    useEffect(() => {
        if (!ref.current) return;

        ref.current.addEventListener("scroll", setScrollPosition);
        setScrollPosition();

        return () => {
            ref.current?.removeEventListener("scroll", setScrollPosition);
        };
    }, []);

    return (
        <div className="font-medium mt-2 mb-6 flex items-center relative">
            <Tabs
                ref={ref}
                className="flex w-full"
                classNames={{
                    tabList: "w-full relative rounded-none p-0 border-b border-divider",
                    tab: "w-fit px-4 h-12 relative right-2.5"
                }}
                defaultSelectedKey={
                    searchParamName
                        ? (params.get(searchParamName) || "")
                        : path.split(url)[1].split("/").slice(0, 2).join("/")
                }
                onSelectionChange={handleChange}
                variant="underlined"
                color="secondary"
                isDisabled={disabled}
            >
                {tabs.map((tab) =>
                    <Tab
                        key={tab.value}
                        title={
                            <div className="flex items-center space-x-2">
                                {tab.icon}
                                <span>{tab.name}</span>
                            </div>
                        }
                    />
                )}
            </Tabs>

            {tabs.length > 4 && position > 0 &&
                <button
                    className="absolute md:hidden top-1 left-0 bg-wamellow backdrop-blur-lg rounded-xl p-2"
                    onClick={() => scroll("left")}
                >
                    <HiChevronLeft className="size-5" />
                </button>
            }

            {tabs.length > 4 && position < (ref.current?.clientWidth || 0) &&
                <button
                    className="absolute md:hidden top-1 right-0 bg-wamellow backdrop-blur-lg rounded-xl p-2"
                    onClick={() => scroll("right")}
                >
                    <HiChevronRight className="size-5" />
                </button>
            }
        </div>
    );

}

interface FeatureProps {
    items: {
        title: string;
        description: string;
        icon: React.ReactNode;
        color: number;
    }[]
}

export function ListFeature({ items }: FeatureProps) {

    return (
        <div className="grid gap-6 grid-cols-2">
            {items.map((item, i) => {

                const rgb = decimalToRgb(item.color);

                return (
                    <div
                        className="flex items-center gap-3"
                        key={"featurelist-" + item.description.replace(/ +/g, "") + i}
                    >
                        <div className="rounded-full h-12 aspect-square p-[10px] svg-max" style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`, color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` }}>
                            {item.icon}
                        </div>
                        <span className="text-neutral-300">{item.description}</span>
                    </div>
                );

            })}
        </div>
    );

}