import { defaultFetchOptions } from "@/lib/api";
import { ApiError } from "@/typings";

export interface Upload {
    id: string;
    guildId?: string | null;
    authorId: string;

    prompt: string;
    negativePrompt?: string | null;
    model: string;

    verified: boolean;
    nsfw: boolean;

    createdAt: string;
}

interface Uploads {
    results: Upload[];
    pagination: {
        total: number;
        pages: number;
    }
}

export async function getUploads(options?: Partial<{
    model: string;
    nsfw: boolean;
    page: number;
    query: string;
}>): Promise<Uploads | ApiError> {

    const params = new URLSearchParams();
    if (options?.model) params.append("model", options.model);
    if (options?.nsfw) params.append("nsfw", options.nsfw.toString());
    if (options?.page) params.append("page", (options.page - 1).toString());
    if (options?.query) params.append("query", options.query);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/ai?${params.toString()}`,
        defaultFetchOptions
    );

    return res.json();
}

export interface ExtendedUpload extends Upload {
    author: {
        username: string;
        globalName: string;
        avatar: string | null;
    };
}

export async function getUpload(uploadId: string): Promise<ExtendedUpload | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/ai/${uploadId}`, defaultFetchOptions);

    return res.json();
}