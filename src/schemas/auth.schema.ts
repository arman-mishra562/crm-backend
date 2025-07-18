import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
 sector: z.enum(['DIGIZIGN', 'ZURELABS', 'INTERNZITY', 'UNIZEEK']),

});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const verifySchema = z.object({
  token: z.string().nonempty('Token is required'),
});

export const resendSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password confirmation is required'),
});