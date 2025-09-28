export const truncate = (str: string, length: number) => {
    return str.length > length ? str.slice(0, Math.max(0, length)) + "…" : str;
};