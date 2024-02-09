[![](https://img.shields.io/discord/828676951023550495?color=5865F2&logo=discord&logoColor=white)](https://lunish.nl/support)
![](https://img.shields.io/github/repo-size/Luna-devv/mellow-web?maxAge=3600)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I3I6AFVAP)

**⚠️ In development, breaking changes ⚠️**

## About
This is the [wamellow.com](https://wamellow.com) website for our discord bot, including the home page, leaderboards, passport, profile and server management.

If you need help developing with this, join **[our Discord Server](https://discord.com/invite/yYd6YKHQZH)**.

## Setup
Clone this repo with the following commands:

```bash
git clone [https://github.com/Luna-devv/nekostic](https://github.com/Luna-devv/mellow-web)
```

Create a `.env` file and add the following values:
```env
NEXT_PUBLIC_CAPTCHA_ID=
NEXT_PUBLIC_LANG_API="https://i18n.wamellow.com/v0"
NEXT_PUBLIC_API="https://api.wamellow.com/v1"
NEXT_PUBLIC_NEKOSTIC="https://nekostic.wamellow.com/statistics"
NEXT_PUBLIC_LOGIN="https://discord.com/oauth2/authorize?client_id=1125449347451068437&redirect_uri=https://wamellow.com/login&response_type=code"
API_SECRET=
NEXT_PUBLIC_BASE_URL="https://wamellow.com"
```
For the `NEXT_PUBLIC_CAPTCHA_ID` register a https://www.geetest.com/en/ account, this is used for /passport's. For the `API_SECRET` hack my computer to get access to the backend API and it's secrets. (dun't duh)

## Deploy

To run the develoment server run
```bash
pnpm dev
```

To build and run the website use
```bash
pnpm build
pnpm start
```
