import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const account = await prisma.account.findUnique({
    where: { id },
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json(account);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // Only allow updating price and currentOffer
  const updateData: any = {};
  if (body.price !== undefined) updateData.price = parseFloat(body.price);
  if (body.currentOffer !== undefined) updateData.currentOffer = parseFloat(body.currentOffer);

  const account = await prisma.account.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(account);
}
