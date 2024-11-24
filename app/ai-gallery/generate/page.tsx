"use client";

import { Button, Image, Spinner } from "@nextui-org/react";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi";

import DumbTextInput from "@/components/inputs/dumb-text-input";
import LinkTag from "@/components/link-tag";
import Notice from "@/components/notice";
import { cn } from "@/utils/cn";

import Time from "./time.component";
import UploadButton from "./upload.component";

enum State {
    Idle = 0,
    Loading = 1
}

export default function Home() {
    const cookies = useCookies();
    const search = useSearchParams();
    const router = useRouter();

    const imageUrl = search.get("image_url");

    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [gpu, setGpu] = useState<string | null>(null);

    const [baseUrl, setBaseUrl] = useState("https://ai.local.wamellow.com");
    const [model, setModel] = useState("animagine-xl-v3");
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        fetch(baseUrl)
            .then((res) => res.json() as Promise<{ gpu: string; }>)
            .then((res) => {
                setError(null);
                setGpu(res.gpu || null);
            })
            .catch((err) => {
                setError(`Could not fetch local GPU instance (${err.toString()})`);
            });
    }, [baseUrl]);

    async function generate() {
        setState(State.Loading);

        let params = new URLSearchParams();
        params.delete("image_url");
        router.push(`?${params.toString()}`, { scroll: false });

        const reqparams = new URLSearchParams({
            prompt: prompt
        });

        const res = await fetch(`${baseUrl}/generate/image/${model}?${reqparams.toString()}`)
            .then((res) => res.json()) as { url: string; duration: number; };

        params = new URLSearchParams();
        params.delete("image_url");
        params.append("image_url", res.url);

        router.push(`?${params.toString()}`, { scroll: false });

        setState(State.Idle);
    }

    return (
        <div className="w-full">

            {error &&
                <Notice message={error} />
            }

            <div className="flex flex-col-reverse md:flex-row">

                <div className="md:w-2/3 w-full md:mr-6">
                    {imageUrl && state !== State.Loading ?
                        <Image
                            as={NextImage}
                            className="rounded-lg"
                            height={1024}
                            isBlurred
                            isZoomed
                            src={imageUrl || ""}
                            width={1024}
                            onError={() => {
                                const params = new URLSearchParams();
                                params.delete("image_url");
                                router.push(`?${params.toString()}`, { scroll: false });
                            }}
                        />
                        :
                        <div className="w-full aspect-square border border-violet-400 bg-wamellow flex items-center justify-center rounded-lg shadow-xl">
                            {state === State.Loading
                                ?
                                <div>
                                    <Spinner color="secondary" />
                                </div>
                                :
                                <span className="text-2xl font-medium text-neutral-200">
                                    No image generated yet
                                </span>
                            }
                        </div>
                    }
                </div>

                <div className="md:w-1/3 mb-8 md:mt-0 flex flex-col">
                    <DumbTextInput name="Base URL" value={baseUrl} setValue={setBaseUrl} thin />
                    <DumbTextInput name="Model" value={model} setValue={setModel} thin />
                    <DumbTextInput name="Prompt" value={prompt} setValue={setPrompt} placeholder="bocchi the rock" thin />

                    <Button
                        className="mt-4"
                        color="secondary"
                        onClick={generate}
                        startContent={
                            state === State.Loading
                                ? <></>
                                : <HiPrinter />
                        }
                        isLoading={state === State.Loading}
                        isDisabled={!gpu || !prompt || !model}
                    >
                        Generate
                    </Button>

                    <div className="flex justify-between">
                        <span className="font-medium">
                            {gpu || "unknown gpu"}
                        </span>

                        <span className="italic">
                            (<Time loading={state === State.Loading} />)
                        </span>
                    </div>

                    <UploadButton
                        model={model}
                        prompt={prompt}
                    />

                    <div
                        className={cn(
                            "mt-6",
                            cookies.get("devTools") === "true" && "hidden md:block"
                        )}
                    >
                        Generate AI images using your own <LinkTag href="https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html">Intel® Arc™ A-Series GPU</LinkTag> (16gb vram minimum).
                        Make sure you have <LinkTag href="https://github.com/Luna-devv/intel-arc-ai">Luna-devv/intel-arc-ai</LinkTag> installed and running locally on your machine or local network.
                    </div>

                </div>
            </div>
        </div>
    );
}