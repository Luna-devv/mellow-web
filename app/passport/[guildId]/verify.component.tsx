"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation, HiFingerPrint, HiLockClosed } from "react-icons/hi";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { GT4Init } from "@/lib/gt4";
import type { ApiV1GuildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props {
    guild: ApiV1GuildsGetResponse;
}

export default function VerifyComponent({ guild }: Props) {
    const user = userStore((s) => s);

    const btnRef = useRef<HTMLButtonElement>(null);

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

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
    function handlerForBind(c) {

        const button = btnRef.current;
        let isReady = false;

        c.onReady(() => {
            isReady = true;
        });

        button?.addEventListener("click", function () {
            if (!isReady) return;
            if (state === State.Success) return;
            setState(State.Idle);
            setError(null);

            c.showCaptcha();
        });

        c.onSuccess(async () => {
            setState(State.Loading);

            const result = c.getValidate();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild.id}/passport-verification/captcha`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(result)
            })
                .catch(() => null);

            switch (res?.status) {
                case 200:
                    setState(State.Success);
                    break;
                default:
                    setState(State.Idle);
                    setError((await res?.json())?.message || "Unknown server error");
                    break;
            }

        });

        c.onError((err: string) => {
            c.reset();
            setState(State.Idle);
            setError(`${err}` || "Unknown captcha error");
        });

        c.onClose(() => {
            c.reset();
            setState(State.Idle);
        });

        c.onFail(async () => {
            setState(State.Loading);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild.id}/passport-verification/captcha?captcha-failed=true`, {
                method: "POST",
                credentials: "include"
            })
                .catch(() => null);

            switch (res?.status) {
                case 409:
                    setState(State.Idle);
                    break;
                default:
                    c.destroy();
                    setState(State.Idle);
                    setError((await res?.json())?.message || "Unknown server error");
                    break;
            }

        });

    }

    return (
        <div className="flex flex-col gap-3 w-full mt-4">

            <div className="flex items-center gap-1.5 dark:bg-wamellow-alpha bg-wamellow-100-alpha w-fit py-1 pl-2 pr-3 rounded-full">
                <ImageReduceMotion url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`} size={20} alt="your avatar" className="rounded-full h-5 w-5" />
                <span className="text-sm">@{user?.username}</span>
            </div>

            {error &&
                <div className="flex items-center gap-1 text-red-400 text-sm">
                    <HiExclamation className="h-5 w-5 relative top-[1px]" />
                    {error}
                </div>
            }

            {
                (user && !user.id) || error?.includes("email") ?
                    <Button
                        as={Link}
                        className="button-blurple font-medium w-full"
                        href="/login"
                        prefetch={false}
                        startContent={<BsDiscord />}
                    >
                        Login to Verify
                    </Button>
                    :
                    <Button
                        ref={btnRef}
                        color={error ? "danger" : state === State.Success ? "success" : "secondary"}
                        className={cn(error && "cursor-not-allowed", state === State.Success && "cursor-not-allowed", "font-medium w-full")}
                        isDisabled={!!error || state === State.Success}
                        isLoading={state === State.Loading}
                        startContent={
                            state === State.Loading
                                ? <></>
                                : <HiFingerPrint />
                        }
                    >
                        {
                            state === State.Success
                                ? "Verification successful"
                                : "Complete verification"
                        }
                    </Button>
            }

            <div className="flex w-full gap-2">
                <Button
                    as={Link}
                    href="/support"
                    target="_blank"
                    className="w-1/2"
                    startContent={<BsDiscord />}
                >
                    Support
                </Button>
                <Button
                    as={Link}
                    href="/privacy"
                    target="_blank"
                    className="w-1/2"
                    startContent={<HiLockClosed />}
                >
                    Privacy
                </Button>
            </div>

        </div >
    );

}