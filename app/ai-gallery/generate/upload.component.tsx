"use client";

import { Button, Checkbox } from "@nextui-org/react";
import { useCookies } from "next-client-cookies";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiV1UploadGetResponse } from "@/typings";
import { HiCloudUpload } from "react-icons/hi";

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
    const search = useSearchParams()
    const cookies = useCookies();

    const imageUrl = search.get("image_url");

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [nsfw, setNsfw] = useState(false);

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

    if (!cookies.get("hasSession") || !imageUrl) return <></>;

    return (
        <div className="flex flex-col">

            <div className="mt-4 flex items-center">
                <Checkbox
                    isSelected={nsfw}
                    onValueChange={(now) => setNsfw(now)}
                    color="secondary"
                />
                <span className="font-medium">Is NSFW?</span>
            </div>

            <Button
                className="mt-4"
                color={
                    state === State.Success
                        ? "success"
                        : "secondary"
                }
                onClick={upload}
                startContent={<HiCloudUpload />}
                isLoading={state === State.Loading}
                isDisabled={state === State.Success}
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