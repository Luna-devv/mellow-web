/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
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
                hostname: "cdn.waya.one",
                port: "",
                pathname: "/r/**"
            },
            {
                protocol: "https",
                hostname: "image-api.wamellow.com",
                port: "",
                pathname: "/"
            },
            {
                protocol: "https",
                hostname: "r2.wamellow.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "ai.local.wamellow.com",
                port: "",
                pathname: "/static/**"
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
                hostname: "cdn.bsky.app",
                port: "",
                pathname: "/img/avatar/plain/**"
            }
        ]
    }
};

module.exports = nextConfig;