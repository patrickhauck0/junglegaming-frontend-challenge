import { z } from 'zod';

export const OrderItemSnapshotSchema = z.object({
  nftId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  quantity: z.number().int().min(1),
  priceEth: z.string(),
  edition: z.string(),
});
export type OrderItemSnapshot = z.infer<typeof OrderItemSnapshotSchema>;

export const OrderStatusEnum = z.enum(['pending', 'confirmed', 'declined']);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: OrderStatusEnum,
  items: z.array(OrderItemSnapshotSchema),
  subtotalEth: z.string(),
  discountEth: z.string(),
  gasFeeEth: z.string(),
  totalEth: z.string(),
  couponCode: z.string().optional(),
  walletAddress: z.string(),
  network: z.string(),
  transactionHash: z.string(),
  idempotencyKey: z.string(),
  createdAt: z.string(),
  confirmedAt: z.string().optional(),
  declinedReason: z.string().optional(),
});
export type Order = z.infer<typeof OrderSchema>;

export const CreateOrderRequestSchema = z.object({
  items: z.array(
    z.object({
      nftId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
  couponCode: z.string().optional(),
  walletAddress: z.string().min(1, 'Selecione uma carteira conectada'),
  network: z.string().min(1, 'Selecione a rede blockchain'),
});
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
