export interface TopggBot {
    reviews: {
        averageScore: number;
        count: number;
    };
}

export async function getReviews() {
    const res = await fetch(`https://top.gg/api/bots/${process.env.NEXT_PUBLIC_CLIENT_ID}`, {
        headers: {
            authorization: process.env.TOPGG_TOKEN!
        },
        next: { revalidate: 60 * 60 }
    });

    if (!res.ok) {
        return {
            averageScore: 5,
            count: 1
        };
    }

    const bot = await res.json() as TopggBot;
    return bot.reviews;
}