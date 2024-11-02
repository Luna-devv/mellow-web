"use client";

import { Button, Checkbox } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import { HiCloudUpload } from "react-icons/hi";

import { ApiV1UploadGetResponse } from "@/typings";
import cn from "@/utils/cn";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

export default function UploadButton({
    model,
    prompt
}: {
    model: string;
    prompt: string;
}) {
    const search = useSearchParams();
    const cookies = useCookies();

    const imageUrl = search.get("image_url");

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [nsfw, setNsfw] = useState(false);

    const isDisabled = !cookies.get("session") || !imageUrl;

    useEffect(() => {
        setState(State.Idle);
    }, [imageUrl]);

    async function upload() {
        setState(State.Loading);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/ai`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: imageUrl,
                model: model,
                prompt: prompt,
                nsfw: nsfw
            })
        })
            .then((res) => res.json()) as ApiV1UploadGetResponse;

        if ("message" in res) {
            setError(res.message as string);
            return;
        }

        setState(State.Success);
    }

    return (
        <div
            className={cn(
                "flex flex-col",
                isDisabled && "cursor-not-allowed select-none blur-sm opacity-75"
            )}
        >

            <div className="mt-6 flex items-center">
                <Checkbox
                    isSelected={nsfw}
                    onValueChange={(now) => setNsfw(now)}
                    color="secondary"
                    isDisabled={isDisabled}
                />
                <span className="font-medium">Is NSFW content?</span>
            </div>

            <Button
                className="mt-4"
                color={
                    state === State.Success
                        ? "success"
                        : "secondary"
                }
                onClick={upload}
                startContent={
                    state === State.Loading
                        ? <></>
                        : <HiCloudUpload />
                }
                isLoading={state === State.Loading}
                isDisabled={state === State.Success || isDisabled}
            >
                {
                    state === State.Success
                        ? "Upload Successful"
                        : "Upload"
                }
            </Button>

            {error &&
                <span className="dark:text-red-500 text-red-400 text-sm mt-1">
                    {error}
                </span>
            }

        </div>
    );

}