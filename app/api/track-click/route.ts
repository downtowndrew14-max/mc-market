import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { source } = await request.json();

    // Record the click in database
    await prisma.click.create({
      data: {
        source: source || 'unknown',
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Get click stats
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clicksToday = await prisma.click.count({
      where: {
        timestamp: {
          gte: today,
        },
      },
    });

    const totalClicks = await prisma.click.count();

    return NextResponse.json({
      clicksToday,
      totalClicks,
    });
  } catch (error) {
    console.error('Click stats error:', error);
    return NextResponse.json({ clicksToday: 0, totalClicks: 0 }, { status: 500 });
  }
}
