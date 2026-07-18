import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    where: { isActive: true },
  });

  return NextResponse.json({ prompts });
}