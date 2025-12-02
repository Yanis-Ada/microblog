import { PrismaClient } from '@prisma/client';

// Instance unique de Prisma Client (singleton pattern)
export const prisma = new PrismaClient();

export default prisma;
