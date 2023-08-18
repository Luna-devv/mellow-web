"use client";
import Link from "next/link";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation, HiFingerPrint, HiLockClosed } from "react-icons/hi";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/ImageReduceMotion";
import LoginButton from "@/components/LoginButton";
import { GT4Init } from "@/lib/gt4";
import { ApiV1GuildsGetResponse } from "@/typings";

const VerifyComponent: FunctionComponent<{ guild: ApiV1GuildsGetResponse }> = ({ guild }) => {
    const user = userStore((s) => s);

    const btnRef = useRef<HTMLButtonElement>(null);

    const [state, setState] = useState<"LOADING" | "ERRORED" | "SUCCESS" | undefined>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (!user?.id) return;
        const { init } = GT4Init();

        init(
            {
                captchaId: process.env.NEXT_PUBLIC_CAPTCHA_ID,
                product: "bind",
                // riskType: "icon",
                hideSuccess: true,
                userInfo: user?.id
            },
            handlerForBind
        );

    }, [user]);

    // @ts-expect-error GeeTest types suck
    async function handlerForBind(c) {

        const button = btnRef.current;
        let isReady = false;

        c.onReady(() => {
            isReady = true;
        });

        button?.addEventListener("click", function () {
            if (!isReady) return;
            if (state === "SUCCESS") return;
            setState(undefined);
            setError(undefined);

            c.showCaptcha();
        });

        c.onSuccess(async () => {
            setState("LOADING");

            const result = c.getValidate();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild.id}/passport-verification/captcha`, {
                method: "POST",
                headers: {
                    authorization: localStorage.getItem("token") ?? "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(result)
            })
                .catch(() => null);

            switch (res?.status) {
                case 200:
                    setState("SUCCESS");
                    break;
                default:
                    setState("ERRORED");
                    setError((await res?.json())?.message || "Unknown server error");
                    break;
            }

        });

        c.onError(() => {
            c.reset();
            setState("ERRORED");
            setError("Unknown captcha error");
        });

        c.onClose(() => {
            c.reset();
            setState(undefined);
        });

        c.onFail(async () => {
            setState("LOADING");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild.id}/passport-verification/captcha?captcha-failed=true`, {
                method: "POST",
                headers: {
                    authorization: localStorage.getItem("token") ?? ""
                }
            })
                .catch(() => null);

            switch (res?.status) {
                case 400:
                    setState(undefined);
                    break;
                default:
                    c.destroy();
                    setState("ERRORED");
                    setError((await res?.json())?.message || "Unknown server error");
                    break;
            }

        });

    }

    return (
        <div className="flex flex-col gap-3 w-full mt-4">

            <div className="flex items-center dark:bg-wamellow-alpha bg-wamellow-100-alpha w-fit py-1 pl-2 pr-3 rounded-full">
                <ImageReduceMotion url={user?.id ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : "/discord.png"} size={20} alt="your avatar" className="rounded-full mr-1 h-5 w-5" />
                <span className="pb-[2px] text-sm">{user?.global_name || `@${user?.username}`}</span>
            </div>

            {error &&
                <div className="flex items-center gap-1 text-red-400 text-sm">
                    <HiExclamation className="h-5 w-5 relative top-[1px]" />
                    {error}
                </div>
            }

            {(user && !user.id) || error?.includes("email") ?
                <LoginButton
                    className="w-full text-center border-2 border-wamellow-alpha rounded-md hover:border-blurple hover:bg-blurple duration-300"
                    addClassName="justify-center"
                    message="Login to verify"
                />
                :
                <button
                    ref={btnRef}
                    className={`${state === "ERRORED" && "bg-red-500/80 hover:bg-red-500/60 opacity-80 cursor-not-allowed"} ${state === "SUCCESS" && "bg-green-500/80 hover:bg-green-500/60 cursor-not-allowed"} ${(!state || state === "LOADING") && "bg-violet-600 hover:bg-violet-600/80"} flex text-neutral-200 font-medium py-2 px-4 rounded-md duration-200 w-full justify-center`}
                    disabled={state === "ERRORED" || state === "SUCCESS"}
                >
                    <HiFingerPrint className="relative top-1" />
                    <span className="ml-2">Complete verification</span>
                </button>
            }

            <div className="flex w-full gap-2">
                <Link href="/support" className="flex dark:bg-wamellow-alpha bg-wamellow-100-alpha hover:bg-blurple hover:text-white py-2 px-4 rounded-md duration-200 w-1/2 justify-center">
                    <BsDiscord className="relative top-1" />
                    <span className="ml-2">Support</span>
                </Link>
                <Link href="/privacy" className="flex dark:bg-wamellow-alpha bg-wamellow-100-alpha dark:hover:bg-wamellow-light hover:bg-wamellow-100-light dark:hover:text-white py-2 px-4 rounded-md duration-200 w-1/2 justify-center">
                    <HiLockClosed className="relative top-1" />
                    <span className="ml-1">Privacy</span>
                </Link>
            </div>

        </div>
    );

};

export default VerifyComponent;