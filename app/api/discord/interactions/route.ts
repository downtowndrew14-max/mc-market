// app/api/discord/interactions/route.ts
// Handles Discord interaction webhooks (button clicks for Approve / Reject)

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyDiscordSignature } from "@/lib/discord";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Read raw body text FIRST — required for signature verification
  const rawBody = await req.text();

  const signature = req.headers.get("x-signature-ed25519") ?? "";
  const timestamp = req.headers.get("x-signature-timestamp") ?? "";
  const publicKey = process.env.DISCORD_PUBLIC_KEY ?? "";

  if (!publicKey) {
    console.error("[Discord Interactions] DISCORD_PUBLIC_KEY not configured.");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Verify Discord's Ed25519 signature
  const isValid = verifyDiscordSignature(publicKey, signature, timestamp, rawBody);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse the verified body
  let interaction: DiscordInteraction;
  try {
    interaction = JSON.parse(rawBody) as DiscordInteraction;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Type 1: PING — Discord sends this to verify the endpoint
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 }); // PONG
  }

  // Type 3: MESSAGE_COMPONENT (button click)
  if (interaction.type === 3) {
    const customId: string = interaction.data?.custom_id ?? "";
    const [action, accountId] = customId.split("|");
    const adminUser =
      interaction.member?.user?.username ||
      interaction.user?.username ||
      "Admin";

    if (!accountId) {
      return NextResponse.json({ type: 1 });
    }

    if (action === "approve") {
      try {
        await prisma.account.update({
          where: { id: accountId },
          data: { status: "approved" },
        });
      } catch (err) {
        console.error("[Discord Interactions] Failed to approve account:", err);
      }

      return NextResponse.json({
        type: 7, // UPDATE_MESSAGE
        data: {
          embeds: [
            {
              color: 0x22c55e,
              title: "✅ Listing Approved",
              description: `Approved by **${adminUser}**`,
              footer: { text: `Listing ID: ${accountId}` },
              timestamp: new Date().toISOString(),
            },
          ],
          components: [], // Remove buttons after action
        },
      });
    }

    if (action === "reject") {
      try {
        await prisma.account.update({
          where: { id: accountId },
          data: { status: "rejected" },
        });
      } catch (err) {
        console.error("[Discord Interactions] Failed to reject account:", err);
      }

      return NextResponse.json({
        type: 7, // UPDATE_MESSAGE
        data: {
          embeds: [
            {
              color: 0xef4444,
              title: "❌ Listing Rejected",
              description: `Rejected by **${adminUser}**`,
              footer: { text: `Listing ID: ${accountId}` },
              timestamp: new Date().toISOString(),
            },
          ],
          components: [], // Remove buttons after action
        },
      });
    }
  }

  // Fallback PONG for any unhandled type
  return NextResponse.json({ type: 1 });
}

// ── TypeScript types for Discord interaction payloads ──────────────────────

interface DiscordInteraction {
  type: number;
  data?: {
    custom_id?: string;
    component_type?: number;
  };
  member?: {
    user?: {
      id?: string;
      username?: string;
    };
  };
  user?: {
    id?: string;
    username?: string;
  };
}
