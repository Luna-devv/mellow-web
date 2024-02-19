export function toFixedArrayLength<T>(arr: T[], length: number): T[] {
    const originalLength = arr.length;
    const numCopies = Math.ceil(length / originalLength);
    const slicedArray: T[] = [];

    for (let i = 0; i < numCopies; i++) {
        slicedArray.push(...arr);
    }

    return slicedArray.slice(0, length);
}