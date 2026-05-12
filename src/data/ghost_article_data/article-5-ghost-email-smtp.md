# Ghost CMS Email Configuration: Mailgun, Brevo, and SMTP Troubleshooting

**Target keywords:** Ghost CMS email setup, Ghost CMS SMTP configuration, Ghost Mailgun setup, Ghost Brevo SMTP, Ghost email not working, configure email Ghost self-hosted

---

One of the first things that breaks on a fresh Ghost self-hosted installation is email. Without SMTP configured, Ghost can't send staff invites, member welcome emails, password resets, or newsletter content. This guide covers everything you need to get email working correctly.

---

## Why Ghost Needs Email

Ghost uses email for several critical functions:

- **Staff invitations** — inviting team members to your Ghost admin
- **Password resets** — for admin and member accounts
- **Member portal** — magic link sign-ins for newsletter subscribers
- **Newsletter sending** — if you use Ghost's built-in newsletter feature

None of these work without a working SMTP configuration. On Ghost Pro, email is handled for you. On self-hosted Ghost, you configure it yourself.

---

## Where to Configure Email in Ghost

Edit your production config file:

```bash
sudo nano /var/www/ghost/config.production.json
```

The mail section goes inside the root JSON object, alongside your database and server configs:

```json
{
  "url": "https://yourdomain.com",
  "server": {
    "port": 2368,
    "host": "127.0.0.1"
  },
  "database": {
    ...
  },
  "mail": {
    "transport": "SMTP",
    "options": {
      "host": "smtp.your-provider.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "your-smtp-username",
        "pass": "your-smtp-password"
      }
    },
    "from": "'Your Blog Name' <hello@yourdomain.com>"
  }
}
```

After saving, always restart Ghost:

```bash
ghost restart
```

---

## Option 1: Mailgun (Recommended for Most Setups)

Mailgun's free tier gives you 5,000 emails/month and works immediately without manual account activation.

### Step 1: Sign Up and Add Your Domain

