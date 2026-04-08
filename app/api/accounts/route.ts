import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendListingNotification } from "@/lib/discord";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const types = searchParams.getAll("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const priceType = searchParams.get("priceType") ?? "both";
  const maxNameChanges = searchParams.get("maxNameChanges");
  const minUsernameLen = searchParams.get("minUsernameLen");
  const maxUsernameLen = searchParams.get("maxUsernameLen");
  const sort = searchParams.get("sort") ?? "newest";

  const accounts = await prisma.account.findMany({
    where: {
      status: "approved", // Public browse only shows approved listings
      ...(search ? { username: { contains: search, mode: "insensitive" } } : {}),
      ...(types.length > 0 ? { type: { in: types } } : {}),
      ...(minPrice || maxPrice
        ? { price: { ...(minPrice ? { gte: parseFloat(minPrice) } : {}), ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}) } }
        : {}),
      ...(maxNameChanges !== null ? { nameChanges: { lte: parseInt(maxNameChanges) } } : {}),
    },
    orderBy:
      sort === "bin-asc" ? { price: "asc" }
      : sort === "bin-desc" ? { price: "desc" }
      : sort === "oldest" ? { createdAt: "asc" }
      : { createdAt: "desc" },
  });

  let filtered = accounts;

  // Filter by price type
  if (priceType === "bin") filtered = filtered.filter((a) => a.price > 0);
  else if (priceType === "co") filtered = filtered.filter((a) => a.currentOffer > 0);

  // Filter by username length
  if (minUsernameLen) filtered = filtered.filter((a) => a.username.length >= parseInt(minUsernameLen));
  if (maxUsernameLen) filtered = filtered.filter((a) => a.username.length <= parseInt(maxUsernameLen));

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.username) return NextResponse.json({ error: "Username required" }, { status: 400 });
  if (!body.price && !body.currentOffer) return NextResponse.json({ error: "At least one price required" }, { status: 400 });
  if (!body.discord && !body.oguser && !body.telegram) return NextResponse.json({ error: "At least one contact method required" }, { status: 400 });

  const account = await prisma.account.create({
    data: {
      username: body.username,
      price: parseFloat(body.price ?? "0"),
      currentOffer: parseFloat(body.currentOffer ?? "0"),
      type: body.type ?? "Other",
      capes: Array.isArray(body.capes) ? body.capes.join(",") : (body.capes ?? ""),
      nameChanges: parseInt(body.nameChanges ?? "0"),
      description: body.description ?? "",
      discord: body.discord ?? "",
      oguser: body.oguser ?? "",
      telegram: body.telegram ?? "",
      status: "pending", // New submissions start as pending until reviewed
    },
  });

  // Send Discord notification — non-blocking, errors don't break submission
  try {
    await sendListingNotification(account);
  } catch (err) {
    console.error("[Accounts API] Discord notification failed:", err);
  }

  return NextResponse.json(account, { status: 201 });
}
