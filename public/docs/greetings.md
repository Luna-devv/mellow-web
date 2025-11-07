Wamellow boasts a feature-rich greeter. This functionality enables the bot to automatically send a welcoming message in a designated channel whenever a new member joins, fostering a warm and inviting community atmosphere.
<br />
<br />

![welcome example](/docs-assets/welcome.webp?fullwidth=true)

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=greeting/welcome).
3. Select your server from the dashboard.
4. Navigate to the **Greetings** tab and then go to **Welcome**.
5. Enable the Welcome module by clicking the enable button.
6. Set a channel to send greetings into.

### ✏️ Custom message & embed
You can create a welcoming message with a **fully customizable message and embed for free**, making it easy to convey your server's culture and values to your new members.

### 🖼️ Image card
<mark>
    Please provide a direct link to the image, not a link to a website containing the image.
</mark>

You can create a nice welcome image by **customizing the background for free**.

![welcome image](/welcome.webp)

Custom background image must be `906x256px` (width, height) and type of `.png`, `.jpg`, `.jpeg`, or `.webp`.<br />
Please note that `cdn.discordapp.com` no longer works due to [attachment authentication](https://discord.com/channels/613425648685547541/697138785317814292/1157372186160537750), you can upload images to [postimg.cc](https://postimg.cc/) and copy the direct image url.
<br />
<br />

### 🧨 Auto delete
Automatically delete the welcome message after a certain amount of time. Set to 0 seconds to not delete.

### 🏓 Pings
Ghost ping members in up to 5 channels when they join, the ghost pings will be instantly deleted.

### 👀 Roles
Assign up to 5 roles to new members.

### ♻️ Restore roles & nick after rejoin
You can re-assign all roles and past nickname when a member left and rejoins your server.

### 💬 Direct Message
If you want to send a direct message to your new members, Wamellow also allows you to do so with a fully custom message and/or embed.

### 🎉 Reactions
If you want, you can also make Wamellow react with up to 2 emojis to your custom welcome message or to your members's first message.

**Note:** The emojis must be from the same server.

### 👋 Click to say hi
Bring Discord's "Wave to say hi!" feature to Wamellow's custom messages, just with a random greet instead of a random sticker!
<br />
<br />
![wave to say hi! example](/docs-assets/welcomer-wtsh.png)


**Supported customizations are:**
- Button color (`grey`, `blurple`, `green`, `red`)
- Button emoji (must be from same server)
- Toggle ping

## Behavior
The timing of when the welcome module triggers depends on which Discord or Wamellow features you have enabled in your server. If you're using Discord's [Community Onboarding](https://support.discord.com/hc/en-us/articles/10394859532823-Community-Onboarding-Examples), [Server Member Applications](https://support.discord.com/hc/en-us/articles/29729107418519-Server-Member-Applications), or [Wamellow's Passport](/docs/passport), the welcome message will be delayed until the respective process is completed.
<br />
<br />

If you're using ..., the welcome module will be triggered when the user ...
- **Community Onboarding**: completes the onboarding process.
- **Server Member Applications**: has been approved.
- **Passport**: was successfully verified.
- **none of the above**: joins the server.
<br />
<br />

If you have multiple methods enabled, the welcome module will trigger based on whichever process completes last.

## Placeholders
Placeholders allow you to use variables that change from message to message, for example to display information about the joining user or your server. They are always enclosed in curly braces, such as `{user.username}`.

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user.mention</code></td>
            <td><@821472922140803112></td>
            <td>User mention</td>
        </tr>
        <tr>
            <td><code>user.id</code></td>
            <td>821472922140803112</td>
            <td>User id</td>
        </tr>
        <tr>
            <td><code>user.tag</code></td>
            <td>@mwlica</td>
            <td>User tag</td>
        </tr>
        <tr>
            <td><code>user.name</code></td>
            <td>yll</td>
            <td>Username</td>
        </tr>
        <tr>
            <td><code>user.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Avatar URL</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>guild.name</code></td>
            <td>Someone's</td>
            <td>Server name</td>
        </tr>
        <tr>
            <td><code>guild.id</code></td>
            <td>828676951023550495</td>
            <td>Server id</td>
        </tr>
        <tr>
            <td><code>guild.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Icon URL</td>
        </tr>
        <tr>
            <td><code>guild.rules</code></td>
            <td><#883818033867542648></td>
            <td>Rules channel</td>
        </tr>
        <tr>
            <td><code>guild.memberCount</code></td>
            <td>848</td>
            <td>Member count</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>inviter.mention</code></td>
            <td><@821472922140803112></td>
            <td>User mention</td>
        </tr>
        <tr>
            <td><code>inviter.id</code></td>
            <td>821472922140803112</td>
            <td>User id</td>
        </tr>
        <tr>
            <td><code>inviter.tag</code></td>
            <td>@mwlica</td>
            <td>User tag</td>
        </tr>
        <tr>
            <td><code>inviter.name</code></td>
            <td>yll</td>
            <td>Username</td>
        </tr>
        <tr>
            <td><code>inviter.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Avatar URL</td>
        </tr>
        <tr>
            <td><code>inviter.code</code></td>
            <td>yYd6YKHQZH</td>
            <td>Invite code</td>
        </tr>
        <tr>
            <td><code>inviter.count</code></td>
            <td>259</td>
            <td>Count of invited users</td>
        </tr>
    </tbody>
</table>