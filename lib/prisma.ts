import { PrismaClient } from '@prisma/client';

// Évite de créer plusieurs connexions à la base de données pendant le développement
// (Next.js recharge le code souvent, sans cette astuce ça créerait des dizaines de connexions)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}