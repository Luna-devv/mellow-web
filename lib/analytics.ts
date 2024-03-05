export interface AnalyticsResponse {
    page: string;
    pageviews: number;
}

export interface AnalyticsError {
    error: string;
}

export async function getPageAnalytics(page: string): Promise<{ results: AnalyticsResponse[] } | AnalyticsError | undefined> {

    const params = {
        site_id: process.env.PLAUSIBLE_DOMAIN as string,
        period: "custom",
        date: "2021-01-01,2026-03-02",
        property: "event:page",
        filters: "event:page==" + page,
        metrics: "pageviews"
    };

    const res = await fetch(`${process.env.PLAUSIBLE_API}/v1/stats/breakdown?${objectToQueryString(params)}`, {
        headers: { Authorization: "Bearer " + process.env.PLAUSIBLE_API_KEY as string },
        next: { revalidate: 60 }
    });

    return res.json();
}

function objectToQueryString(obj: Record<string, string>): string {
    return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join("&");
}