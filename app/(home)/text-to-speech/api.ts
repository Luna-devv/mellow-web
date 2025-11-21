export interface SpeechResponse {
    url: string;
    base64: string;
}

function base64ToUrl(base64: string) {
    const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([binary], { type: "audio/mpeg" });
    return URL.createObjectURL(blob);
}

export async function getSpeech(text: string, speaker: string, captcha: string): Promise<SpeechResponse> {
    const response = await fetch("https://tts.wamellow.com/api/invoke", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cf-captcha-key": captcha
        },
        body: JSON.stringify({ text, speaker })
    });

    if (!response.ok) {
        throw new Error(`Failed to generate speech: ${response.statusText}`);
    }

    const { v_str } = await response.json();
    const url = base64ToUrl(v_str);

    return { url, base64: v_str };
}