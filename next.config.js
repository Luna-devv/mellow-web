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
                pathname: "/**"
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
                pathname: "/ai-image/**"
            },
            {
                protocol: "https",
                hostname: "ai.local.wamellow.com",
                port: "",
                pathname: "/static/**"
            }
        ]
    }
};

module.exports = nextConfig;