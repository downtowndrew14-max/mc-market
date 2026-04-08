# Discord Approval System — Setup Guide

## Environment Variables

Add these to your `.env` file (local) and to Vercel > Project > Settings > Environment Variables:

```env
DISCORD_BOT_TOKEN=        # Bot token from Discord Developer Portal > Bot
DISCORD_PUBLIC_KEY=       # From Discord Developer Portal > General Information
DISCORD_APPLICATION_ID=   # From Discord Developer Portal > General Information
DISCORD_CHANNEL_ID=       # Right-click channel in Discord > Copy Channel ID
ADMIN_SECRET=             # Any strong password you choose for /admin
```

---

## Step-by-Step Discord Setup

### 1. Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click **New Application**, give it a name (e.g. "MC Market Bot"), click **Create**

### 2. Get Your Keys

3. On the **General Information** page, copy:
   - **Application ID** → `DISCORD_APPLICATION_ID`
   - **Public Key** → `DISCORD_PUBLIC_KEY`

### 3. Create the Bot & Get Token

4. Go to the **Bot** tab in the left sidebar
5. Click **Reset Token** (confirm if prompted) → copy the token → `DISCORD_BOT_TOKEN`
6. Under **Privileged Gateway Intents**, enable **Message Content Intent** (good practice)

### 4. Invite the Bot to Your Server

7. Go to **OAuth2** > **URL Generator** in the left sidebar
8. Under **Scopes**, check: `bot`
9. Under **Bot Permissions**, check: `Send Messages`, `View Channels`
10. Copy the generated URL, open it in your browser, and invite the bot to your server

### 5. Get Your Channel ID

11. In Discord, open **User Settings** > **Advanced** > enable **Developer Mode**
12. Right-click the channel where you want listing notifications → **Copy Channel ID**
13. Set that as `DISCORD_CHANNEL_ID`

### 6. Set the Interactions Endpoint URL (after deploying)

14. Go back to your app's **General Information** page on the Discord Developer Portal
15. In the **Interactions Endpoint URL** field, enter:
    ```
    https://mc-market.vercel.app/api/discord/interactions
    ```
16. Click **Save Changes** — Discord will send a PING to verify the endpoint. It should return `{ "type": 1 }` (PONG) and validation will succeed.

### 7. Set ADMIN_SECRET

17. Choose any strong password (e.g. use a password manager to generate one)
18. Add it to Vercel env vars and your local `.env` as `ADMIN_SECRET`
19. Use that password to log in at `/admin`

---

## How It Works

1. User submits a listing via the form → saved to DB with `status: "pending"` → Discord bot posts an embed with **✅ Approve** / **❌ Reject** buttons to your channel
2. You (or a mod) clicks a button in Discord → Discord POSTs to `/api/discord/interactions` → DB status is updated → the Discord message is replaced with a confirmation showing who acted
3. The public browse page (`/browse`) only shows `status: "approved"` listings
4. The admin panel (`/admin`) shows all listings with filtering by status and manual approve/reject/delete controls

---

## Database Migration

After adding the `status` field to `schema.prisma`, run:

```bash
npx prisma db push
```

or generate and apply a migration:

```bash
npx prisma migrate dev --name add-status-field
```

Existing accounts will default to `"approved"` so they remain visible on the browse page.
