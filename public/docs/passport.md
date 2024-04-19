Passport is essential for verifying users joining your Discord server, utilizing captchas as the method to authenticate users effectively and maintain security.

[View a interactive example passport](/passport/1125063180801036329)

## Setup
1. Install Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard).
3. Select your server from the dashboard.
4. Navigate to the **Greetings** menu. 
5. Within the **Greetings** menu, locate and click on the **Passport** tab. 
6. Enable the Passport module by clicking the enable button.
7. Set a verified role which members will get uppon verifying.
8. Remove permissions of the @everyone role to write messages in every channel. 
9. Click `Copy link to Passport` and send it into your `#verify` channel.
10. Get an alt-account and test out the verification process.
11. **🎉 Done!** Your server is now secure.

![passport setup example](/docs-assets/passport-setup.webp)

![channel permission setup](/docs-assets/passport-permissions.webp)

### 🔒 Send direct message to member on fail
If the member should recieve a DM if they failed verification, along with the following punishment (eg.: a ban).

### 💬 Logging channel
The channel where passport logs should be sent into, such as verification success and failures.

### 🔐 Unverified role
The role members should recieve on join, this role shouldn't have write permissions in channels.

### 🔓 Verified role
**Required!** The role members should recive on verification success. This role should have read and write access to all public channels.

### ⚙️ Failed verification action
What should happen with the member if they fail verification.
- Ban member
- Kick member
- Assign role to member*
<br />
*requires a `punishment role` to be set.

### 🧨 Punishment role
Which role members should recive when failing verification.

**Note:** This required the `failed verification action` to be set to `Assign role to member`.