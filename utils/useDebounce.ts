import { useMemo, useState } from "react";

const debounce = <T>(fn: (...args: T[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    return (...args: T[]) => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, delay, ...args);
    };
};

export function useStateDebounced<T>(initialValue: T, delay: number) {
    const [, _setInputValue] = useState<T>(initialValue);

    const [debouncedInputValue, setDebouncedInputValue] = useState<T>(
        initialValue
    );

    const memoizedDebounce = useMemo(
        () =>
            debounce((value: T) => {
                setDebouncedInputValue(value);
            }, delay),
        [delay]
    );

    const setInputValue = (value: T | ((prevState: T) => T)) => {
        if (value instanceof Function) {
            _setInputValue((p) => {
                const mutated = value(p);
                memoizedDebounce(mutated);
                return mutated;
            });
        } else {
            _setInputValue(value);
            memoizedDebounce(value);
        }
    };

    return [debouncedInputValue, setInputValue] as const;
}