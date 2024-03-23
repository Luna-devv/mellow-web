"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation, HiFingerPrint, HiLockClosed } from "react-icons/hi";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { GT4Init } from "@/lib/gt4";
import { ApiV1GuildsGetResponse } from "@/typings";
import cn from "@/utils/cn";

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
                credentials: "include",
                headers: {
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
                credentials: "include"
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
                        href="/login"
                        className="button-blurple font-medium w-full"
                        startContent={<BsDiscord />}
                    >
                        Login to Verify
                    </Button>
                    :
                    <Button
                        ref={btnRef}
                        color={state === "ERRORED" ? "danger" : state === "SUCCESS" ? "success" : "secondary"}
                        className={cn(state === "ERRORED" && "cursor-not-allowed", state === "SUCCESS" && "cursor-not-allowed", "font-medium w-full")}
                        isDisabled={state === "ERRORED" || state === "SUCCESS"}
                        isLoading={state === "LOADING"}
                        startContent={<HiFingerPrint />}
                    >
                        Complete verification
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

};

export default VerifyComponent;