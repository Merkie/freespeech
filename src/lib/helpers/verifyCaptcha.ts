import { z } from 'zod';
import bcrypt from 'bcryptjs';

export default async ({ input, hash }: { input: string; hash: string }): Promise<boolean> => {
	const schema = z.object({
		input: z.string().min(1),
		hash: z.string().min(1)
	});

	if (!schema.safeParse({ input, hash }).success) {
		return false;
	}

	const isMatch = await bcrypt.compare(input, hash);

	if (!isMatch) {
		return false;
	}

	return true;
};
