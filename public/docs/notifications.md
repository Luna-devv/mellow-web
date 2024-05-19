- We only support **YouTube**, use [NotifyMe](https://notifyme.bot) or [DisPing](https://disping.xyz) for Twitch, Kick, Twitter, etc.
- Every guild can have **up to 30 different channels for free**.
- Notifications are sent within **less than 1 (one) minute**.
- And **free custom message & embed** for every notification individually.
<br />
<br />

![notification example](/docs-assets/notifications-example.webp?fullwidth=true)


## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=notifications).
3. Select your server from the dashboard.
4. Navigate to the **YouTube Notifications** tab. 
5. Click **Add a YouTube channel** and enter a channel url/handle/id.
7. Click **Submit** and start customizing your message!
<br/>

![How to get YouTube channel handle or id](/docs-assets/notifications-get-handle.webp)

### ✏️ Custom message & embed
You can create a notification message with a **fully customizable message and embed for free**, enabling you to style the messages the way you love.

Image previews might be broken on the site*

### 🏓 Pings
The role that should get notified about new uploads.

(You can add more pings in the message content like `<@& 1200776778801750167>`)

## Placeholders
Placeholders allow you to use variables that change from message to message, for example to display information about the uploaded video or creator. They are always enclosed in curly braces, such as `{creator.name}`.

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
            <td><code>ping</code></td>
            <td><@&1200776778801750167></td>
            <td>Notification ping</td>
        </tr>
        <tr>
            <td><code>video.title</code></td>
            <td>Your PC Can Look Like THIS Now!</td>
            <td>Video title</td>
        </tr>
        <tr>
            <td><code>video.id</code></td>
            <td>74Lj5cHseI8</td>
            <td>Video id</td>
        </tr>
        <tr>
            <td><code>video.link</code></td>
            <td>https://www.youtube.com/watch?v=74Lj5cHseI8</td>
            <td>Video page</td>
        </tr>
        <tr>
            <td><code>video.thumbnail</code></td>
            <td>https://i4.ytimg.com/vi/74Lj5cHseI8/hqdefault.jpg</td>
            <td>Video thumbnail url</td>
        </tr>
        <tr>
            <td><code>video.uploaded.ago</code></td>
            <td><t:1715878720:R></td>
            <td>Time since upload</td>
        </tr>
        <tr>
            <td><code>video.uploaded.at</code></td>
            <td><t:1715878720:f></td>
            <td>Upload time & date</td>
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
            <td><code>creator.name</code></td>
            <td>Linus Tech Tips</td>
            <td>Creator username</td>
        </tr>
        <tr>
            <td><code>creator.id</code></td>
            <td>UCXuqSBlHAE6Xw-yeJA0Tunw</td>
            <td>Creator user id</td>
        </tr>
        <tr>
            <td><code>creator.link</code></td>
            <td>https://www.youtube.com/@LinusTechTips</td>
            <td>Creator page</td>
        </tr>
        <tr>
            <td><code>creator.avatar</code></td>
            <td>https://yt3.ggpht.com/...</td>
            <td>Creator avatar url</td>
        </tr>
        <tr>
            <td><code>creator.subs</code></td>
            <td>16M</td>
            <td>Subscriber count</td>
        </tr>
        <tr>
            <td><code>creator.videos</code></td>
            <td>6.9K</td>
            <td>Amount of videos</td>
        </tr>
        <tr>
            <td><code>creator.views</code></td>
            <td>7.8B</td>
            <td>Total views</td>
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