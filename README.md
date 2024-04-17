[![](https://img.shields.io/discord/828676951023550495?color=5865F2&logo=discord&logoColor=white)](https://lunish.nl/support)
![](https://img.shields.io/github/repo-size/Luna-devv/mellow-web?maxAge=3600)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I3I6AFVAP)

**⚠️ In development, breaking changes ⚠️**

## About
This is the [wamellow.com](https://wamellow.com) website for our Discord App, including the home page, leaderboards, passport, profile and server management.

If you need help developing with this, join **[our Discord Server](https://discord.com/invite/yYd6YKHQZH)**.

## Setup
Clone this repo with the following commands:

```bash
git clone https://github.com/Luna-devv/mellow-web
```

Create a `.env` file and add the following values:
```env
NEXT_PUBLIC_CAPTCHA_ID=""
NEXT_PUBLIC_API="https://api.local.wamellow.com/v1"
NEXT_PUBLIC_NEKOSTIC="https://nekostic.wamellow.com/statistics"
NEXT_PUBLIC_LOGIN="https://discord.com/oauth2/authorize?client_id=1116414956972290119&redirect_uri=https://local.wamellow.com/login&response_type=code&permissions=1426738113654&prompt=none&scope=identify+email+guilds"
NEXT_PUBLIC_BASE_URL="https://local.wamellow.com"

API_SECRET="a"

PLAUSIBLE_API="https://analytics.wamellow.com/api"
PLAUSIBLE_DOMAIN="wamellow.com"
PLAUSIBLE_API_KEY=""

RATINGS_API="http://100.65.0.1:5002"
CLIENT_ID="1125449347451068437"

DISCORD_TOKEN=""
```
For the `NEXT_PUBLIC_CAPTCHA_ID` register a https://www.geetest.com/en/ account, this is used for /passport's.
For the `API_SECRET` hack my computer to get access to the backend API and it's secrets. (dun't duh)
For the `PLAUSIBE_*` stuff you have to either create or selfhost https://plausible.com/
For the `RATINGS_API` enter a ip/domain to a ratings api duh, read the typings for a structure.
For the `CLIENT_ID` enter your Discord client id.
For the `DISCORD_TOKEN` go on repl.it and find a random repo that leaks the token and use it.

## Deploy
The bun package manager is cool, the runtime sucks imo tho, you can also use pnpm.

To run the develoment server run
```bash
bun dev
```

To build and run the website use
```bash
bun build
bun start
```
