import { z } from 'zod';

export const NftCollectionEnum = z.enum([
  'Arte digital',
  'Fotografia',
  'Música',
  'Arte 3D',
  'Colecionáveis',
  'Generativa',
  'Jogos',
  'Metaverso',
  'Utilidade',
]);
export type NftCollection = z.infer<typeof NftCollectionEnum>;

export const NftNetworkEnum = z.enum(['Ethereum', 'Polygon', 'Solana']);
export type NftNetwork = z.infer<typeof NftNetworkEnum>;

export const NftCreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  avatarUrl: z.string().optional(),
  address: z.string(),
});
export type NftCreator = z.infer<typeof NftCreatorSchema>;

export const NftSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  collection: NftCollectionEnum,
  network: NftNetworkEnum,
  priceEth: z.string(),
  originalPriceEth: z.string().optional(),
  imageUrl: z.string(),
  creator: NftCreatorSchema,
  edition: z.string(),
  totalEditions: z.number().int().positive(),
  availableEditions: z.number().int().min(0),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isNewRelease: z.boolean().default(false),
  likesCount: z.number().int().min(0).default(0),
  isFavorited: z.boolean().default(false),
  version: z.number().int().min(1).default(1),
  createdAt: z.string(),
});
export type Nft = z.infer<typeof NftSchema>;

export const NftFilterParamsSchema = z.object({
  search: z.string().optional(),
  collections: z.array(z.string()).optional(),
  networks: z.array(z.string()).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  tab: z.enum(['all', 'new', 'trending']).default('all'),
  sortBy: z.enum(['recent', 'price-asc', 'price-desc', 'likes']).default('recent'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(9),
});
export type NftFilterParams = z.infer<typeof NftFilterParamsSchema>;
