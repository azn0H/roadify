import { z } from 'zod';

// User authentication and profile schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(1, 'Password is required'),
});

export const addUserSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
  role: z.enum(['student', 'teacher', 'admin']),
});

// Sale code schema
export const saleCodeSchema = z.string()
  .min(1, 'Sale code cannot be empty')
  .max(50, 'Sale code too long')
  .regex(/^[A-Z0-9]+$/, 'Sale code must contain only uppercase letters and numbers');

// Edge function validation schemas
export const createPaymentSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  saleCode: z.string().max(50).regex(/^[A-Z0-9]*$/).optional(),
});

export const deleteUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const sendApprovalEmailSchema = z.object({
  studentEmail: z.string().email('Invalid email address'),
  studentName: z.string().min(1, 'Name is required').max(200),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().max(1000).optional(),
});

// File upload validation
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${ALLOWED_FILE_EXTENSIONS.join(', ')}` 
    };
  }

  return { valid: true };
}
