import type { User } from '@/contracts/auth';
import type { Nft } from '@/contracts/nft';
import type { Wallet } from '@/contracts/wallet';
import type { CartItem } from '@/contracts/cart';
import type { Order } from '@/contracts/order';
import type { Coupon } from '@/contracts/quote';

export interface UserWithSecret extends User {
  passwordHash: string;
}

export interface DatabaseState {
  users: UserWithSecret[];
  wallets: Wallet[];
  nfts: Nft[];
  favorites: Record<string, string[]>; // userId -> nftId[]
  carts: Record<string, CartItem[]>; // userId/guestId -> CartItem[]
  orders: Order[];
  coupons: Coupon[];
  idempotentOrders: Record<string, { payloadHash: string; order: Order }>;
}

const INITIAL_USERS: UserWithSecret[] = [
  {
    id: 'user_1',
    name: 'Alexandre Hauck',
    username: 'alexandre_kurio',
    email: 'alexandre@kurio.art',
    passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // Simulado para 'kurio123'
    avatarUrl: '/assets/nfts/golden-beat.webp',
    bio: 'Colecionador de arte generativa e NFTs raros.',
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'user_2',
    name: 'Beatriz Mendes',
    username: 'beatriz_m',
    email: 'beatriz@kurio.art',
    passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // Simulado para 'kurio123'
    avatarUrl: '/assets/nfts/emerald-ape.webp',
    bio: 'Curadora de fotografia e arte 3D sustentável.',
    createdAt: '2026-02-15T15:30:00Z',
  },
];

const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'w_1',
    userId: 'user_1',
    name: 'MetaMask Principal',
    address: '0x71C2B895C984c3B821A858712e96d9978EbC4982',
    network: 'Ethereum',
    isPrimary: true,
    isConnected: true,
    balanceEth: '14.50',
  },
  {
    id: 'w_2',
    userId: 'user_1',
    name: 'Polygon Vault',
    address: '0x32A4C982E11D795B4c92A10874e53A1B903C1234',
    network: 'Polygon',
    isPrimary: false,
    isConnected: false,
    balanceEth: '5.20',
  },
  {
    id: 'w_3',
    userId: 'user_2',
    name: 'Solana Collector',
    address: '0x99D1A723B651C44B901C71823a96E423b0989988',
    network: 'Solana',
    isPrimary: true,
    isConnected: true,
    balanceEth: '8.75',
  },
];

