import { z } from 'zod';


export const resetPasswordValidator = z.object({
  password: z.string().min(8, { message: 'Password must contain at least 8 symbols' }),
  confirmPassword: z.string()
});