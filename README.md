[![](https://img.shields.io/discord/828676951023550495?color=5865F2&logo=discord&logoColor=white)](https://wamellow.com/support)
![](https://img.shields.io/github/repo-size/Luna-devv/mellow-web?maxAge=3600)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I3I6AFVAP)

**⚠️ In development, breaking changes ⚠️**

## About
This is the [wamellow.com](https://wamellow.com) website for our Discord App, including the home page, leaderboards, passport, profile and server management.

If you need help developing with this, join **[our Discord Server](https://discord.com/invite/yYd6YKHQZH)**.

Note that this project is not meant to be used by anyone else, including other bots, as it is specifically designed for our bot and the backend API stays private. We will not provide support for this project if you use it for your own bot, though you are allowed to by the license.

Other open source projects relating to Wamellow can be found on [wamellow.com/team](https://wamellow.com/team).

## Setup
Clone this repo with the following commands:

```bash
git clone https://github.com/Luna-devv/mellow-web
```

Create a `.env` file and add the following values:
```env
# Register a https://www.geetest.com/en/ account, this is used for
NEXT_PUBLIC_CAPTCHA_ID=""

# The API URL, this is the base URL for the backend
NEXT_PUBLIC_API="https://api.wamellow.com/v1"
API_SECRET=""

# The Nekostic API URL, https://github.com/Luna-devv/nekostic
NEXT_PUBLIC_NEKOSTIC="https://nekostic.wamellow.com/statistics"

# The base URL for the website, this is used for the meta tags and other things
NEXT_PUBLIC_BASE_URL="https://wamellow.com"

# https://plausible.com analytics
PLAUSIBLE_API="https://analytics.wamellow.com/api"
PLAUSIBLE_DOMAIN="wamellow.com"
PLAUSIBLE_API_KEY=""

# The base URL for the ratings API
RATINGS_API="http://localhost:5002"

# The Discord client ID and bot token
NEXT_PUBLIC_CLIENT_ID="1125449347451068437"
DISCORD_TOKEN=""

# A personal GitHub access token (read repositories)
GITHUB_TOKEN=""
```

## Developing
This project uses pnpm with nodejs, to start developing, run:

```bash
bun install
bun dev
```

## Deploy
To build and run the website use
```bash
bun build
bun start
```
or
```bash
docker build -t mw-web .
docker compose up -d
```
(docker is not tested nor maintained)