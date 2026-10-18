import { z } from 'zod';

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(9),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
  });
