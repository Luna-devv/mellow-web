"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiExclamation, HiFingerPrint, HiLockClosed } from "react-icons/hi";

import { userStore } from "@/common/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import type { ApiV1GuildsGetResponse } from "@/typings";
import { State, useCaptcha } from "@/utils/captcha";
import { cn } from "@/utils/cn";

interface Props {
    guild: ApiV1GuildsGetResponse;
}

export default function VerifyComponent({ guild }: Props) {
    const user = userStore((s) => s);

    const url = `/guilds/${guild.id}/passport-verification/captcha` as const;
    const { state, error, button } = useCaptcha(url, user?.id);

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
                        ref={button}
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