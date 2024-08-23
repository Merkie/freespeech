import type { User } from '$ts/common/types';
import type { PrismaClient } from '@prisma/client';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
			prisma: PrismaClient;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
