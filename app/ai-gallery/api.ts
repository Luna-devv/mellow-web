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

export async function getUploads(options?: { model?: string; page?: number }): Promise<Upload[] | ApiError> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/ai${options?.model ? `?model=${options.model}` : ""}${options?.page ? `?page=${options.page - 1}` : ""}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/ai/${uploadId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: { revalidate: 60 * 60 }
    });

    return res.json();
}