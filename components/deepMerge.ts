export function deepMerge<T>(target: T | undefined, source: Partial<T>): T | undefined {
    if (typeof target !== "object" || typeof source !== "object" || !target) {
        return target;
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (typeof targetValue === "object" && typeof sourceValue === "object") {
                // @ts-expect-error Some exteractor error
                target[key] = deepMerge(targetValue, sourceValue);
            } else {
                // @ts-expect-error Some exteractor error
                target[key] = sourceValue;
            }
        }
    }

    return target;
}