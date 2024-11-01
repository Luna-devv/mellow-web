import { useEffect, useState } from "react";

export function useApi<T, K>(url: string, init?: RequestInit) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<K | null>(null);

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        setError(null);

        fetch(url, init)
            .then((response) => {
                if (response.ok) return response.json();

                return Promise.reject({
                    status: response.status,
                    message: response.statusText
                });
            })
            .then((result: T) => {
                if (!isMounted) return;
                setData(result);

            })
            .finally(() => {
                if (!isMounted) return;
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [url]);

    return {
        data,
        isLoading,
        error
    };
}
