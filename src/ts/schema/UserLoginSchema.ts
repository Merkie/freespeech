import { z } from 'zod';

const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export default UserLoginSchema;
