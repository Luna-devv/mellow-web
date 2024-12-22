It's absolutely crucial for people with speech impairments like aphonia or dysphonia. It ensures inclusivity and allows everyone to participate fully, promoting accessibility and community engagement.
<br />

<iframe src="https://www.youtube.com/embed/NS5fZ1ltovE" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Install Wamellow on your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard).
3. **🎉 Done!** Use the commands `/tts voice` for talking inside Voice Channels.
<br />
<br />

**Chat to Speech** *(optional)*

3. Select a channel to be used in the "Text to Speech" section on the website
4. Join any voice channel in your Server (be sure Wamellow can join and talk in it).
5. **🎉 Done!** Start writing messages in the selected channel for Wamellow to speak!

### 📑 Usage logs
Pick a channel where any Text to Speech events from your server should be logged, mainly for moderation purposes.
<br />
<br />

**Note:** This does not log any `/tts file` command usage.

### 😷 Priority role
Pick a role that lets users override other messages that are currently being spoken. This lets users start talking right away without the "please wait..." message popping up. It's a good idea to give this role to people who are actually disabled.

### 🔉 Announce user
Wamellow will announce which user is currently talking through it. If a user says "hello there," the bot will speak "Luna says: hello there."
<br />
<br />

**Note:** This feature is experimental. Please note that usernames written in languages other than the actual written message will cause the Text to Speech to fail.

### 🛒 Message queue
Queue up sent messages, messages are spoked in the same order as they were written.

### 🔏 Max message length
Set a maximum length for messages to avoid spamming.
<br />
<br />

Discord Nitro members can send messages with up to 4,000 characters, while non-Nitro members can only send 2,000. This is a Discord limitation.
<br />
<br />

While this feature is free, we would be grateful if you could consider [shooting us a donation](https://ko-fi.com/mwlica) or [voting on top.gg](/vote). Please note that messages longer than 300 characters are vote locked. Unfortunately, money and growth (sadly) don't grow on trees (money isn't exactly normal paper).

### 🤚 Blacklist users & roles
If you want to prevent certain users from using text or chat to speech, you can either use Discord's channel or integration permission system.

## Languages
Wamellows Text to Speech supports many languages, these include
- 🇺🇸 English (United States)
- 🇬🇧 English (United Kingdom)
- 🇦🇺 English (Australia)
- 🇩🇪 German
- 🇫🇷 French
- 🇪🇸 Spanish (ES & MX)
- 🇵🇹 Portuguese
- 🇮🇩 Indonesian
- 🇯🇵 Japanese
- 🇰🇷 Korean
<br />
<br />

- 🇺🇸 Singing:

Alto (Female), Warmy Breeze (Female), Glorious (Female), Dramatic (Female), Tenor (Male), Sunshine Soon (Male), Chipmunk (Male), It Goes Up (Male);
<br />
<br />

All languages have one or more variants, including male and female versions. (40 voices in 8 languages)
<br />
<br />

You can change your default language and voice either by running `/tts set speaker` or by [setting it on the dashboard](/profile/text-to-speech).

## Server nodes & regions
For optimal latency and performance when using Text to Speech in voice channels, Wamellow has multiple server nodes in different regions.
A list of available nodes and regions can be found [on the status page](/status).
<br />
<br />

If the voice channel's *Region Override* is set to `Automatic`, it will default to Frankfurt, Germany.
If an override is set, it will use the selected region, if available.

## Avoiding Chat-to-Speech
To prevent Wamellow from speaking your messages inside of Chat to Speech channels, simply take the following actions:
- Just add some special characters at the start of your message, like `!`, `?`, `>`, `.`, `,` and so on.
- If you're not connected to any voice channels, those messages will also be ignored.
- If you want to disable it permanently, you can use `/tts set chat-to-speech`.
<br />
<br />

**Note:** Any of those methods only apply to you and your own messages, and not to anyone else using Chat to Speech.
If you want to disable it for everyone, read the [setup section of these docs](#setup).

## Voice filters
Filters are a way to tamper with the voices when using Wamellow in VCs, they can be toggled using `/tts set filter` by VC moderators.
This setting applies to anyone currently using Wamellow in the VC, all filters will be removed once Wamellow leaves.
Multiple filters can be enabled and used at the same time.
<br />
<br />

All currently available filters:
- `Vaporwave`
- `Nightcore`
- `Rotation`
- `Tremolo`
- `Vibrato`
- `LowPass`
<br />
<br />

To change the volume of the TTS or mute it entirely for yourself,
- (desktop) Right-click Wamellow, and set the "User Volume" slider.
- (mobile) Open Wamellows' profile, and set the "Volume" slider.

![how to change the volume of wamellow tts](/docs-assets/tts-volume.webp)
