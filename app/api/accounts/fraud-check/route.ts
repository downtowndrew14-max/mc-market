import { NextRequest, NextResponse } from "next/server";
import { analyzeListing } from "@/lib/fraud-detection";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const fraudScore = analyzeListing(data);
  return NextResponse.json(fraudScore);
}
