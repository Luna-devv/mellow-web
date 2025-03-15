import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const revalidate = 691200; // 8 days

export function GET() {
    return Response.json(
        {
            client_id: getCanonicalUrl("bluesky-client-metadata.json"),
            client_name: "Wamellow",
            client_uri: getBaseUrl(),
            logo_uri: getCanonicalUrl("waya-v3.webp"),
            tos_uri: getCanonicalUrl("terms"),
            policy_uri: getCanonicalUrl("privacy"),
            redirect_uris: [
                getCanonicalUrl("login", "bluesky")
            ],
            scope: "atproto transition:generic",
            grant_types: [
                "authorization_code",
                "refresh_token"
            ],
            response_types: [
                "code"
            ],
            token_endpoint_auth_method: "none",
            application_type: "web",
            dpop_bound_access_tokens: true
        },
        {
            headers: {
                "Cache-Control": "public, s-maxage=691200, immutable"
            }
        }
    );
}