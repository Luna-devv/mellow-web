export const actor = JSON.parse(Buffer.from(process.env.NEXT_PUBLIC_VOICES_BASE64!, "base64").toString()) as Record<string, [string, string, string]>;
export const voices = Object.keys(actor);

export function getVoices(voice?: keyof typeof actor): string[] {
    if (!voice) {
        const list: string[] = [];
        for (const key of voices) list.push(`${actor[key][0]} (${actor[key][1]}) - ${actor[key][2]}`);
        return list;
    }

    return [`${actor[voice][0]} (${actor[voice][1]}) - ${actor[voice][2]}`];
}