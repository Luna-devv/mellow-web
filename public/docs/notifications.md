- Instant notifications for **YouTube, Twitch, Bluesky and Reddit**, more comming soon!
- Every server can have **up to 30 different channels and users for free**.
- Notifications are sent **in real-time, almost instantly** after uploading.
- And **free custom messages** for every notification individually.
<br />

<iframe src="https://www.youtube.com/embed/xizs-hrwK4I" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=notifications).
3. Select your server from the dashboard.
4. Navigate to the **Notifications** tab.
5. Click **Create new Notification**, select a platform and enter a channel url or username.
7. Click **Submit** and start customizing your message!
<br/>
<br/>

No need to worry about creators changing their usernames — Wamellow updates them automatically.
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

### 📫 Filter
Allows you to select additional types or filter notifications for Bluesky:
- `Send Reposts` will also notify when the user reposts any post.
- `Send Replies` will also notify when the user replies to any post.
- `Send Quotes` will also notify when the user quotes any post.
- `Must Contain Image` will only notify when the post contains an image.
<br />
<br />

For all other services, you can take advantage of a regex to blacklist posts:
- `^\[live\]` will not post anything starting with `[live]`.
- `insult|badword` will not post anything that includes either `insult` or `badword`.
- `^(?!support$).+$` will only post that are `support`. (useful for reddit flairs)
<br />
<br />

You can use [regexr.com](https://regexr.com/) or [ChatGPT](https://chatgpt.com/) to create (JavaScript-like) regexs.
You can use regex keywords to negate the condition, in order to create a whitelist filter.
The flags used for string matching are `gi`, only the titles and reddit flairs are checked.

### 🥳 Test notification
Test notifications let you see how your message will look like when a video is uploaded or a streamer goes live, etc.

For the purpose of testing, all pings are disabled, so no member will get notified.
For streaming platforms, like Twitch, mock (fake) data is used to simulate a live stream.
Notification filters will be ignored.

## Better embeds
If you’d like to improve embeds (for example, fixing Bluesky embeds), you can use the following custom messages:
- `https://bskyx.app/profile/{creator.handle}/post/{post.id}` ([Lexedia/VixBluesky](https://github.com/Lexedia/VixBluesky))
- `https://fxbsky.app/profile/{creator.handle}/post/{post.id}` ([fxbsky.app](https://bsky.app/profile/fxbsky.app))
- `https://vxbsky.app/profile/{creator.handle}/post/{post.id}` ([dylanpdx/vxBsky](https://github.com/dylanpdx/vxBsky))
- `https://bskye.app/profile/{creator.handle}/post/{post.id}` ([FerroEduardo/bskye](https://github.com/FerroEduardo/bskye))
- `https://bsyy.app/profile/{creator.handle}/post/{post.id}`

A preview of all embeds can be found [in this reddit post](https://www.reddit.com/r/BlueskySocial/comments/1he642f/comparing_bluesky_fix_embed_sites/).

## Offline notifications
If Wamellow is offline when a video, stream or post is published, your notification will be queued and sent as soon as Wamellow comes back online. You can view Wamellow’s current status on [the status page](/status).

## Notification speed
Notifications are typically sent within these time frames:
- **YouTube**: 4 to 8 seconds
- **Twitch**: 10 to 100 seconds
- **Bluesky**: 0.4 to 0.6 seconds (400ms to 600ms)
- **Reddit**: up to 20 minutes

## Platform limitations
YouTube keeps the video private for a few seconds to minutes after uploading, so the notification might be delayed by a few seconds.
<br />
<br />

Due to changes in Reddits' API pricing in 2023, we can't offer faster notification speeds, but 20 minutes should be fine.
Since Reddit is still in testing, you can only setup 4 subreddits per server.

## Placeholders
Placeholders allow you to use variables that change from message to message, for example to display information about the uploaded video or creator. They are always enclosed in curly braces, such as `{creator.name}`.
<br />
<br />

<mark>
    These are only available for YouTube. (*1)
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
    These are only available for Twitch. (*2)
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
            <td><code>stream.game</code></td>
            <td>Grand Theft Auto V</td>
            <td>Game name</td>
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
    These are only available for Bluesky. (*3)
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
            <td><code>post.type</code>*</td>
            <td>post [or] repost [or] reply</td>
            <td>Post type</td>
        </tr>
        <tr>
            <td><code>post.text</code>*</td>
            <td>“sorry I don’t listen to music, the songs aren’t FOSS”</td>
            <td>Post text</td>
        </tr>
        <tr>
            <td><code>post.link</code></td>
            <td>https://bsky.app/profile/shi.gg/post/3lck23sfi522v</td>
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
            <td><code>creator.handle</code></td>
            <td>shi.gg</td>
            <td>Creator handle</td>
        </tr>
        <tr>
            <td><code>creator.posts</code></td>
            <td>784</td>
            <td>Amount of posts</td>
        </tr>
        <tr>
            <td><code>creator.followers</code></td>
            <td>48</td>
            <td>Amount of followers</td>
        </tr>
    </tbody>
</table>
<br />

*If a post is a reply, and your custom message is `{post.type}ed` it will display `replied to`, instead of `replyed`.

<br />
<br />

<mark>
    These are only available for Reddit. (*4)
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder (*4)</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>post.id</code></td>
            <td>1in69l2</td>
            <td>Post id</td>
        </tr>
        <tr>
            <td><code>post.title</code></td>
            <td>Some funny title</td>
            <td>Post title</td>
        </tr>
        <tr>
            <td><code>post.text</code></td>
            <td>A very, very long text</td>
            <td>Post body</td>
        </tr>
        <tr>
            <td><code>post.thumbnail</code></td>
            <td>https://.../..</td>
            <td>Post thumbnail</td>
        </tr>
        <tr>
            <td><code>post.flair</code></td>
            <td>Support</td>
            <td>Post flair</td>
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
            <td><code>author.username</code></td>
            <td>wayabot</td>
            <td>Author username</td>
        </tr>
        <tr>
            <td><code>author.id</code></td>
            <td>1ea1sud48</td>
            <td>Author id</td>
        </tr>
        <tr>
            <td><code>author.link</code></td>
            <td>https://reddit.com/user/wayabot</td>
            <td>Author url</td>
        </tr>
        <tr>
            <td><code>subreddit.name</code></td>
            <td>r/wamellow</td>
            <td>Subreddit name</td>
        </tr>
        <tr>
            <td><code>subreddit.id</code></td>
            <td>d6lqay</td>
            <td>Subreddit id</td>
        </tr>
        <tr>
            <td><code>subreddit.members</code></td>
            <td>1642519</td>
            <td>Subreddit members</td>
        </tr>
    </tbody>
</table>
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