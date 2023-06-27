import { z } from 'zod';


export const loginUserValidator = z.object({
  email: z.string().email(),
  password: z.string()
});