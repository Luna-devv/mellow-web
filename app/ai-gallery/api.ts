import { defaultFetchOptions } from "@/lib/api";
import type {
    ApiError,
    ApiV1UploadGetResponse,
    ApiV1UploadsGetResponse
} from "@/typings";

export async function getUploads(options?: Partial<{
    model: string;
    nsfw: boolean;
    page: number;
    query: string;
}>): Promise<ApiV1UploadsGetResponse | ApiError> {

    const params = new URLSearchParams();
    if (options?.model) params.append("model", options.model);
    if (options?.nsfw) params.append("nsfw", options.nsfw.toString());
    if (options?.page) params.append("page", (options.page - 1).toString());
    if (options?.query) params.append("query", options.query);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/ai?${params.toString()}`,
        defaultFetchOptions
    );

    return res.json();
}

export async function getUpload(uploadId: string): Promise<ApiV1UploadGetResponse | ApiError> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/ai/${uploadId}`,
        defaultFetchOptions
    );

    return res.json();
}