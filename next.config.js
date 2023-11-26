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
            }
        ],
        domains: [
            "cdn.discordapp.com",
            "cdn.waya.one",
            "imagerenderer.waya.one"
        ]
    }
};

module.exports = nextConfig;