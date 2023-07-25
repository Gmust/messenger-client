import { z } from 'zod';


export const registerUserValidator = z.object({
  email: z.string().email(),
  name: z.string()
    .max(20)
    .min(2, { message: 'ProfileName must contain at least 2 symbols' }),
  password: z.string().min(8,{message: 'Password must contain at least 8 symbols'}),
  confirmPassword: z.string()
});