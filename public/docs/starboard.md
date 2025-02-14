The starboard serves as a channel for showcasing standout messages from your community. Members can "upvote" messages by reacting with a ⭐. Once a message gets a specified number of ⭐ reactions (for example, 3), it is automatically reposted in the `#starboard` channel. This creates a central hub for humorous, out-of-context, and memorable messages, creating eternal engagement within your community.
<br />
<br />

![starboard example](/docs-assets/starboard.webp?fullwidth=true)

## Setup
1. Install Wamellow on your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=starboard).
3. Select your server from the dashboard.
4. Navigate to the **Starboard** menu.
5. Enable the Starboard module by clicking the enable button.
6. Select a channel for messages to be posted into.
7. **🎉 Done!** Try it out by reacting to any message with the selected emote.

### 🤖 Allow bots & webhooks
Choose whether messages from bots or webhooks can be displayed on the starboard.

### 🔞 Allow NSFW
Specify whether wamellow should include messages from NSFW-marked channels in the starboard.

### 🖊️ Allow message edits
If allowed, messages that are edited will also be updated in the starboard.
<br />
<br />

**Note:** To prevent abusing the starboard, it's recommended to leave this option disabled.

### 🧑‍🦰 Allow author reaction
Whether the message author can star their own messages. When disallowed, the author's reaction will automatically be removed.

### 📝 Display message reference
Choose whether the replied message should be visible within the starboard or not.

![starboard message reference](/docs-assets/starboard-message-reference.webp)

### 🗑️ Delete message from starboard upon losing reactions
If a message in the starboard looses the required reactions, it gets deleted from the starboard. Messages will reappear once they gain enough reactions again.

### 🔢 Number of reactions required
Adjust the number of reactions needed with the chosen emote to send a message to the starboard channel.

### ⭐ Custom emoji
Select a custom emote required for reacting. This can be any default Discord emote or a custom emote from your server.

### 😍 Profile display style
Chose what should be displayed of the message author.
- Username (`@mwlica`)
- Global Nickname (`yll`)
- Guild Nickname (`Luna`)
- Guild Nickname & Per-Guild Avatar (`Luna`)
- Anonymous (removes the username & avatar)

### ⭐ Custom color
Select any RGB color for the message embed.

### 🤚 Blacklist roles
Specify roles that are restricted from starring other people's messages and prevent their own messages from appearing on the starboard.

### 🤚 Blacklist channels
Designate specific channels where message starring will be ignored.

