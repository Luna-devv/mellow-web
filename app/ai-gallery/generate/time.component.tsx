import { useEffect, useRef, useState } from "react";

export default function Time({
    loading
}: {
    loading: boolean;
}) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [previousLoading, setPreviousLoading] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(0);

    useEffect(() => {
        if (loading === previousLoading) return;

        if (!previousLoading && loading) setEstimatedTime(0);
        setPreviousLoading(loading)

        if (!loading) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setEstimatedTime((prev) => prev + 100);
        }, 100);
    }, [loading]);

    return (
        <span className="inline">
            {(estimatedTime / 1000).toFixed(1)}s
        </span>
    )
}