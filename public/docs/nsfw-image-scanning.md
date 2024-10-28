The **NSFW Moderation** feature in Wamellow provides server admins with automated tools to moderate NSFW images sent within the server. This feature helps keep the community safe and ensures compliance with server rules by flagging or restricting inappropriate images based on the server's chosen sensitivity level.
<br />
<br />

<!--![mod example](/docs-assets/***.webp?fullwidth=true) -->

## Setup
1. Add Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=nsfw-image-scanning).
3. Select your server from the dashboard.
4. Navigate to the **NSFW Moderation** tab.
5. Within the **NSFW Moderation** menu, locate the **Enable** button and activate NSFW moderation.
6. Customize the available settings based on your server's needs.

### 📄 Logging Channel
Specify a **logging channel** to receive notifications of flagged NSFW images. This channel will display a log entry each time NSFW moderation is triggered.

### ⚠️ Punishment
Determine the **punishment** for users who send NSFW images. Options may include actions such as warnings, temporary mutes, or bans, helping enforce your server’s rules.

### 📝 Whitelisted Channels
Select **channels** that should bypass NSFW scanning. Images sent in these channels will not be scanned for NSFW content.

### 🛡️ Whitelisted Roles
Assign **roles** that can bypass NSFW scanning. Users with these roles are permitted to send NSFW images without triggering moderation actions.

### 🎚️ Threshold
Adjust the **threshold** to set the sensitivity level at which an image is flagged as NSFW.
- **Lower values** make the scanner more sensitive, flagging more images.
- **Higher values** make the scanner less sensitive, which may allow borderline content.

Members with the **Manage Messages** permission bypass the NSFW image scanning automatically.