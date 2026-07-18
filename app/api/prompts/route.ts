import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
  const prompts = await prisma.prompt.findMany({
    where: { isActive: true },
  });

  return NextResponse.json({ prompts });
}