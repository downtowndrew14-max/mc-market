import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const recentAccounts = await prisma.account.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      username: true,
      price: true,
      createdAt: true,
    },
  });

  const activities = recentAccounts.map((account) => ({
    id: account.id,
    type: "listing" as const,
    username: account.username,
    accountId: account.id,
    price: account.price,
    timestamp: account.createdAt.toISOString(),
  }));

  return NextResponse.json(activities);
}
