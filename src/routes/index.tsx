import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { NftCardSkeleton } from '@/components/skeletons/ShimmerSkeleton';

const CatalogSearchParamsSchema = z.object({
  search: z.string().optional(),
  collections: z.array(z.string()).optional(),
  networks: z.array(z.string()).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  tab: z.enum(['all', 'new', 'trending']).optional(),
  sortBy: z.enum(['recent', 'price-asc', 'price-desc', 'likes']).optional(),
  page: z.number().int().min(1).optional(),
});

export type CatalogSearchParams = z.infer<typeof CatalogSearchParamsSchema>;

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => {
    return CatalogSearchParamsSchema.parse(search);
  },
  component: HomePage,
});

function HomePage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-8">
      {/* Hero Section */}
      <section className="bg-surface-card border border-border rounded-xl p-6 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="flex flex-col gap-4 max-w-xl z-10">
          <span className="text-xs font-bold text-text-accent tracking-widest uppercase">
            Bem-vindo à Kurio
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            OWN THE FUTURE OF
            <br />
            <span className="text-primary">DIGITAL ART</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Descubra NFTs com curadoria de criadores emergentes e estabelecidos no marketplace GreenMint.
          </p>
          <div className="pt-2">
            <button
              type="button"
              className="bg-primary hover:bg-primary-hover text-ink font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-foreground"
            >
              Explorar Catálogo
            </button>
          </div>
        </div>

        <div className="w-full md:w-[380px] h-[340px] relative rounded-lg overflow-hidden border border-border shadow-2xl flex items-center justify-center bg-surface-dark">
          <img
            src="/assets/nfts/emerald-ape.webp"
            alt="Emerald Ape #042 - Destaque Kurio"
            className="w-full h-full object-cover"
            width={380}
            height={340}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Skeletons de Pré-visualização do Grid de Produtos */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold text-foreground">Catálogo de NFTs</h2>
          <span className="text-xs text-text-secondary">Carregando fixtures do MSW...</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <NftCardSkeleton />
          <NftCardSkeleton />
          <NftCardSkeleton />
          <NftCardSkeleton />
          <NftCardSkeleton />
          <NftCardSkeleton />
        </div>
      </section>
    </div>
  );
}
