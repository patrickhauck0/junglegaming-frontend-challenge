import { z } from 'zod';

export const CouponSchema = z.object({
  code: z.string(),
  discountPercent: z.number().int().min(1).max(100),
  isValid: z.boolean(),
  isExpired: z.boolean().default(false),
  description: z.string().optional(),
});
export type Coupon = z.infer<typeof CouponSchema>;

export const QuoteRequestSchema = z.object({
  items: z.array(
    z.object({
      nftId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
  couponCode: z.string().optional(),
  network: z.enum(['Ethereum', 'Polygon', 'Solana']).default('Ethereum'),
});
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;

export const QuoteResponseSchema = z.object({
  subtotalEth: z.string(),
  discountEth: z.string(),
  gasFeeEth: z.string(),
  totalEth: z.string(),
  couponCode: z.string().optional(),
  discountPercent: z.number().int().optional(),
  isCouponApplied: z.boolean(),
  couponMessage: z.string().optional(),
  isStale: z.boolean().default(false),
  calculatedAt: z.string(),
});
export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;
