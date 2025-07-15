import { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";

import { cacheOptions, getData } from "@/lib/api";

interface ApiError {
    status: number;
    message: string;
}

export type ApiEdit<T> = <K extends keyof T>(key: K, value: T[K]) => void;

export function useApi<T>(url: string, enabled?: boolean) {

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<T | ApiError>(url),
        {
            enabled: enabled || true,
            ...cacheOptions
        }
    );

    const queryClient = useQueryClient();

    const edit = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            queryClient.setQueryData<T>(url, () => ({
                ...data,
                [key]: value
            } as T));
        },
        [data]
    );

    if (data && typeof data === "object" && "message" in data) {
        return { data: undefined, isLoading, error: data.message || "unknown error", edit };
    }

    return {
        data,
        isLoading,
        error: error ? `${error}` : undefined,
        edit
    };
}