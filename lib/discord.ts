// lib/discord.ts
// Discord bot helper: send listing notifications and verify interaction signatures
import * as nacl from "tweetnacl";

export type AccountForDiscord = {
  id: string;
  username: string;
  price: number;
  currentOffer: number;
  type: string;
  capes: string;
  nameChanges: number;
  description: string;
  discord: string;
  oguser: string;
  telegram: string;
};

/**
 * Sends a Discord bot message to the configured channel with Approve / Reject buttons.
 */
export async function sendListingNotification(account: AccountForDiscord): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;

  if (!token || !channelId) {
    console.warn("[Discord] DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID not set — skipping notification.");
    return;
  }

  const contactParts: string[] = [];
  if (account.discord) contactParts.push(`Discord: ${account.discord}`);
  if (account.oguser) contactParts.push(`OGUser: ${account.oguser}`);
  if (account.telegram) contactParts.push(`Telegram: ${account.telegram}`);
  const contactStr = contactParts.join(" | ") || "None";

  const nameChangesLabel =
    account.nameChanges === 0
      ? "Pre-name (0)"
      : account.nameChanges >= 15
      ? "15+"
      : String(account.nameChanges);

  const binLabel = account.price > 0 ? `$${account.price.toFixed(2)}` : "N/A";
  const coLabel = account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "N/A";

  const capeList = account.capes
    ? account.capes
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .join(", ")
    : "None";

  const body = {
    embeds: [
      {
        color: 0xe8497a,
        title: "🌸 New Listing Submitted",
        thumbnail: {
          url: `https://mc-heads.net/head/${account.username}/80`,
        },
        fields: [
          { name: "Username", value: account.username, inline: true },
          { name: "Type", value: account.type, inline: true },
          { name: "BIN Price", value: binLabel, inline: true },
          { name: "C/O Price", value: coLabel, inline: true },
          { name: "Name Changes", value: nameChangesLabel, inline: true },
          { name: "Capes", value: capeList, inline: true },
          {
            name: "Description",
            value: account.description || "No description provided.",
            inline: false,
          },
          { name: "Contact", value: contactStr, inline: false },
        ],
        footer: { text: `Listing ID: ${account.id}` },
        timestamp: new Date().toISOString(),
      },
    ],
    components: [
      {
        type: 1, // ACTION_ROW
        components: [
          {
            type: 2, // BUTTON
            style: 3, // SUCCESS (green)
            label: "✅ Approve",
            custom_id: `approve|${account.id}`,
          },
          {
            type: 2, // BUTTON
            style: 4, // DANGER (red)
            label: "❌ Reject",
            custom_id: `reject|${account.id}`,
          },
        ],
      },
    ],
  };

  const res = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[Discord] Failed to send notification: ${res.status} ${text}`);
  }
}

// Maps account type → the listing channel inside each Discord category
const LISTING_CHANNELS: Record<string, string> = {
  "OG":      "1491488746929918053", // #og-accounts
  "Semi-OG": "1491488747412258937", // #semi-og-accounts
  "Minecon": "1491488748456902846", // #minecon-accounts
  "3 Letter":"1491488749119606866", // #3-letter-accounts
};

/**
 * Posts an approved listing to the appropriate Discord listing channel.
 * Called after a listing is approved (via Discord button or admin panel).
 */
export async function postApprovedListing(account: AccountForDiscord): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return;

  const channelId = LISTING_CHANNELS[account.type];
  if (!channelId) {
    console.warn(`[Discord] No listing channel for type: ${account.type}`);
    return;
  }

  const contactParts: string[] = [];
  if (account.discord) contactParts.push(`Discord: \`${account.discord}\``);
  if (account.oguser) contactParts.push(`[OGUser](${account.oguser})`);
  if (account.telegram) contactParts.push(`Telegram: \`@${account.telegram}\``);
  const contactStr = contactParts.join(" • ") || "Not provided";

  const binLabel = account.price > 0 ? `$${account.price.toFixed(2)}` : "No BIN";
  const coLabel = account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "No offers";
  const ncLabel = account.nameChanges === 0 ? "Prename" : account.nameChanges >= 15 ? "15+" : String(account.nameChanges);

  const capes = account.capes
    ? account.capes.split(",").map(c => c.trim()).filter(Boolean)
    : [];
  const capesStr = capes.length > 0 ? capes.join(", ") : "None";

  const siteUrl = `https://mc-market.vercel.app/account/${account.id}`;

  const typeColors: Record<string, number> = {
    "OG": 0xf59e0b,
    "Semi-OG": 0x3b82f6,
    "Minecon": 0xa855f7,
    "3 Letter": 0x06b6d4,
  };

  const body = {
    embeds: [{
      color: typeColors[account.type] ?? 0xe8497a,
      author: {
        name: `${account.type} Listing`,
        icon_url: `https://mc-heads.net/head/${account.username}/64`,
      },
      title: account.username,
      url: siteUrl,
      thumbnail: { url: `https://mc-heads.net/body/${account.username}/128` },
      fields: [
        { name: "💰 BIN",          value: binLabel,  inline: true },
        { name: "📈 C/O",          value: coLabel,   inline: true },
        { name: "🔄 Name Changes", value: ncLabel,   inline: true },
        { name: "🎭 Capes",        value: capesStr,  inline: false },
        { name: "📝 Description",  value: account.description || "—", inline: false },
        { name: "📬 Contact",      value: contactStr, inline: false },
      ],
      footer: { text: "View on website →" },
      timestamp: new Date().toISOString(),
    }],
    components: [{
      type: 1,
      components: [{
        type: 2,
        style: 5, // LINK
        label: "View Listing",
        url: siteUrl,
      }],
    }],
  };

  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bot ${token}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[Discord] Failed to post approved listing: ${res.status} ${text}`);
  }
}

/**
 * Verifies a Discord interaction signature using tweetnacl (Ed25519).
 * More reliable than Web Crypto across all serverless environments.
 */
export function verifyDiscordSignature(
  publicKey: string,
  signature: string,
  timestamp: string,
  body: string
): boolean {
  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(publicKey, "hex")
    );
  } catch (err) {
    console.error("[Discord] Signature verification error:", err);
    return false;
  }
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string length");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return arr;
}
