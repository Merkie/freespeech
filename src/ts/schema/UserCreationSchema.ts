import { z } from 'zod';

const UserCreationSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2),
	password: z.string().min(8)
});

export default UserCreationSchema;
