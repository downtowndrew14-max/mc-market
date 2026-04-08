import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.toLowerCase();
  const type = searchParams.get("type");
  const hasCape = searchParams.get("hasCape");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") ?? "newest";

  const accounts = await prisma.account.findMany({
    where: {
      ...(search ? { username: { contains: search, mode: "insensitive" } } : {}),
      ...(type && type !== "all" ? { type } : {}),
      ...(hasCape === "true" ? { hasCape: true } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
              ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
            },
          }
        : {}),
    },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" },
  });

  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.username || !body.price || !body.discord) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const account = await prisma.account.create({
    data: {
      username: body.username,
      price: parseFloat(body.price),
      type: body.type ?? "Full Access",
      hasCape: body.hasCape === true || body.hasCape === "true",
      capeType: body.capeType ?? "",
      nameChanges: parseInt(body.nameChanges ?? "0"),
      description: body.description ?? "",
      discord: body.discord,
    },
  });

  return NextResponse.json(account, { status: 201 });
}
