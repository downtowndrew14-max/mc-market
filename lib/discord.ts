// lib/discord.ts
// Discord bot helper: send listing notifications and verify interaction signatures
import nacl from "tweetnacl";

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
    const encoder = new TextEncoder();
    return nacl.sign.detached.verify(
      encoder.encode(timestamp + body),
      hexToUint8Array(signature),
      hexToUint8Array(publicKey)
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
