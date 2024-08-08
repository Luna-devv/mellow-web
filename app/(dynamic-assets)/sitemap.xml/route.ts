import docsMetadata from "@/public/docs/meta.json";
import { getCanonicalUrl } from "@/utils/urls";

interface Sitemap {
    url: string
    priority: number
}

// Update sitemap only one a day
export const revalidate = 60 * 60 * 24;

const fetchOptions = {
    headers: {
        Authorization: process.env.API_SECRET as string
    },
    next: { revalidate: 60 * 12 }
};

export async function GET() {
    const uploadIds = await fetch(`${process.env.NEXT_PUBLIC_API}/ai/sitemap`, fetchOptions).then((res) => res.json()) as string[];
    const guildIds = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds`, fetchOptions).then((res) => res.json()) as string[];

    const sitemap = [
        {
            url: getCanonicalUrl(),
            priority: 1
        },
        {
            url: getCanonicalUrl("bot", "pronouns"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("bot", "pronouns", "pronouns"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("bot", "pronouns", "sexualities"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("bot", "pronouns", "genders"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("ai-gallery"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("status"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("dashboard"),
            priority: 0.8
        },
        {
            url: getCanonicalUrl("profile"),
            priority: 0.8
        },
        {
            url: getCanonicalUrl("support"),
            priority: 0.7
        },
        {
            url: getCanonicalUrl("login"),
            priority: 0.5
        },
        {
            url: getCanonicalUrl("terms"),
            priority: 0.2
        },
        {
            url: getCanonicalUrl("privacy"),
            priority: 0.2
        }
    ] satisfies Sitemap[];

    for (const page of docsMetadata.pages) sitemap.push({ url: getCanonicalUrl("docs", page.file.split(".")[0]), priority: 0.6 });
    for (const guildId of guildIds) sitemap.push({ url: getCanonicalUrl("leaderboard", guildId), priority: 0.5 });
    for (const uploadId of uploadIds) sitemap.push({ url: getCanonicalUrl("ai-gallery", uploadId), priority: 0.4 });

    return new Response(`
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemap.map((site) => `
            <url>
                <loc>${site.url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>${site.priority}</priority>
            </url>
            `)}
        </urlset>`
        .replaceAll(",", ""), {
        headers: {
            "Content-Type": "text/xml"
        }
    });
}