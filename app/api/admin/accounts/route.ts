// app/api/admin/accounts/route.ts
// Admin-only API for managing all listings.
// Protected by Authorization: Bearer <ADMIN_SECRET> header.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postApprovedListing } from "@/lib/discord";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.warn("[Admin API] ADMIN_SECRET not set — all requests will be rejected.");
    return false;
  }
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  return token === secret;
}

/** GET /api/admin/accounts — Return all accounts (all statuses), newest first */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(accounts);
}

/** PATCH /api/admin/accounts — Update account status */
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, status } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "status must be one of: pending, approved, rejected" },
      { status: 400 }
    );
  }

  const account = await prisma.account.update({
    where: { id },
    data: { status },
  });

  // If approving via admin panel, post to the Discord listing channel
  if (status === "approved") {
    postApprovedListing(account).catch(console.error);
  }

  return NextResponse.json(account);
}

/** DELETE /api/admin/accounts — Permanently delete an account */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.account.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
