import type { Endpoints } from "@octokit/types";

export async function getRepository(fullname: string) {
    const res = await request<Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]>("GET", `/repos/${fullname}`);
    return res;
}

async function request<T>(method: "GET", path: string) {
    const response = await fetch(`https://api.github.com${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }
    });

    return response.json() as Promise<T>;
}