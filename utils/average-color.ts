import sharp from "sharp";

const cache = new Map<string, string>();

export default async function getAverageColor(url: string) {

    const cached = cache.get(url);
    if (cached) return cached;

    const { data, info } = await sharp(
        await (await fetch(url)).arrayBuffer()
    )
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height } = info;
    const pixelCount = width * height;

    let redSum = 0;
    let greenSum = 0;
    let blueSum = 0;

    for (let i = 0; i < data.length; i += 4) {
        redSum += data[i];
        greenSum += data[i + 1];
        blueSum += data[i + 2];
    }

    const rgb = {
        r: Math.round(redSum / pixelCount),
        g: Math.round(greenSum / pixelCount),
        b: Math.round(blueSum / pixelCount)
    };

    const hex = `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`
    cache.set(url, hex);

    return hex;
}