const INITIAL_NFTS: Nft[] = [
  {
    id: 'nft_01',
    title: 'Emerald Ape #042',
    description: 'Obra emblemática da coleção gênese de arte digital, com acabamento esmeralda luminoso.',
    collection: 'Arte digital',
    network: 'Ethereum',
    priceEth: '1.19',
    imageUrl: '/assets/nfts/emerald-ape.webp',
    creator: {
      id: 'creator_01',
      name: 'CyberK',
      username: 'cyberk',
      address: '0x882a...4912',
    },
    edition: '01/10',
    totalEditions: 10,
    availableEditions: 7,
    isFeatured: true,
    isTrending: true,
    isNewRelease: false,
    likesCount: 38,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'nft_02',
    title: 'Violet Nomad #314',
    description: 'Nômade místico contemplando os horizontes cibernéticos do metaverso verde.',
    collection: 'Colecionáveis',
    network: 'Ethereum',
    priceEth: '1.39',
    imageUrl: '/assets/nfts/sage-nomad.webp',
    creator: {
      id: 'creator_02',
      name: 'Elena Silva',
      username: 'elenasilva',
      address: '0x334b...1109',
    },
    edition: '02/50',
    totalEditions: 50,
    availableEditions: 10,
    isFeatured: false,
    isTrending: true,
    isNewRelease: true,
    likesCount: 52,
    isFavorited: true,
    version: 1,
    createdAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'nft_03',
    title: 'Neon Vessel #552',
    description: 'Escultura tridimensional em alta fidelidade projetada para galerias virtuais imersivas.',
    collection: 'Arte 3D',
    network: 'Polygon',
    priceEth: '1.99',
    originalPriceEth: '2.29',
    imageUrl: '/assets/nfts/ivory-baron.webp',
    creator: {
      id: 'creator_03',
      name: 'Studio Vector',
      username: 'studiovector',
      address: '0x992c...7741',
    },
    edition: '12/50',
    totalEditions: 50,
    availableEditions: 15,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false,
    likesCount: 94,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-08T18:00:00Z',
  },
  {
    id: 'nft_04',
    title: 'Golden Beat #207',
    description: 'Composição musical sintética sincronizada com ondas visuais douradas.',
    collection: 'Música',
    network: 'Solana',
    priceEth: '0.99',
    imageUrl: '/assets/nfts/golden-beat.webp',
    creator: {
      id: 'creator_04',
      name: 'AcousticAI',
      username: 'acousticai',
      address: '0x551f...8820',
    },
    edition: '08/100',
    totalEditions: 100,
    availableEditions: 42,
    isFeatured: false,
    isTrending: false,
    isNewRelease: true,
    likesCount: 29,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-10T09:30:00Z',
  },
  {
    id: 'nft_05',
    title: 'Ivory Baron #088',
    description: 'Retrato fotográfico conceitual de autoridade barroca no século XXII.',
    collection: 'Fotografia',
    network: 'Ethereum',
    priceEth: '1.79',
    imageUrl: '/assets/nfts/ivory-baron.webp',
    creator: {
      id: 'creator_02',
      name: 'Elena Silva',
      username: 'elenasilva',
      address: '0x334b...1109',
    },
    edition: '04/15',
    totalEditions: 15,
    availableEditions: 12,
    isFeatured: true,
    isTrending: false,
    isNewRelease: false,
    likesCount: 67,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-12T14:00:00Z',
  },
  {
    id: 'nft_06',
    title: 'Cosmic Bloom #118',
    description: 'Algoritmo generativo que recria a flora bioluminescente de nebulosas distantes.',
    collection: 'Generativa',
    network: 'Ethereum',
    priceEth: '1.29',
    imageUrl: '/assets/nfts/emerald-ape.webp',
    creator: {
      id: 'creator_01',
      name: 'CyberK',
      username: 'cyberk',
      address: '0x882a...4912',
    },
    edition: '05/20',
    totalEditions: 20,
    availableEditions: 8,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false,
    likesCount: 45,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-14T11:20:00Z',
  },
  {
    id: 'nft_07',
    title: 'Golden Signal #160',
    description: 'Frequência de áudio decodificada em forma de arte para o metaverso Kurio.',
    collection: 'Metaverso',
    network: 'Polygon',
    priceEth: '0.39',
    imageUrl: '/assets/nfts/golden-beat.webp',
    creator: {
      id: 'creator_04',
      name: 'AcousticAI',
      username: 'acousticai',
      address: '0x551f...8820',
    },
    edition: '15/30',
    totalEditions: 30,
    availableEditions: 11,
    isFeatured: false,
    isTrending: false,
    isNewRelease: true,
    likesCount: 19,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-15T16:00:00Z',
  },
  {
    id: 'nft_08',
    title: 'Cyber Relic #001',
    description: 'Passe de acesso exclusivo com utilidade de governança em eventos futuros.',
    collection: 'Utilidade',
    network: 'Ethereum',
    priceEth: '2.50',
    imageUrl: '/assets/nfts/sage-nomad.webp',
    creator: {
      id: 'creator_03',
      name: 'Studio Vector',
      username: 'studiovector',
      address: '0x992c...7741',
    },
    edition: '01/05',
    totalEditions: 5,
    availableEditions: 2,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false,
    likesCount: 88,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-16T20:00:00Z',
  },
  {
    id: 'nft_09',
    title: 'Elysium Echo #404',
    description: 'Item lendário com todas as edições esgotadas para teste de restrição de compra.',
    collection: 'Jogos',
    network: 'Solana',
    priceEth: '1.45',
    imageUrl: '/assets/nfts/golden-beat.webp',
    creator: {
      id: 'creator_01',
      name: 'CyberK',
      username: 'cyberk',
      address: '0x882a...4912',
    },
    edition: '10/10',
    totalEditions: 10,
    availableEditions: 0, // Esgotado
    isFeatured: false,
    isTrending: false,
    isNewRelease: false,
    likesCount: 110,
    isFavorited: false,
    version: 1,
    createdAt: '2026-03-17T08:00:00Z',
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'KURIO10',
    discountPercent: 10,
    isValid: true,
    isExpired: false,
    description: '10% de desconto na sua primeira compra',
  },
  {
    code: 'GREENMINT20',
    discountPercent: 20,
    isValid: true,
    isExpired: false,
    description: '20% de desconto promocional GreenMint',
  },
  {
    code: 'EXPIRADO10',
    discountPercent: 10,
    isValid: false,
    isExpired: true,
    description: 'Cupom de campanha encerrada',
  },
];

const STORAGE_KEY = '__kurio_msw_db__';

function createInitialState(): DatabaseState {
  return {
    users: [...INITIAL_USERS],
    wallets: [...INITIAL_WALLETS],
    nfts: [...INITIAL_NFTS],
    favorites: {
      user_1: ['nft_02'],
      user_2: ['nft_01', 'nft_05'],
    },
    carts: {
      user_1: [
        {
          nftId: 'nft_01',
          nft: INITIAL_NFTS[0]!,
          quantity: 1,
          priceEth: '1.19',
        },
      ],
      guest: [
        {
          nftId: 'nft_01',
          nft: INITIAL_NFTS[0]!,
          quantity: 2,
          priceEth: '1.19',
        },
        {
          nftId: 'nft_02',
          nft: INITIAL_NFTS[1]!,
          quantity: 6,
          priceEth: '1.39',
        },
        {
          nftId: 'nft_05',
          nft: INITIAL_NFTS[4]!,
          quantity: 9,
          priceEth: '1.79',
        },
      ],
    },
    orders: [],
    coupons: [...INITIAL_COUPONS],
    idempotentOrders: {},
  };
}

export function getDb(): DatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialState();
      saveDb(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return createInitialState();
  }
}

export function saveDb(db: DatabaseState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Continua em fallback in-memory se localStorage falhar
  }
}

export function resetDb(_scenario?: string): DatabaseState {
  const fresh = createInitialState();
  saveDb(fresh);
  return fresh;
}
