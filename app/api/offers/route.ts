import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOfferNotification } from "@/lib/discord";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { accountId, offerAmount, buyerDiscord, buyerTelegram, message } = body;

  if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });
  if (!offerAmount || isNaN(parseFloat(offerAmount))) return NextResponse.json({ error: "Valid offerAmount required" }, { status: 400 });
  if (!buyerDiscord && !buyerTelegram) return NextResponse.json({ error: "At least one contact method required" }, { status: 400 });

  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (account.status !== "approved") return NextResponse.json({ error: "Listing not active" }, { status: 400 });

  const amount = parseFloat(offerAmount);

  // If offer beats the current C/O, update it
  if (amount > account.currentOffer) {
    await prisma.account.update({
      where: { id: accountId },
      data: { currentOffer: amount },
    });
  }

  try {
    await sendOfferNotification({
      account,
      offerAmount: amount,
      buyerDiscord: buyerDiscord ?? "",
      buyerTelegram: buyerTelegram ?? "",
      message: message ?? "",
    });
  } catch (err) {
    console.error("[Offers API] Discord notification failed:", err);
  }

  return NextResponse.json({ success: true });
}
