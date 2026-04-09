import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const account = await prisma.account.findUnique({
    where: { id: params.id },
    select: { price: true, createdAt: true },
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Mock price history for now - in production you'd store actual price changes
  const history = [
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), price: account.price * 0.9 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), price: account.price * 0.95 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), price: account.price * 1.05 },
    { date: new Date().toISOString(), price: account.price },
  ];

  return NextResponse.json(history);
}
