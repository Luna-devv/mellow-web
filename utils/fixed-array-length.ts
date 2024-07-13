export function toFixedArrayLength<T>(arr: T[], length: number): T[] {
    if (!arr.length) return [];

    const numCopies = Math.ceil(length / arr.length);
    const slicedArray: T[] = [];

    for (let i = 0; i < numCopies; i++) {
        slicedArray.push(...arr);
    }

    return slicedArray.slice(0, length);
}