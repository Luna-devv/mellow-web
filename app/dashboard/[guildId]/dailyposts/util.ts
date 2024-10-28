import { DailypostType } from "@/typings";

export function typeToName(type: DailypostType) {
    switch (type) {
        case DailypostType.Anime: return "Anime";
        case DailypostType.Blahaj: return "Blåhaj";
        case DailypostType.NekosBest: return "Nekos.best";
    }
}

export function typeToIcon(type: DailypostType) {
    switch (type) {
        case DailypostType.Anime: return "/icons/anime.webp";
        case DailypostType.Blahaj: return "/icons/blahaj.webp";
        case DailypostType.NekosBest: return "/icons/neko.webp";
    }
}

export function generateHourArray() {
    const hoursArray = [];

    for (let hour = 0; hour < 24; hour++) {
        const name = `${((hour + 11) % 12 + 1)}${hour < 12 ? "am" : "pm"}`;
        hoursArray.push({ name, value: hour });
    }

    return hoursArray;
}