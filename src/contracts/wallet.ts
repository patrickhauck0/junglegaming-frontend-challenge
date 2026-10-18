import { z } from 'zod';

export const WalletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  address: z.string().min(10, 'Endereço de carteira inválido'),
  network: z.enum(['Ethereum', 'Polygon', 'Solana']),
  isPrimary: z.boolean(),
  isConnected: z.boolean().default(true),
  balanceEth: z.string(),
});
export type Wallet = z.infer<typeof WalletSchema>;

export const CreateWalletRequestSchema = z.object({
  name: z.string().min(2, 'Nome da carteira é obrigatório'),
  address: z.string().min(10, 'Endereço de carteira inválido'),
  network: z.enum(['Ethereum', 'Polygon', 'Solana']),
  isPrimary: z.boolean().default(false),
});
export type CreateWalletRequest = z.infer<typeof CreateWalletRequestSchema>;

export const UpdateWalletRequestSchema = z.object({
  name: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isConnected: z.boolean().optional(),
});
export type UpdateWalletRequest = z.infer<typeof UpdateWalletRequestSchema>;
