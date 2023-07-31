"use client";
import Link from "next/link";
import { FunctionComponent } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import LoginButton from "@/components/LoginButton";

const PageComponent: FunctionComponent<{ searchParams: { page: string, type: string }, membersLength: number }> = ({ searchParams, membersLength }) => {
    const user = userStore((s) => s);
    const web = webStore((w) => w);

    if (!user?.id) return (
        <LoginButton
            className="w-full text-center"
            addClassName="justify-center"
            width={web.width}
            message="Login to view more"
        />
    );

    return (
        <>
            <Link
                href={(searchParams.page && (parseInt(searchParams.page) || 0) !== 0) ? `?page=${(parseInt(searchParams.page) || 0) - 1}${searchParams.type ? `&type=${searchParams.type}` : ""}` : ""}
                className={`dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-full w-1/3 rounded-l-md duration-100 flex items-center ${(!searchParams.page || (parseInt(searchParams.page) || 0) === 0) ? "cursor-not-allowed opacity-50" : "opacity-80 cursor-pointer"}`}
            >
                <HiArrowLeft className="m-auto text-2xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
            </Link>

            <input
                className="outline-none text-center w-1/3 min-h-full dark:bg-wamellow bg-wamellow-100 font-semibold text-md flex items-center text-neutral-500 rounded-none opacity-80"
                value={searchParams.page ?? 0}
                inputMode="numeric"
                disabled={true}
            />

            <Link
                href={membersLength >= 10 ? `?page=${(parseInt(searchParams.page) || 0) + 1}${searchParams.type ? `&type=${searchParams.type}` : ""}` : ""}
                className={`dark:bg-wamellow bg-wamellow-100 hover:dark:bg-wamellow-light hover:bg-wamellow-100-light h-full w-1/3 rounded-r-md duration-100 flex items-center ${membersLength >= 10 ? "opacity-80 cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            >
                <HiArrowRight className="m-auto text-2xl font-thin dark:text-neutral-300 text-neutral-700 p-1" />
            </Link>
        </>
    );

};

export default PageComponent;