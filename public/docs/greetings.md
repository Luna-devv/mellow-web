Wamellow boasts a feature-rich greeter. This functionality enables the bot to automatically send a welcoming message in a designated channel whenever a new member joins, fostering a warm and inviting community atmosphere.
<br />
<br />

![welcome example](/docs-assets/welcome.webp?fullwidth=true)

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=greeting/welcome).
3. Select your server from the dashboard.
4. Navigate to the **Greetings** tab. 
5. Within the **Greetings** menu, locate and click on the **Welcome greeting** option.
6. Enable the Welcome module by clicking the enable button.
7. Set a channel to send greetings into.

### ✏️ Custom message & embed
You can create a welcoming message with a **fully customizable message and embed for free**, making it easy to convey your server's culture and values to your new members.

### 🖼️ Image card
You can create a nice welcome image by **customizing the background for free**.

![welcome image](/welcome.webp)

**Warning:**

Please do not forget to actually put in a direct link to the image, not a link to a website with the image.

Custom background image: `1024x256px` (width, height) and must be type of `.png`.
<br />
<br />
**Example custom backgrounds:**
- [images.wamellow.com/static/grass.jpg](https://images.wamellow.com/static/grass.jpg)
- [images.wamellow.com/static/orange-grass.jpg](https://images.wamellow.com/static/grass.jpg)
- [images.wamellow.com/static/red-grass.jpg](https://images.wamellow.com/static/red-grass.jpg)
- [images.wamellow.com/static/rank.png](https://images.wamellow.com/static/rank.png)

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