import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Email/Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().min(10, 'Valid mobile number required').max(10),
  password: z.string().min(6, 'Must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword']
})

export const addressSchema = z.object({
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode required').max(6),
  landmark: z.string().optional()
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email required')
})
