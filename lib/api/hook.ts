import { useQuery } from "react-query";

import { cacheOptions, getData } from "@/lib/api";

interface ApiError {
    status: number;
    message: string;
}

export function useApi<T>(url: string, enabled?: boolean) {

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<T | ApiError>(url),
        {
            enabled: enabled || true,
            ...cacheOptions
        }
    );

    if (data && typeof data === "object" && "message" in data) return { data: undefined, isLoading, error: data.message };

    return {
        data,
        isLoading,
        error
    };
}