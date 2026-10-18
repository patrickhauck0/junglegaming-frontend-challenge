import { z } from 'zod';
import { NftSchema } from './nft';

export const CartItemSchema = z.object({
  nftId: z.string(),
  nft: NftSchema,
  quantity: z.number().int().min(1),
  priceEth: z.string(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  userId: z.string().optional(),
  items: z.array(CartItemSchema),
  totalItems: z.number().int().min(0),
  subtotalEth: z.string(),
  updatedAt: z.string(),
});
export type Cart = z.infer<typeof CartSchema>;

export const AddToCartRequestSchema = z.object({
  nftId: z.string(),
  quantity: z.number().int().min(1).default(1),
});
export type AddToCartRequest = z.infer<typeof AddToCartRequestSchema>;

export const UpdateCartItemRequestSchema = z.object({
  quantity: z.number().int().min(1),
});
export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemRequestSchema>;
