import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    reactStrictMode: true,
    experimental: {
        turbopackFileSystemCacheForDev: true
    },
    images: {
        localPatterns: [
            {
                pathname: "/**"
            }
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/avatars/**"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/icons/**"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/emojis/**"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/banners/**"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/guilds/**"
            },

            {
                protocol: "https",
                hostname: "cdn.waya.one",
                port: "",
                pathname: "/r/**"
            },
            {
                protocol: "https",
                hostname: "images-v2.wamellow.com",
                port: "",
                pathname: "/api/greet"
            },
            {
                protocol: "https",
                hostname: "r2.wamellow.com",
                port: "",
                pathname: "/**"
            },

            {
                protocol: "https",
                hostname: "yt3.ggpht.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "static-cdn.jtvnw.net",
                port: "",
                pathname: "/jtv_user_pictures/**"
            },
            {
                protocol: "https",
                hostname: "static-cdn.jtvnw.net",
                port: "",
                pathname: "/user-default-pictures-uv/**"
            },
            {
                protocol: "https",
                hostname: "cdn.bsky.app",
                port: "",
                pathname: "/img/avatar/plain/**"
            },
            {
                protocol: "https",
                hostname: "i.scdn.co",
                port: "",
                pathname: "/image/**"
            }
        ]
    }
};

export default withSentryConfig(
    nextConfig,
    {
        org: "wamellow-kc",
        project: "web",
        silent: !process.env.CI,
        widenClientFileUpload: true,
        disableLogger: true,
        automaticVercelMonitors: true
    }
);