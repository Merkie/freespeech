import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prismaClient = new PrismaClient();
export default prismaClient;
