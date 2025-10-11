// Shared validation utilities for edge functions
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const createPaymentSchema = z.object({
  courseId: z.string().uuid({ message: "Invalid course ID format" }),
  saleCode: z.string().max(50).regex(/^[A-Z0-9]*$/, { message: "Sale code must contain only uppercase letters and numbers" }).optional(),
});

export const deleteUserSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format" }),
});

export const sendApprovalEmailSchema = z.object({
  studentEmail: z.string().email({ message: "Invalid email address" }),
  studentName: z.string().min(1).max(200, { message: "Name too long" }),
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().max(1000, { message: "Rejection reason too long" }).optional(),
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      success: false,
      error: `${firstError.path.join('.')}: ${firstError.message}`,
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}
