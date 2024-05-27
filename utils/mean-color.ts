import sharp from "sharp";

const cache = new Map<string, string>();

export default async function getMeanColor(url: string) {

    const cached = cache.get(url);
    if (cached) return cached;

    const { data } = await sharp(
        await (await fetch(url)).arrayBuffer()
    )
        .raw()
        .toBuffer({ resolveWithObject: true });

    const colorCountMap = new Map<string, number>();

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const color = `${red},${green},${blue}`;

        if (colorCountMap.has(color)) {
            colorCountMap.set(color, colorCountMap.get(color)! + 1);
        } else {
            colorCountMap.set(color, 1);
        }
    }

    let maxCount = 0;
    let mostFrequentColor = "";

    for (const [color, count] of colorCountMap.entries()) {
        if (count > maxCount) {
            maxCount = count;
            mostFrequentColor = color;
        }
    }

    const [red, green, blue] = mostFrequentColor.split(",").map(Number);
    const hex = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

    cache.set(url, hex);

    return hex;
}