1. Create an account at [mailgun.com](https://mailgun.com)
2. Go to **Sending → Domains → Add New Domain**
3. Use a subdomain like `mg.yourdomain.com`
4. Add the DNS records Mailgun shows you to your domain registrar

DNS records to add:

| Type | Hostname | Value |
|---|---|---|
| TXT | `mg.yourdomain.com` | `v=spf1 include:mailgun.org ~all` |
| TXT | `k1._domainkey.mg.yourdomain.com` | (Mailgun provides the full value) |
| CNAME | `email.mg.yourdomain.com` | `mailgun.org` |
| MX | `mg.yourdomain.com` | `mxa.mailgun.org` (priority 10) |

> If you're using Cloudflare, set CNAME and MX records to **DNS Only** (grey cloud, not orange).

### Step 2: Get SMTP Credentials

In Mailgun → **Sending → Domain Settings → SMTP Credentials**:
- SMTP hostname: `smtp.mailgun.org`
- Port: `587`
- Username: `postmaster@mg.yourdomain.com`
- Password: Click **Reset password** to generate one

### Step 3: Add to Ghost Config

```json
"mail": {
  "transport": "SMTP",
  "options": {
    "service": "Mailgun",
    "host": "smtp.mailgun.org",
    "port": 587,
    "auth": {
      "user": "postmaster@mg.yourdomain.com",
      "pass": "YOUR_MAILGUN_SMTP_PASSWORD"
    }
  },
  "from": "'Blog Name' <hello@yourdomain.com>"
}
```

**Quick test option (Mailgun sandbox):** If you don't want to wait for DNS propagation, Mailgun provides a sandbox domain you can use immediately. It can only send to authorized recipients (emails you add manually in the Mailgun dashboard), but it's useful for testing staff invites.

---

## Option 2: Brevo (Formerly Sendinblue)

Brevo's free plan includes 300 emails/day. However, new accounts require manual SMTP activation before you can send.

### Getting the Right Credentials

This is the most common source of confusion with Brevo. There are **two different types of credentials** and you must use the right one:

| Credential type | Starts with | Used for |
|---|---|---|
| SMTP key | `xsmtpsib-` | SMTP authentication ✅ |
| API key | `xkeysib-` | REST API calls only ❌ |

**Never use your API key for SMTP.** Ghost's mail transport uses SMTP, so you need the SMTP key.

### Where to Find Your SMTP Credentials in Brevo

1. Log into [app.brevo.com](https://app.brevo.com)
2. Click your account name (top right) → **SMTP & API**
3. Click the **SMTP** tab (not the API Keys tab)
4. Your SMTP login will be in format: `xxxxxxx@smtp-brevo.com`
5. Click **Generate new SMTP key** if you don't have one — save it immediately, it won't be shown again

### Ghost Config for Brevo

```json
"mail": {
  "transport": "SMTP",
  "options": {
    "host": "smtp-relay.brevo.com",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "xxxxxxx@smtp-brevo.com",
      "pass": "xsmtpsib-YOUR-SMTP-KEY-HERE"
    }
  },
  "from": "'Blog Name' <verified-sender@yourdomain.com>"
}
```

### Activating Brevo SMTP

If you get a `535 Authentication failed` error with correct credentials, your account's SMTP sending may not be activated yet. Contact Brevo support to activate it, or temporarily switch to Mailgun while waiting.

---

## Testing Your Email Configuration

Test SMTP connectivity from your server before restarting Ghost:

```bash
# Check if port 587 is reachable
telnet smtp-relay.brevo.com 587
```

If you see `220 ESMTP Service Ready`, the connection is working. Type `QUIT` to exit.

For a full send test, use Node.js (already installed with Ghost):

```bash
node <<'EOF'
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // or smtp.mailgun.org
  port: 587,
  secure: false,
  auth: {
    user: 'YOUR_SMTP_LOGIN',
    pass: 'YOUR_SMTP_KEY'
  }
});

transporter.sendMail({
  from: 'verified-sender@yourdomain.com',
  to: 'your-test-email@gmail.com',
  subject: 'Ghost Email Test',
  text: 'Email is working!'
}, (err, info) => {
  if (err) {
    console.log('Error:', err.message);
  } else {
    console.log('Success! Message ID:', info.messageId);
  }
  process.exit();
});
EOF
```

---

## Common SMTP Errors and Fixes

### `535 5.7.8 Authentication failed` (EAUTH)

**Causes:**
- Using API key instead of SMTP key (most common with Brevo)
- Brevo account SMTP not activated
- Wrong username format

**Fix:** Go to Brevo's SMTP tab, not API Keys tab. Regenerate your SMTP key if needed.

### `ECONNREFUSED` or Connection Timeout

**Cause:** Port 587 is blocked by your VPS provider or firewall.

**Fix:**
- Check your VPS firewall allows outbound connections on port 587
- Some providers (like certain AWS regions) block port 25/587 by default — contact support to unblock
- Try port 465 with `"secure": true` instead

### Emails Going to Spam

**Fix:**
- Make sure your `from` address matches a domain you've verified with your SMTP provider
- Add SPF, DKIM, and DMARC records for your sending domain
- Don't use a Gmail address as the `from` — use your own domain

### Staff Invite Email Never Arrives

**Fix:** After configuring email, have the admin resend the invite from **Settings → Staff**. The original invite that was sent before email was configured will not retroactively deliver.

---

## Ghost Email Config: Do's and Don'ts

✅ Use your domain email as the `from` address  
✅ Use the SMTP key (not API key) for authentication  
✅ Keep `"secure": false` with port 587 (STARTTLS)  
✅ Back up your config before editing  
✅ Restart Ghost after every config change  

❌ Don't add `"rejectUnauthorized": false` — it disables SSL certificate verification and is a security risk  
❌ Don't use `"secure": true` with port 587 — that combination is for port 465 only  
❌ Don't use your Brevo account password — use the SMTP key  

---

## Summary

Email is not optional for a properly functioning Ghost site. Mailgun is the easiest option with the least friction for new setups. Brevo is a solid alternative but requires careful attention to which credential type you use. After configuring, always test with a Node.js send test before restarting Ghost, so you can debug SMTP issues independently.

---

*Related: [Installing Ghost CMS on a VPS](#) | [Ghost Staff Roles and User Management](#)*
