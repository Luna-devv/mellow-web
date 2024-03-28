Passport is essential for verifying users joining your Discord server, utilizing captchas as the method to authenticate users effectively and maintain security.

## Setup
1. Install Wamellow to your server by going to [wamellow.com/add](https://wamellow.com/add).
2. Head to the dashboard by going to [wamellow.com/dashboard](https://wamellow.com/dashboard).
3. Select your server from the dashboard.
4. Navigate to the **Greetings** menu. 
5. Within the **Greetings** menu, locate and click on the **Passport** option. 
6. Enable the Passport module by clicking the enabling button.
7. Click `copy link to passport` and send it into your `#verify` channel.
8. Get an alt-account and test out the verification process.
7. **🎉 Done!** Your server is now secure.

### 🔒 Send direct message to member on fail
If the member should recieve a DM if they failed verification, along with the following punishment (eg.: a ban).

### 💬 Logging channel
The channel where passport logs should be sent into, such as verification success and failures.

### 🔐 Unverified role
The role members should recieve on join, this role shouldn't have write permissions in channels.

### 🔓 Verified role
The role members should recive on verification success, this role should grand members access to channels.

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