Passport is essential for verifying users joining your Discord server, utilizing captchas as the method to authenticate users effectively and maintain security.

[View a interactive example passport](/passport/1125063180801036329)

## Setup
1. Install Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard?to=greeting/passport).
3. Select your server from the dashboard.
4. Navigate to the **Greetings** tab and go to **Passport**.
5. Enable the Passport module by clicking the enable button.
6. Set a verified role which members will get uppon verifying.
7. Remove permissions of the @everyone role to write messages in every channel.
8. Click `Copy link to Passport` and send it into your `#verify` channel.
9. Get an alt-account and test out the verification process.
10. **🎉 Done!** Your server is now secure.
<br />
<br />

![passport verification flow chart](/docs-assets/passport-flow.webp?fullwidth=true)
<br />
<br />
If you're also using [Wamellow Greetings](/docs/greetings), Wamellow will send the welcome message once the member has been verified.

### 📑 Logging channel
The channel where passport logs should be sent into, such as verification success and failures. Server moderators and admins will be able to override passport actions (eg.: manually verifying or punishing members).
![passport log examample](/docs-assets/passport-log.webp)

### 🔐 Unverified role
The role members should recieve on join, this role shouldn't have write permissions in channels. This role will be removed once a member either passes or fails verification.

### 🔓 Verified role
**Required!** The role members should recive on verification success. This role should have read and write access to all public channels.
<br />
<br />
If you're also using [Wamellow Greetings](/docs/greetings), Wamellow will also assign all other roles to the member once verified.

### ⚙️ Failed verification action
What should happen with the member if they fail verification.
- Ban member
- Kick member
- Assign role to member*
<br />
*requires a punishment role to be set.

### 🧨 Punishment role
Which role members should recive when failing verification. This role should have no permissions in any channel. Members with this role cannot verify again.
<br />
<br />

**Note:** This requires the failed verification action to be set to "Assign role to member".

### 💬 Send direct message to member on fail
If the member should recieve a DM if they failed verification, along with the following punishment (eg.: a ban).

## Permissions
Here is a quick reference on how permissions should be setup so everything works as expected.

![channel permission setup](/docs-assets/passport-permissions.webp?fullwidth=true)

## Failure conditions
There are a few reasons why a member might fail verification. These may include but are not limited to:
- The captcha wasn't solved correctly for eight or more times.
- The user uses a disposable email address.
- The user uses a VPN or proxy. (experimental)
<br />
<br />

Once people have failed verification due to any reason, they will not be able to verify again at any time, and manual approval by server moderators or admins is required. Wamellow developers cannot verify or punish members in any server.
