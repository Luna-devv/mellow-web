export function filterDuplicates(strings: string[]): string[] {
    const uniqueStrings = new Set<string>();

    strings.forEach((str) => {
        uniqueStrings.add(str);
    });

    return Array.from(uniqueStrings);
}