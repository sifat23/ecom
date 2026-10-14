import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.__prisma ??
    new PrismaClient({
        log: env.isDev ? ['warn', 'error'] : ['error'],
    });

if (env.isDev) globalForPrisma.__prisma = prisma;