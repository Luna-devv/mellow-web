const ACTOR_POSTS_URL = "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?filter=posts_no_replies&includePins=false&limit=1&actor=";

interface ApiGetPost {
    feed: [{
        post: unknown;
        reply?: unknown;
    }];
    cursor: string;
}

export async function hasBlueskyPost(did: string) {
    const res = await fetch(ACTOR_POSTS_URL + did)
        .then((r) => r.json())
        .catch(() => null) as ApiGetPost | null;

    if (!res) return false;
    return !!res.feed.length;
}