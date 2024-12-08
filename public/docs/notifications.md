- Instant notifications for **YouTube, Twitch and Bluesky (bsky.app)**, more comming soon!
- Every server can have **up to 30 different channels and streamers for free**.
- Notifications are sent **within five to ten seconds** after uploading.
- And **free custom messages** for every notification individually.
<br />

<iframe src="https://www.youtube.com/embed/xizs-hrwK4I" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=notifications).
3. Select your server from the dashboard.
4. Navigate to the **Notifications** tab.
5. Click **Create new Notification**, select a platform and enter a channel url or @handle.
7. Click **Submit** and start customizing your message!
<br/>
<br/>

No need to worry about creators changing their usernames—Wamellow updates them automatically.
You also don’t need to own the channel to create notifications. As long as the channel is public, you can add it.
<br/>
<br/>

![Channel url in browser example](/docs-assets/notifications-channel-urls.webp)

### ✏️ Custom message & embed
You can create a notification message with a **fully customizable message and embed for free**, enabling you to style the messages the way you love.
<br />
<br />

**Note:** Image previews might be broken on the dashboard.

### 🏓 Pings
The role that should get notified about new uploads.
- `@everyone` will ping every member in the server.
- `@here` will ping every *currently online* member in the server.
- `@some-role` will ping everyone with that role.
<br />
<br />

**Note:** If Wamellow does not have the `Mention Everyone` permissions inside the channel, it might not be able to actually notify members with those roles.

### 🥳 Test notification
Test notifications let you see how your message will look like when a video is uploaded or a streamer goes live, etc.

For the purpose of testing, all pings are disabled, so no member will get notified.
For streaming platforms, like Twitch, mock (fake) data is used to simulate a live stream.

## Placeholders
Placeholders allow you to use variables that change from message to message, for example to display information about the uploaded video or creator. They are always enclosed in curly braces, such as `{creator.name}`.
<br />
<br />

<mark>
    These are only available for YouTube notifications. (*1)
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder (*1)</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
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
            <td>https://youtube.com/watch?v=74Lj5cHseI8</td>
            <td>Video page</td>
        </tr>
        <tr>
            <td><code>video.thumbnail</code></td>
            <td>https://i4.ytimg.com/vi/74Lj5cHseI8/hqdefault.jpg</td>
            <td>Video thumnail</td>
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
            <td>Total channel views</td>
        </tr>
    </tbody>
</table>
<br />

<mark>
    These are only available for Twitch notifications. (*2)
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder (*2)</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream.title</code></td>
            <td>Watch my videos while I'm away on holidays in Fiji</td>
            <td>Stream title</td>
        </tr>
        <tr>
            <td><code>stream.id</code></td>
            <td>45123288363</td>
            <td>Stream id</td>
        </tr>
        <tr>
            <td><code>stream.link</code></td>
            <td>https://twitch.tv/darkviperau</td>
            <td>Stream page</td>
        </tr>
        <tr>
            <td><code>stream.thumbnail</code></td>
            <td>https://.../...</td>
            <td>Stream thumbnail</td>
        </tr>
        <tr>
            <td><code>stream.live.since</code></td>
            <td><t:1715878720:R></td>
            <td>Time since live</td>
        </tr>
        <tr>
            <td><code>stream.live.start</code></td>
             <td><t:1715878720:f></td>
            <td>Live start time</td>
        </tr>
    </tbody>
</table>
<br />

<mark>
    These are only available for Bluesky (bsky.app) notifications. (*3)
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder (*3)</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>post.id</code></td>
            <td>3lck23sfi522v</td>
            <td>Post id</td>
        </tr>
        <tr>
            <td><code>post.type</code></td>
            <td>post, repost</td>
            <td>Post or Repost</td>
        </tr>
        <tr>
            <td><code>post.link</code></td>
            <td>https://bsky.app/profile/lunish.nl/post/3lck23sfi522v</td>
            <td>Post page</td>
        </tr>
        <tr>
            <td><code>post.posted.ago</code></td>
            <td><t:1715878720:R></td>
            <td>Time since post</td>
        </tr>
        <tr>
            <td><code>post.posted.at</code></td>
            <td><t:1715878720:f></td>
            <td>Post time & date</td>
        </tr>
        <tr>
            <td><code>creator.followers</code></td>
            <td>18</td>
            <td>Amount of followers</td>
        </tr>
        <tr>
            <td><code>creator.posts</code></td>
            <td>20</td>
            <td>Amount of posts</td>
        </tr>
    </tbody>
</table>

<br />
<br />

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>ping</code></td>
            <td><@&1200776778801750167></td>
            <td>Notify members</td>
        </tr>
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
            <td>https://youtube.com/@LinusTechTips</td>
            <td>Creator page</td>
        </tr>
        <tr>
            <td><code>creator.avatar</code></td>
            <td>https://.../...</td>
            <td>Creator avatar url</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
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